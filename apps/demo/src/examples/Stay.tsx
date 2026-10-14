import { useCallback, useMemo, useRef, useState } from "react";
import {
    Calendar,
    type CalendarController,
    type CalendarDate,
    type DateRange,
    type DayRenderContext,
    type SelectionRules,
    addDays,
    countNights,
    getIncludedDays,
    getToday,
    getMonth,
    lastDayOfMonth,
    messagesTr,
    stayRules,
    toCalendarMonth,
} from "calendar-kit";
import { formatTRY, useAvailability } from "../data";

/** Consumer-owned booking state: the calendar only ever sees `dates`. */
interface Booking {
    dates: DateRange;
    checkInTime: "14:00";
    checkOutTime: "09:00" | "18:00";
}

const TODAY = getToday({ timeZone: "Europe/Istanbul" });
const MAX = lastDayOfMonth(
    toCalendarMonth(`${Number(TODAY.slice(0, 4)) + 2}-12`)
);
const trMessages = {
    ...messagesTr,
    dayReasons: {
        ...messagesTr.dayReasons,
        "late-checkout": "Geç çıkış yapılamaz",
    },
};

function useStayCalendar() {
    const [booking, setBooking] = useState<Booking>({
        dates: { start: null, end: null },
        checkInTime: "14:00",
        checkOutTime: "09:00",
    });
    const availability = useAvailability();
    const { dayInfo } = availability;
    // Business rules. Late check-out depends on consumer state, passed as ruleContext.
    const rules = useMemo<(SelectionRules<Booking> | false)[]>(
        () => [
            stayRules<Booking>({
                minNights: 2,
                disablePast: true,
                maxDate: MAX,
                getDayStatus: (d) => dayInfo(d)?.status,
            }),
            {
                getDayAvailability: (d, ctx) =>
                    ctx.context.checkOutTime === "18:00" &&
                    dayInfo(d)?.status === "booked"
                        ? { canEnd: false, reason: "late-checkout" }
                        : undefined,
            },
        ],
        [dayInfo]
    );
    const total = useMemo(
        () =>
            getIncludedDays(booking.dates, "exclusive").reduce(
                (sum, d) => sum + (dayInfo(d)?.price ?? 0),
                0
            ),
        [booking.dates, dayInfo]
    );
    return { booking, setBooking, rules, total, ...availability };
}

// Example of a consumer modifier: turnover days of other bookings (the
// reference images show pink marks; their business meaning is the app's).
function useTurnover(
    dayInfo: (d: CalendarDate) => { status: string } | undefined
) {
    return useMemo(
        () => ({
            "turnover-in": ({ date }: { date: CalendarDate }) =>
                dayInfo(date)?.status === "booked" &&
                dayInfo(addDays(date, -1))?.status !== "booked",
            "turnover-out": ({ date }: { date: CalendarDate }) =>
                dayInfo(date)?.status !== "booked" &&
                dayInfo(addDays(date, -1))?.status === "booked",
        }),
        [dayInfo]
    );
}

function guidanceTooltip(phaseStartOnly: boolean) {
    return ({ day }: DayRenderContext) => {
        if (day.reasonText && (day.disabled || day.unavailable) && !day.past)
            return day.reasonText;
        if (phaseStartOnly && day.selectedStart)
            return { content: "Çıkış tarihini seçin", persistent: true };
        return null;
    };
}

export function StayReference() {
    const s = useStayCalendar();
    const ref = useRef<CalendarController>(null);
    const modifiers = useTurnover(s.dayInfo);
    const startOnly = !!s.booking.dates.start && !s.booking.dates.end;
    const getDayTooltip = useCallback(guidanceTooltip(startOnly), [startOnly]); // eslint-disable-line react-hooks/exhaustive-deps
    const nights = countNights(s.booking.dates);

    return (
        <Calendar<unknown, Booking>
            ref={ref}
            className="ref-look"
            mode="range"
            locale="tr-TR"
            messages={trMessages}
            numberOfMonths={2}
            minDate={TODAY.slice(0, 8).concat("01") as CalendarDate}
            maxDate={MAX}
            value={s.booking.dates}
            onChange={(dates) => s.setBooking((b) => ({ ...b, dates }))}
            rules={s.rules}
            ruleContext={s.booking}
            getDataStatus={s.getDataStatus}
            onRenderedMonthsChange={(e) => s.ensure(e.months)}
            onRetry={s.retry}
            modifiers={modifiers}
            getDayTooltip={getDayTooltip}
            renderFooter={(ctx) => (
                <div className="ref-footer">
                    <div className="ref-row">
                        <span>Check-out:</span>
                        {(["09:00", "18:00"] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                className="pill"
                                aria-pressed={s.booking.checkOutTime === t}
                                onClick={() =>
                                    s.setBooking((b) => ({
                                        ...b,
                                        checkOutTime: t,
                                    }))
                                }
                            >
                                {t}
                            </button>
                        ))}
                        <label className="toggle">
                            Özel tarih: <input type="checkbox" role="switch" />
                        </label>
                    </div>
                    <div className="ref-row ref-summary">
                        <dl>
                            <div>
                                <dt>Toplam</dt>
                                <dd>
                                    {nights ? `${formatTRY(s.total)} ₺` : "—"}
                                </dd>
                            </div>
                            <div>
                                <dt>Check-in</dt>
                                <dd>{s.booking.checkInTime}</dd>
                            </div>
                            <div>
                                <dt>Check-out</dt>
                                <dd>{s.booking.checkOutTime}</dd>
                            </div>
                        </dl>
                        {!ctx.validation.valid && ctx.validation.issue && (
                            <p className="warn">Seçim artık geçerli değil.</p>
                        )}
                        <button
                            type="button"
                            className="link"
                            onClick={() => ctx.actions.clear()}
                        >
                            Temizle
                        </button>
                        <button
                            type="button"
                            className="primary"
                            disabled={
                                ctx.phase !== "complete" ||
                                !ctx.validation.valid
                            }
                            onClick={() => alert(JSON.stringify(s.booking))}
                        >
                            Kaydet
                        </button>
                    </div>
                </div>
            )}
        />
    );
}

export function StayMobile() {
    const s = useStayCalendar();
    const startOnly = !!s.booking.dates.start && !s.booking.dates.end;
    const getDayTooltip = useCallback(guidanceTooltip(startOnly), [startOnly]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="phone">
            <Calendar<unknown, Booking>
                className="ref-look"
                mode="range"
                locale="tr-TR"
                messages={trMessages}
                orientation="vertical"
                navigation="continuous"
                loadDirections="both"
                numberOfMonths={2}
                monthsPerLoad={2}
                defaultVisibleMonth={getMonth(addDays(TODAY, 60))}
                minDate={TODAY}
                maxDate={MAX}
                maxBlockSize={520}
                value={s.booking.dates}
                onChange={(dates) => s.setBooking((b) => ({ ...b, dates }))}
                rules={s.rules}
                ruleContext={s.booking}
                getDataStatus={s.getDataStatus}
                onRenderedMonthsChange={(e) => s.ensure(e.months)}
                onRetry={s.retry}
                getDayTooltip={getDayTooltip}
                renderFooter={() => (
                    <label className="toggle">
                        Özel tarih: <input type="checkbox" role="switch" />
                    </label>
                )}
            />
        </div>
    );
}
