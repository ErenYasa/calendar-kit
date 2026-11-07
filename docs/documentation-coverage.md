# Documentation coverage

Audit of the English docs site (`apps/demo`) against the real public API of `calendar-kit`, built from the package
sources rather than from the docs:

- `packages/calendar-kit/src/index.ts` (= `core.ts` + `Calendar` + every type of `react/types.ts`), `src/core.ts`, `src/client.ts`
  and the `package.json` `exports` (`calendar-kit`, `/core`, `/client`, `/styles.css`);
- `CalendarProps` = `CalendarBaseProps` (including the `CalendarEventHandlers` it extends) + the four selection prop interfaces;
- `SelectionRules` and `DayAvailability` (`src/core/types.ts`), the adapter options (`BaseRules`, `StayRulesOptions`,
  `DayRangeRulesOptions` in `src/adapters/index.ts`);
- `CalendarController`, `CalendarSnapshot`, `SlotContext`, `CalendarPart`, `CalendarMessages`;
- the CSS custom properties declared on `.cal-root` in `src/styles/index.scss` (public), plus the variables the
  component writes inline (internal, listed separately);
- the `data-*` attributes from `dayDataAttributes` (`src/react/Day.tsx`) and those set on the root, months, cells and other
  elements in `src/react/Calendar.tsx` / `Tooltip.tsx`.

How to read the matrix:

- **Docs page** is the hash route of the page (`#/<slug>` from `apps/demo/src/docs/nav.ts`) that explains the item; the first one
  is the main reference.
- **Example** is a live example (`apps/demo/src/examples/…`) or code snippet (`apps/demo/src/snippets/…`) that actually uses the
  item (at most two are listed, live examples first). `—` means no example or snippet uses it; that is not by itself a
  documentation gap.
- **Status**: `complete` only when the page explains the behaviour (what it does, default, interactions), not when it only
  mentions the name; `partial` / `missing` carry a note. Pages were judged by reading them.
- Event payload types are rows of the *Type* group; each has its own payload table on `#/api-events`.

`apps/demo/test/coverage.test.tsx` fails when a public item is missing from this file (runtime exports, props, controller
members, `CalendarPart` keys, public CSS variables, `dayDataAttributes` keys) or when a referenced page slug or
example/snippet file does not exist.

## Summary

| Status | Items |
| --- | --- |
| complete | 436 |
| partial | 0 (API items) |
| missing | 0 |
| **total** | **436** |

### Items with status partial or missing

- none

### Items without a live example or snippet

These are documented (see their status) but no file under `examples/` or `snippets/` uses them by name. Types are left out of this list: examples mostly rely on inference rather than naming them.

- SlotContext field (3): `instanceId`, `messages`, `locale`
- SelectionRules field (1): `disableFuture` (used as the Calendar prop in `examples/features/PastFuture.tsx`)
- Adapter option (shared base) (5): `minDate`, `disableFuture`, `getDataStatus`, `unknownDataPolicy`, `validateSelection`
- classNames key (11): `viewport`, `months`, `month`, `grid`, `rangeBackground`, `tooltip`, `loadMore`, `loading`, `error`, `liveRegion`, `readOnlyNotice`
- CSS variable (internal, set inline) (8): `--cal-day-min-w`, `--cal-day-min-h`, `--cal-day-max`, `--cal-month-gap`, `--cal-month-padding`, `--cal-month-min`, `--cal-columns`, `--cal-tooltip-arrow`
- data attribute (day cell + button) (16): `data-date`, `data-past`, `data-out-of-schedule`, `data-included`, `data-preview`, `data-preview-start`, `data-focused`, `data-hovered`, `data-loading`, `data-status`, `data-reason`, `data-day-reason`, `data-week-start`, `data-week-end`, `data-month-start`, `data-month-end`
- data attribute (root) (8): `data-mode`, `data-phase`, `data-orientation`, `data-navigation`, `data-overflow`, `data-at-min-size`, `data-measured`, `data-highlight-today`
- data attribute (month) (3): `data-month`, `data-status`, `data-skeleton`
- data attribute (tooltip) (1): `data-placement`
- CalendarMessages key (20): `calendar`, `previousMonth`, `nextMonth`, `loadNext`, `loadPrevious`, `loading`, `error`, `retry`, `today`, `selected`, `rangeStart`, `rangeEnd`, `inRange`, `unavailable`, `announceStart`, `announceSingle`, `announceAdded`, `announceRemoved`, `announceCleared`, `announceRejected`

## Coverage matrix

### Entry point (4)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `calendar-kit` | Entry point | `#/react-nextjs`, `#/installation` | `examples/concepts/Controlled.tsx`, `examples/concepts/RangeSemantics.tsx` | complete |  |
| `calendar-kit/core` | Entry point | `#/react-nextjs`, `#/api-dates` | `snippets/helpers/arithmetic.ts`, `snippets/helpers/comparing.ts` | complete |  |
| `calendar-kit/client` | Entry point | `#/react-nextjs` | `snippets/next/page.tsx` | complete |  |
| `calendar-kit/styles.css` | Entry point | `#/installation`, `#/styling` | `examples/start/QuickStart.tsx`, `examples/styling/CssVariables.css` | complete |  |

### Runtime export (58)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `addDays` | Runtime export | `#/api-dates` | `examples/concepts/Controlled.tsx`, `examples/concepts/Uncontrolled.tsx` | complete |  |
| `addMonths` | Runtime export | `#/api-dates` | `snippets/helpers/arithmetic.ts` | complete |  |
| `addMonthsToMonth` | Runtime export | `#/api-dates` | `examples/events/ControlledMonth.tsx`, `examples/events/ControllerButtons.tsx` | complete |  |
| `clampDate` | Runtime export | `#/api-dates` | `snippets/helpers/arithmetic.ts` | complete |  |
| `compareDates` | Runtime export | `#/api-dates` | `snippets/helpers/comparing.ts` | complete |  |
| `createDate` | Runtime export | `#/api-dates` | `snippets/helpers/parsing.ts` | complete |  |
| `createMonth` | Runtime export | `#/api-dates` | `snippets/helpers/parsing.ts` | complete |  |
| `daysInMonth` | Runtime export | `#/api-dates` | `snippets/helpers/parts.ts` | complete |  |
| `diffDays` | Runtime export | `#/api-dates` | `snippets/helpers/arithmetic.ts` | complete |  |
| `diffMonths` | Runtime export | `#/api-dates` | `snippets/helpers/arithmetic.ts` | complete |  |
| `eachDay` | Runtime export | `#/api-dates` | `examples/features/CustomValidation.tsx`, `snippets/helpers/arithmetic.ts` | complete |  |
| `eachMonth` | Runtime export | `#/api-dates` | `snippets/helpers/arithmetic.ts` | complete |  |
| `firstDayOfMonth` | Runtime export | `#/api-dates` | `examples/features/Slots.tsx`, `snippets/helpers/parts.ts` | complete |  |
| `fromJSDate` | Runtime export | `#/api-dates` | `snippets/helpers/today.ts`, `snippets/migration.tsx` | complete |  |
| `getDateParts` | Runtime export | `#/api-dates` | `examples/helpers/CustomMessages.tsx`, `snippets/helpers/parts.ts` | complete |  |
| `getMonth` | Runtime export | `#/api-dates` | `examples/concepts/Uncontrolled.tsx`, `examples/events/ControlledMonth.tsx` | complete |  |
| `getMonthParts` | Runtime export | `#/api-dates` | `snippets/helpers/parts.ts` | complete |  |
| `getToday` | Runtime export | `#/api-dates` | `examples/concepts/Controlled.tsx`, `examples/concepts/Uncontrolled.tsx` | complete |  |
| `getWeekday` | Runtime export | `#/api-dates` | `examples/features/CustomValidation.tsx`, `snippets/helpers/parts.ts` | complete |  |
| `isAfter` | Runtime export | `#/api-dates` | `snippets/helpers/comparing.ts` | complete |  |
| `isBefore` | Runtime export | `#/api-dates` | `snippets/helpers/comparing.ts`, `snippets/migration.tsx` | complete |  |
| `isCalendarDate` | Runtime export | `#/api-dates` | `snippets/helpers/parsing.ts` | complete |  |
| `isLeapYear` | Runtime export | `#/api-dates` | `snippets/helpers/parts.ts` | complete |  |
| `isSameDate` | Runtime export | `#/api-dates` | `snippets/helpers/comparing.ts` | complete |  |
| `isWithin` | Runtime export | `#/api-dates` | `snippets/helpers/comparing.ts` | complete |  |
| `lastDayOfMonth` | Runtime export | `#/api-dates` | `examples/events/ControlledMonth.tsx`, `snippets/helpers/parts.ts` | complete |  |
| `parseDate` | Runtime export | `#/api-dates` | `snippets/helpers/messages.ts`, `snippets/helpers/parsing.ts` | complete |  |
| `parseMonth` | Runtime export | `#/api-dates` | `snippets/events/navigation.tsx`, `snippets/helpers/parsing.ts` | complete |  |
| `toCalendarDate` | Runtime export | `#/api-dates` | `snippets/helpers/arithmetic.ts`, `snippets/helpers/comparing.ts` | complete |  |
| `toCalendarMonth` | Runtime export | `#/api-dates` | `snippets/helpers/arithmetic.ts`, `snippets/helpers/locale.ts` | complete |  |
| `toUTCDate` | Runtime export | `#/api-dates` | `snippets/helpers/today.ts` | complete |  |
| `formatDate` | Runtime export | `#/api-messages` | `examples/features/Slots.tsx`, `examples/styling-ref/Slots.tsx` | complete |  |
| `formatMonth` | Runtime export | `#/api-messages` | `examples/events/ControlledMonth.tsx`, `snippets/events/navigation.tsx` | complete |  |
| `getDefaultFirstDayOfWeek` | Runtime export | `#/api-messages` | `snippets/helpers/locale.ts` | complete |  |
| `getLocaleDirection` | Runtime export | `#/api-messages` | `snippets/helpers/locale.ts` | complete |  |
| `getWeekdayNames` | Runtime export | `#/api-messages` | `snippets/helpers/locale.ts` | complete |  |
| `countDays` | Runtime export | `#/api-dates` | `examples/concepts/RangeSemantics.tsx`, `examples/features/FixedLength.tsx` | complete |  |
| `countNights` | Runtime export | `#/api-dates` | `examples/concepts/RangeSemantics.tsx`, `examples/concepts/SameDay.tsx` | complete |  |
| `createSelectionEngine` | Runtime export | `#/api-rules` | `snippets/rules/combine-functions.ts`, `snippets/rules/day-statuses.ts` | complete |  |
| `getIncludedDays` | Runtime export | `#/api-dates` | `examples/recipes/HomeRental.tsx`, `snippets/helpers/ranges.ts` | complete |  |
| `getRangeLength` | Runtime export | `#/api-dates` | `snippets/helpers/ranges.ts` | complete |  |
| `getSelectionPhase` | Runtime export | `#/api-dates` | `examples/features/ModeRange.tsx`, `snippets/helpers/ranges.ts` | complete |  |
| `combineRules` | Runtime export | `#/api-rules` | `examples/rules/CombinedRules.tsx`, `snippets/rules/combine-fields.ts` | complete |  |
| `relaxRules` | Runtime export | `#/api-rules` | `snippets/rules/relax.ts` | complete |  |
| `closedDates` | Runtime export | `#/api-rules` | `examples/features/ModeReadonly.tsx`, `examples/rules/CombinedRules.tsx` | complete |  |
| `dayRangeRules` | Runtime export | `#/api-rules` | `examples/concepts/RangeSemantics.tsx`, `examples/features/FixedLength.tsx` | complete |  |
| `stayRules` | Runtime export | `#/api-rules` | `examples/concepts/RangeSemantics.tsx`, `examples/concepts/SameDay.tsx` | complete |  |
| `formatIssue` | Runtime export | `#/api-messages` | `snippets/helpers/messages.ts` | complete |  |
| `mergeMessages` | Runtime export | `#/api-messages` | `examples/helpers/CustomMessages.tsx`, `snippets/helpers/messages.ts` | complete |  |
| `messagesEn` | Runtime export | `#/api-messages` | `examples/helpers/CustomMessages.tsx`, `snippets/helpers/messages.ts` | complete |  |
| `messagesTr` | Runtime export | `#/api-messages` | `examples/features/LocaleTurkish.tsx` | complete |  |
| `messagesAr` | Runtime export | `#/api-messages` | `examples/features/Rtl.tsx` | complete |  |
| `messagesDe` | Runtime export | `#/api-messages` | `examples/helpers/CustomMessages.tsx`, `snippets/helpers/messages.ts` | complete |  |
| `messagesEs` | Runtime export | `#/api-messages` | `examples/features/MoreLocales.tsx` | complete |  |
| `messagesFr` | Runtime export | `#/api-messages` | `examples/features/MoreLocales.tsx` | complete |  |
| `messagesIt` | Runtime export | `#/api-messages` | `examples/features/MoreLocales.tsx` | complete |  |
| `messagesNl` | Runtime export | `#/api-messages` | `examples/features/MoreLocales.tsx` | complete |  |
| `Calendar` | Runtime export | `#/api-props`, `#/installation` | `examples/concepts/Controlled.tsx`, `examples/concepts/RangeSemantics.tsx` | complete |  |

### Type (96)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `CalendarDate` | Type | `#/api-dates`, `#/api-types` | `examples/concepts/Controlled.tsx`, `examples/features/DayContent.tsx` | complete |  |
| `CalendarMonth` | Type | `#/api-dates`, `#/api-types` | `examples/events/ControlledMonth.tsx`, `examples/styling-ref/AllVariables.tsx` | complete |  |
| `DateParts` | Type | `#/api-dates`, `#/api-types` | — | complete |  |
| `Weekday` | Type | `#/api-dates`, `#/api-types` | `examples/features/Tooltip.tsx`, `snippets/helpers/locale.ts` | complete |  |
| `ActivationKind` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `ActivationPlan` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `DataStatus` | Type | `#/loading`, `#/api-types` | `snippets/events/data-layout.tsx`, `snippets/styling/statusSlots.tsx` | complete |  |
| `DateRange` | Type | `#/core-concepts`, `#/api-types` | `examples/concepts/RangeSemantics.tsx`, `examples/concepts/SameDay.tsx` | complete |  |
| `DayAvailability` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `IssueParams` | Type | `#/api-messages`, `#/api-types` | — | complete |  |
| `RangeEndpoint` | Type | `#/api-controller`, `#/api-types` | `examples/features/Synced.tsx`, `examples/recipes/ThreeCalendars.tsx` | complete |  |
| `RangeSemantics` | Type | `#/core-concepts`, `#/api-types` | `examples/concepts/RangeSemantics.tsx`, `snippets/helpers/ranges.ts` | complete |  |
| `ReasonCode` | Type | `#/api-messages`, `#/api-types` | — | complete |  |
| `RuleContext` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `Selection` | Type | `#/api-controller`, `#/api-types` | `snippets/events/selection.tsx` | complete |  |
| `SelectionMode` | Type | `#/core-concepts`, `#/api-types` | — | complete |  |
| `SelectionPhase` | Type | `#/core-concepts`, `#/api-types` | — | complete |  |
| `SelectionRules` | Type | `#/api-rules`, `#/api-types` | `examples/features/CustomValidation.tsx`, `examples/features/GoToMonth.tsx` | complete |  |
| `SelectionState` | Type | `#/api-rules`, `#/api-types` | `snippets/rules/engine-plan.ts` | complete |  |
| `ValidationIssue` | Type | `#/api-messages`, `#/api-types` | — | complete |  |
| `ValidationResult` | Type | `#/api-events`, `#/api-types` | `snippets/events/selection.tsx` | complete |  |
| `SelectionEngine` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `SelectionEngineInput` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `RelaxScheduleOptions` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `DayRangeRulesOptions` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `DayRangeStatus` | Type | `#/api-rules`, `#/api-types` | `examples/rules/DayRangeStatuses.tsx`, `snippets/rules/day-statuses.ts` | complete |  |
| `StayDayStatus` | Type | `#/api-rules`, `#/api-types` | `examples/rules/StayStatuses.tsx`, `snippets/rules/stay-statuses.ts` | complete |  |
| `StayReason` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `StayRulesOptions` | Type | `#/api-rules`, `#/api-types` | — | complete |  |
| `CalendarMessages` | Type | `#/api-messages`, `#/api-types` | — | complete |  |
| `CalendarMessagesInput` | Type | `#/api-messages`, `#/api-types` | `examples/helpers/CustomMessages.tsx`, `snippets/helpers/messages.ts` | complete |  |
| `MessageFormatHelpers` | Type | `#/api-messages`, `#/api-types` | `snippets/helpers/messages.ts` | complete |  |
| `ReasonMessage` | Type | `#/api-messages`, `#/api-types` | — | complete |  |
| `EventSource` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `ReadyEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `DateClickEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `ChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `SelectionCompleteEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `SelectionClearEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `InvalidSelectionEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `ValidationChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `ActiveEndpointChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `VisibleMonthChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `VisibleMonthsChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `RenderedMonthsChangeEvent` | Type | `#/api-events`, `#/api-types` | `snippets/events/data-layout.tsx` | complete |  |
| `LoadMoreEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `LoadingChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `ResizeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `LayoutChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `DayFocusChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `TooltipOpenChangeEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `OutsideClickEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `ScrollEvent` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `CalendarEvent` | Type | `#/api-events`, `#/api-types` | `snippets/events/misc.tsx` | complete |  |
| `CalendarEventType` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `CalendarEventHandlers` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `SingleSelectionProps` | Type | `#/api-props`, `#/api-types` | — | complete |  |
| `RangeSelectionProps` | Type | `#/api-props`, `#/api-types` | — | complete |  |
| `MultipleSelectionProps` | Type | `#/api-props`, `#/api-types` | — | complete |  |
| `ReadonlySelectionProps` | Type | `#/api-props`, `#/api-types` | — | complete |  |
| `SelectionProps` | Type | `#/api-props`, `#/api-types` | — | complete |  |
| `DayState` | Type | `#/styling-reference`, `#/api-types` | `examples/styling/DataAttributes.tsx`, `examples/styling-ref/StateAttributes.tsx` | complete |  |
| `DayRenderContext` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `DayPropsInput` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `DayProps` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `DayRenderProps` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `DefaultDayData` | Type | `#/day-content`, `#/api-types` | `examples/features/DayContent.tsx`, `snippets/events/data-layout.tsx` | complete |  |
| `TooltipTrigger` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `TooltipContent` | Type | `#/tooltip`, `#/api-types` | — | complete |  |
| `TooltipPlacement` | Type | `#/tooltip`, `#/api-types` | — | complete |  |
| `TooltipBoundary` | Type | `#/tooltip`, `#/api-types` | — | complete |  |
| `TooltipOptions` | Type | `#/tooltip`, `#/api-types` | — | complete |  |
| `DayTooltipRenderProps` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `Orientation` | Type | `#/orientation`, `#/api-types` | — | complete |  |
| `OverflowStrategy` | Type | `#/responsive`, `#/api-types` | — | complete |  |
| `NavigationMode` | Type | `#/load-more`, `#/api-types` | — | complete |  |
| `LoadMoreMode` | Type | `#/load-more`, `#/api-types` | — | complete |  |
| `LoadDirection` | Type | `#/load-more`, `#/api-types` | — | complete |  |
| `CalendarLayout` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `LoadingSnapshot` | Type | `#/api-events`, `#/api-types` | — | complete |  |
| `LoadingScope` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `LoadingRenderProps` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `ErrorRenderProps` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `LoadMoreRenderProps` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `NavigationRenderProps` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `MonthHeaderRenderProps` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `GoToMonthOptions` | Type | `#/api-controller`, `#/api-types` | — | complete |  |
| `GoToMonthResult` | Type | `#/api-controller`, `#/api-types` | — | complete |  |
| `CalendarController` | Type | `#/api-controller`, `#/api-types` | `examples/events/ControllerButtons.tsx`, `examples/features/GoToMonth.tsx` | complete |  |
| `CalendarSnapshot` | Type | `#/api-controller`, `#/api-types` | `examples/events/ControllerButtons.tsx` | complete |  |
| `SlotContext` | Type | `#/styling-reference`, `#/api-types` | `examples/styling-ref/Slots.tsx` | complete |  |
| `CalendarPart` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `ClassNameValue` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `CalendarClassNames` | Type | `#/styling-reference`, `#/api-types` | — | complete |  |
| `CalendarBaseProps` | Type | `#/api-props`, `#/api-types` | — | complete |  |
| `CalendarProps` | Type | `#/api-props`, `#/api-types` | — | complete |  |

### Prop (67)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `id` | Prop | `#/api-props`, `#/api-events` | `snippets/props/more.tsx` | complete |  |
| `className` | Prop | `#/api-props`, `#/styling` | `examples/styling/CssVariables.tsx`, `examples/styling-ref/AllVariables.tsx` | complete |  |
| `style` | Prop | `#/api-props`, `#/styling` | `snippets/props/more.tsx` | complete |  |
| `classNames` | Prop | `#/api-props`, `#/styling-reference` | `examples/styling/ClassNames.tsx`, `examples/styling/DataAttributes.tsx` | complete |  |
| `unstyled` | Prop | `#/api-props`, `#/styling-reference` | `examples/styling/Unstyled.tsx`, `snippets/styling/unstyled.tsx` | complete |  |
| `aria-label` | Prop | `#/api-props` | `examples/features/PastFuture.tsx`, `examples/features/Synced.tsx` | complete |  |
| `locale` | Prop | `#/api-props`, `#/i18n` | `examples/features/LocaleTurkish.tsx`, `examples/features/Rtl.tsx` | complete |  |
| `direction` | Prop | `#/api-props`, `#/i18n` | `snippets/props/more.tsx` | complete |  |
| `firstDayOfWeek` | Prop | `#/api-props`, `#/i18n` | `examples/features/WeekStart.tsx` | complete |  |
| `messages` | Prop | `#/api-props`, `#/api-messages` | `examples/features/LocaleTurkish.tsx`, `examples/features/Rtl.tsx` | complete |  |
| `monthTitleFormat` | Prop | `#/api-props`, `#/api-messages` | `snippets/props/more.tsx` | complete |  |
| `weekdayFormat` | Prop | `#/api-props`, `#/i18n` | `examples/features/WeekStart.tsx` | complete |  |
| `formatMonthTitle` | Prop | `#/api-props`, `#/i18n` | `snippets/props/more.tsx` | complete |  |
| `formatWeekday` | Prop | `#/api-props`, `#/i18n` | `snippets/props/more.tsx` | complete |  |
| `formatDayLabel` | Prop | `#/api-props`, `#/i18n` | `snippets/props/more.tsx` | complete |  |
| `today` | Prop | `#/api-props`, `#/date-limits` | `examples/rules/CombinedRules.tsx`, `examples/rules/DayRangeStatuses.tsx` | complete |  |
| `timeZone` | Prop | `#/api-props`, `#/date-limits` | `examples/features/TodayMarker.tsx` | complete |  |
| `highlightToday` | Prop | `#/api-props`, `#/date-limits` | `examples/features/TodayMarker.tsx` | complete |  |
| `rules` | Prop | `#/api-props`, `#/api-rules` | `examples/concepts/RangeSemantics.tsx`, `examples/concepts/SameDay.tsx` | complete |  |
| `minDate` | Prop | `#/api-props`, `#/date-limits` | `examples/events/ControlledMonth.tsx`, `examples/events/ControllerButtons.tsx` | complete |  |
| `maxDate` | Prop | `#/api-props`, `#/date-limits` | `examples/events/ControlledMonth.tsx`, `examples/events/ControllerButtons.tsx` | complete |  |
| `disablePast` | Prop | `#/api-props`, `#/date-limits` | `examples/features/PastFuture.tsx`, `examples/features/Synced.tsx` | complete |  |
| `disableFuture` | Prop | `#/api-props`, `#/date-limits` | `examples/features/DisableFutureWindow.tsx`, `examples/features/PastFuture.tsx` | complete |  |
| `ruleContext` | Prop | `#/api-props`, `#/day-rules` | `examples/recipes/HomeRental.tsx` | complete |  |
| `relaxSchedule` | Prop | `#/api-props`, `#/api-rules` | `examples/recipes/BoatRental.tsx`, `examples/recipes/HomeRental.tsx` | complete |  |
| `getDayData` | Prop | `#/api-props`, `#/day-content` | `examples/features/DayContent.tsx`, `examples/recipes/EventTickets.tsx` | complete |  |
| `getDataStatus` | Prop | `#/api-props`, `#/loading` | `examples/features/LoadingIndicator.tsx`, `examples/features/MonthData.tsx` | complete |  |
| `loading` | Prop | `#/api-props`, `#/loading` | `examples/features/InitialLoad.tsx` | complete |  |
| `onRetry` | Prop | `#/api-props`, `#/loading` | `examples/features/LoadingIndicator.tsx`, `examples/features/MonthData.tsx` | complete |  |
| `modifiers` | Prop | `#/api-props`, `#/styling-reference` | `examples/styling/DataAttributes.tsx`, `examples/styling-ref/StateAttributes.tsx` | complete |  |
| `renderDay` | Prop | `#/api-props`, `#/styling-reference` | `examples/styling/RenderDay.tsx`, `snippets/styling/getDayProps.tsx` | complete |  |
| `renderDayContent` | Prop | `#/api-props`, `#/styling-reference` | `examples/styling/DayContentRender.tsx`, `examples/styling-ref/Slots.tsx` | complete |  |
| `getDayTooltip` | Prop | `#/api-props`, `#/tooltip` | `examples/features/Tooltip.tsx`, `examples/features/TooltipViewport.tsx` | complete |  |
| `renderDayTooltip` | Prop | `#/api-props`, `#/styling-reference` | `examples/styling-ref/Slots.tsx` | complete |  |
| `tooltip` | Prop | `#/api-props`, `#/tooltip` | `examples/features/Modal.tsx`, `examples/features/Tooltip.tsx` | complete |  |
| `renderHeader` | Prop | `#/api-props`, `#/slots` | `examples/features/Slots.tsx`, `examples/styling-ref/Slots.tsx` | complete |  |
| `renderFooter` | Prop | `#/api-props`, `#/slots` | `examples/features/LoadMoreManual.tsx`, `examples/features/Slots.tsx` | complete |  |
| `renderMonthHeader` | Prop | `#/api-props`, `#/styling-reference` | `examples/features/CustomNavigation.tsx`, `examples/styling-ref/Slots.tsx` | complete |  |
| `renderNavigation` | Prop | `#/api-props`, `#/styling-reference` | `examples/features/CustomNavigation.tsx`, `examples/styling-ref/Slots.tsx` | complete |  |
| `renderLoading` | Prop | `#/api-props`, `#/loading` | `examples/features/LoadingIndicator.tsx`, `snippets/styling/statusSlots.tsx` | complete |  |
| `renderError` | Prop | `#/api-props`, `#/styling-reference` | `snippets/styling/statusSlots.tsx` | complete |  |
| `renderLoadMore` | Prop | `#/api-props`, `#/load-more` | `examples/features/LoadMoreRender.tsx`, `snippets/styling/statusSlots.tsx` | complete |  |
| `orientation` | Prop | `#/api-props`, `#/orientation` | `examples/features/DaySize.tsx`, `examples/features/LoadMore.tsx` | complete |  |
| `numberOfMonths` | Prop | `#/api-props`, `#/orientation` | `examples/events/ControllerButtons.tsx`, `examples/features/CustomNavigation.tsx` | complete |  |
| `monthPosition` | Prop | `#/api-props`, `#/month-position` | `examples/features/DisableFutureWindow.tsx`, `examples/features/MonthPosition.tsx` | complete |  |
| `overflow` | Prop | `#/api-props`, `#/responsive` | `examples/features/OverflowReduce.tsx`, `examples/features/OverflowScroll.tsx` | complete |  |
| `minDaySize` | Prop | `#/api-props`, `#/day-size` | `examples/features/DaySize.tsx`, `examples/recipes/ThreeCalendars.tsx` | complete |  |
| `maxDaySize` | Prop | `#/api-props`, `#/day-size` | `snippets/props/more.tsx` | complete |  |
| `monthGap` | Prop | `#/api-props`, `#/orientation` | `snippets/props/more.tsx` | complete |  |
| `fixedWeeks` | Prop | `#/api-props`, `#/orientation` | `snippets/props/more.tsx` | complete |  |
| `maxBlockSize` | Prop | `#/api-props`, `#/day-size` | `examples/features/DaySize.tsx`, `examples/features/LoadMore.tsx` | complete |  |
| `navigation` | Prop | `#/api-props`, `#/load-more` | `examples/features/LoadMore.tsx`, `examples/features/LoadMoreDefault.tsx` | complete |  |
| `stepMonths` | Prop | `#/api-props`, `#/orientation` | `examples/features/MultipleMonths.tsx` | complete |  |
| `loadMore` | Prop | `#/api-props`, `#/load-more` | `examples/features/LoadMoreManual.tsx`, `snippets/styling/statusSlots.tsx` | complete |  |
| `loadMoreLabels` | Prop | `#/api-props`, `#/load-more` | `examples/features/LoadMore.tsx` | complete |  |
| `loadDirections` | Prop | `#/api-props`, `#/load-more` | `examples/features/LoadMore.tsx`, `examples/features/LoadMoreDefault.tsx` | complete |  |
| `monthsPerLoad` | Prop | `#/api-props`, `#/load-more` | `examples/features/LoadMore.tsx` | complete |  |
| `maxRenderedMonths` | Prop | `#/api-props`, `#/load-more` | `snippets/props/more.tsx` | complete |  |
| `resizeThreshold` | Prop | `#/api-props`, `#/api-events` | `snippets/events/data-layout.tsx` | complete |  |
| `visibleMonth` | Prop | `#/api-props`, `#/api-events` | `examples/events/ControlledMonth.tsx`, `snippets/events/navigation.tsx` | complete |  |
| `defaultVisibleMonth` | Prop | `#/api-props`, `#/core-concepts` | `examples/concepts/Uncontrolled.tsx`, `examples/features/LoadMore.tsx` | complete |  |
| `mode` | Prop | `#/api-props`, `#/selection-modes` | `examples/concepts/Controlled.tsx`, `examples/concepts/RangeSemantics.tsx` | complete | Selection prop (all modes). |
| `value` | Prop | `#/api-props`, `#/core-concepts` | `examples/concepts/Controlled.tsx`, `examples/concepts/RangeSemantics.tsx` | complete | Selection prop (single / range / multiple). |
| `defaultValue` | Prop | `#/api-props`, `#/core-concepts` | `examples/concepts/Uncontrolled.tsx`, `examples/events/ControllerButtons.tsx` | complete | Selection prop (single / range / multiple). |
| `onChange` | Prop | `#/api-props`, `#/api-events` | `examples/concepts/Controlled.tsx`, `examples/concepts/RangeSemantics.tsx` | complete | Selection prop (single / range / multiple). |
| `activeEndpoint` | Prop | `#/api-props`, `#/synced` | `examples/features/Synced.tsx`, `examples/recipes/ThreeCalendars.tsx` | complete | Selection prop (range). |
| `defaultActiveEndpoint` | Prop | `#/api-props`, `#/selection-modes` | `snippets/props/more.tsx` | complete | Selection prop (range). |

### Prop (event callback) (19)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `onReady` | Prop (event callback) | `#/api-events` | `examples/features/Popover.tsx`, `snippets/events/data-layout.tsx` | complete |  |
| `onDateClick` | Prop (event callback) | `#/api-events` | `snippets/events/selection.tsx` | complete |  |
| `onSelectionComplete` | Prop (event callback) | `#/api-events` | `snippets/events/misc.tsx`, `snippets/events/selection.tsx` | complete |  |
| `onSelectionClear` | Prop (event callback) | `#/api-events` | `snippets/events/selection.tsx` | complete |  |
| `onInvalidSelection` | Prop (event callback) | `#/api-events` | `examples/helpers/CustomMessages.tsx`, `snippets/events/controller.tsx` | complete |  |
| `onValidationChange` | Prop (event callback) | `#/api-events` | `snippets/events/selection.tsx` | complete |  |
| `onActiveEndpointChange` | Prop (event callback) | `#/api-events` | `examples/features/Synced.tsx`, `examples/recipes/ThreeCalendars.tsx` | complete |  |
| `onVisibleMonthChange` | Prop (event callback) | `#/api-events` | `examples/events/ControlledMonth.tsx`, `snippets/events/navigation.tsx` | complete |  |
| `onVisibleMonthsChange` | Prop (event callback) | `#/api-events` | `snippets/events/navigation.tsx` | complete |  |
| `onRenderedMonthsChange` | Prop (event callback) | `#/api-events` | `examples/features/LoadingIndicator.tsx`, `examples/features/MonthData.tsx` | complete |  |
| `onLoadMore` | Prop (event callback) | `#/api-events` | `snippets/events/data-layout.tsx` | complete |  |
| `onLoadingChange` | Prop (event callback) | `#/api-events` | `snippets/events/data-layout.tsx` | complete |  |
| `onResize` | Prop (event callback) | `#/api-events` | `snippets/events/data-layout.tsx` | complete |  |
| `onLayoutChange` | Prop (event callback) | `#/api-events` | `examples/features/OverflowReduce.tsx`, `snippets/events/data-layout.tsx` | complete |  |
| `onDayFocusChange` | Prop (event callback) | `#/api-events` | `snippets/events/misc.tsx` | complete |  |
| `onTooltipOpenChange` | Prop (event callback) | `#/api-events` | `snippets/events/misc.tsx` | complete |  |
| `onOutsideClick` | Prop (event callback) | `#/api-events` | `examples/features/Popover.tsx`, `snippets/events/misc.tsx` | complete |  |
| `onScroll` | Prop (event callback) | `#/api-events` | `snippets/events/misc.tsx` | complete |  |
| `onEvent` | Prop (event callback) | `#/api-events` | `snippets/events/misc.tsx` | complete |  |

### Controller member (11)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `instanceId` | Controller member | `#/api-controller` | `snippets/events/misc.tsx` | complete |  |
| `goToMonth` | Controller member | `#/api-controller` | `examples/features/GoToMonth.tsx`, `examples/styling-ref/Slots.tsx` | complete |  |
| `next` | Controller member | `#/api-controller` | `snippets/props/more.tsx` | complete |  |
| `previous` | Controller member | `#/api-controller` | `snippets/props/more.tsx` | complete |  |
| `loadMore` | Controller member | `#/api-controller` | `examples/features/LoadMoreManual.tsx` | complete |  |
| `clear` | Controller member | `#/api-controller` | `examples/features/Slots.tsx`, `examples/recipes/HomeRental.tsx` | complete |  |
| `reset` | Controller member | `#/api-controller` | `snippets/events/controller.tsx` | complete |  |
| `select` | Controller member | `#/api-controller` | `snippets/events/controller.tsx` | complete |  |
| `setActiveEndpoint` | Controller member | `#/api-controller` | `snippets/props/more.tsx` | complete |  |
| `focusDate` | Controller member | `#/api-controller` | `examples/features/Popover.tsx` | complete |  |
| `getSnapshot` | Controller member | `#/api-controller` | `examples/events/ControllerButtons.tsx`, `snippets/events/controller.tsx` | complete |  |

### CalendarSnapshot field (10)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `selection` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx`, `snippets/events/controller.tsx` | complete |  |
| `activeEndpoint` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx` | complete |  |
| `phase` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx`, `examples/features/Slots.tsx` | complete |  |
| `validation` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx`, `examples/recipes/HomeRental.tsx` | complete |  |
| `referenceMonth` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx` | complete |  |
| `visibleMonths` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx`, `examples/features/Slots.tsx` | complete |  |
| `renderedMonths` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx`, `examples/features/LoadMoreManual.tsx` | complete |  |
| `layout` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx` | complete |  |
| `focusedDate` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx` | complete |  |
| `today` | CalendarSnapshot field | `#/api-controller`, `#/styling-reference` | `examples/events/ControllerButtons.tsx` | complete |  |

### SlotContext field (5)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `instanceId` | SlotContext field | `#/styling-reference`, `#/api-types` | — | complete |  |
| `actions` | SlotContext field | `#/styling-reference`, `#/api-types` | `examples/features/LoadMoreManual.tsx`, `examples/features/Slots.tsx` | complete |  |
| `messages` | SlotContext field | `#/styling-reference`, `#/api-types` | — | complete |  |
| `locale` | SlotContext field | `#/styling-reference`, `#/api-types` | — | complete |  |
| `formatDate` | SlotContext field | `#/styling-reference`, `#/api-types` | `examples/features/Slots.tsx`, `examples/styling-ref/Slots.tsx` | complete |  |

### SelectionRules field (19)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `minDate` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-fields.ts` | complete |  |
| `maxDate` | SelectionRules field | `#/api-rules` | `examples/rules/CombinedRules.tsx`, `snippets/rules/combine-fields.ts` | complete |  |
| `disablePast` | SelectionRules field | `#/api-rules` | `examples/features/CustomValidation.tsx`, `examples/features/FixedLength.tsx` | complete |  |
| `disableFuture` | SelectionRules field | `#/api-rules` | — | complete |  |
| `rangeSemantics` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-fields.ts` | complete |  |
| `allowSameDay` | SelectionRules field | `#/api-rules` | `examples/concepts/SameDay.tsx` | complete |  |
| `minLength` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-fields.ts` | complete |  |
| `maxLength` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-fields.ts` | complete |  |
| `fixedLength` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-fields.ts` | complete |  |
| `startWeekdays` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-fields.ts`, `snippets/rules/relax.ts` | complete |  |
| `endWeekdays` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-fields.ts`, `snippets/rules/relax.ts` | complete |  |
| `availableWeekdays` | SelectionRules field | `#/api-rules` | `examples/recipes/EventTickets.tsx`, `snippets/rules/combine-fields.ts` | complete |  |
| `singleDayFirst` | SelectionRules field | `#/api-rules` | `examples/recipes/EventTickets.tsx` | complete |  |
| `getDayAvailability` | SelectionRules field | `#/api-rules` | `examples/features/GoToMonth.tsx`, `examples/recipes/HomeRental.tsx` | complete |  |
| `getDataStatus` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-functions.ts` | complete |  |
| `unknownDataPolicy` | SelectionRules field | `#/api-rules` | `snippets/rules/combine-functions.ts` | complete |  |
| `validateSelection` | SelectionRules field | `#/api-rules` | `examples/features/CustomValidation.tsx`, `snippets/rules/combine-functions.ts` | complete |  |
| `maxSelections` | SelectionRules field | `#/api-rules` | `examples/features/ModeMultiple.tsx` | complete |  |
| `requireReachableEnd` | SelectionRules field | `#/api-rules` | `snippets/props/more.tsx` | complete |  |

### DayAvailability field (7)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `closed` | DayAvailability field | `#/api-rules`, `#/day-rules` | `examples/features/GoToMonth.tsx`, `snippets/rules/relax.ts` | complete |  |
| `canStart` | DayAvailability field | `#/api-rules`, `#/day-rules` | `snippets/rules/combine-functions.ts`, `snippets/rules/stay-weekdays.ts` | complete |  |
| `canEnd` | DayAvailability field | `#/api-rules`, `#/day-rules` | `examples/recipes/HomeRental.tsx`, `snippets/rules/combine-functions.ts` | complete |  |
| `canPassThrough` | DayAvailability field | `#/api-rules`, `#/day-rules` | `snippets/rules/stay-weekdays.ts` | complete |  |
| `reason` | DayAvailability field | `#/api-rules`, `#/day-rules` | `examples/features/GoToMonth.tsx`, `snippets/rules/combine-functions.ts` | complete |  |
| `message` | DayAvailability field | `#/api-rules`, `#/day-rules` | `examples/features/GoToMonth.tsx`, `examples/recipes/HomeRental.tsx` | complete |  |
| `schedule` | DayAvailability field | `#/api-rules`, `#/day-rules` | `snippets/rules/combine-functions.ts`, `snippets/rules/relax.ts` | complete |  |

### Adapter option (shared base) (7)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `minDate` | Adapter option (shared base) | `#/api-rules` | — | complete |  |
| `maxDate` | Adapter option (shared base) | `#/api-rules` | `examples/rules/CombinedRules.tsx` | complete |  |
| `disablePast` | Adapter option (shared base) | `#/api-rules` | `examples/features/FixedLength.tsx`, `examples/features/Keyboard.tsx` | complete |  |
| `disableFuture` | Adapter option (shared base) | `#/api-rules` | — | complete |  |
| `getDataStatus` | Adapter option (shared base) | `#/api-rules` | — | complete |  |
| `unknownDataPolicy` | Adapter option (shared base) | `#/api-rules` | — | complete |  |
| `validateSelection` | Adapter option (shared base) | `#/api-rules` | — | complete |  |

### StayRulesOptions (8)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `minNights` | StayRulesOptions | `#/api-rules` | `examples/features/Keyboard.tsx`, `examples/features/MinMaxLength.tsx` | complete |  |
| `maxNights` | StayRulesOptions | `#/api-rules` | `examples/features/MinMaxLength.tsx`, `examples/recipes/BoatRental.tsx` | complete |  |
| `fixedNights` | StayRulesOptions | `#/api-rules` | `snippets/props/more.tsx` | complete |  |
| `allowSameDay` | StayRulesOptions | `#/api-rules` | `examples/concepts/SameDay.tsx` | complete |  |
| `checkInWeekdays` | StayRulesOptions | `#/api-rules` | `examples/features/StartEndDays.tsx`, `examples/recipes/BoatRental.tsx` | complete |  |
| `checkOutWeekdays` | StayRulesOptions | `#/api-rules` | `examples/features/StartEndDays.tsx`, `examples/recipes/BoatRental.tsx` | complete |  |
| `availableWeekdays` | StayRulesOptions | `#/api-rules` | `snippets/rules/stay-weekdays.ts` | complete |  |
| `getDayStatus` | StayRulesOptions | `#/api-rules` | `examples/features/MonthData.tsx`, `examples/features/StartEndDays.tsx` | complete |  |

### DayRangeRulesOptions (8)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `minDays` | DayRangeRulesOptions | `#/api-rules` | `snippets/rules/relax.ts` | complete |  |
| `maxDays` | DayRangeRulesOptions | `#/api-rules` | `examples/recipes/EventTickets.tsx`, `examples/rules/DayRangeStatuses.tsx` | complete |  |
| `fixedDays` | DayRangeRulesOptions | `#/api-rules` | `examples/features/FixedLength.tsx` | complete |  |
| `startWeekdays` | DayRangeRulesOptions | `#/api-rules` | `snippets/rules/relax.ts` | complete |  |
| `endWeekdays` | DayRangeRulesOptions | `#/api-rules` | `snippets/rules/relax.ts` | complete |  |
| `availableWeekdays` | DayRangeRulesOptions | `#/api-rules` | `examples/recipes/EventTickets.tsx` | complete |  |
| `singleDayFirst` | DayRangeRulesOptions | `#/api-rules` | `examples/recipes/EventTickets.tsx` | complete |  |
| `getDayStatus` | DayRangeRulesOptions | `#/api-rules` | `examples/recipes/EventTickets.tsx`, `examples/rules/DayRangeStatuses.tsx` | complete |  |

### classNames key (24)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `root` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/Unstyled.tsx` | complete |  |
| `header` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling-ref/Slots.tsx` | complete |  |
| `footer` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling-ref/Slots.tsx` | complete |  |
| `viewport` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `months` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `month` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `monthHeader` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/Unstyled.tsx` | complete |  |
| `monthTitle` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/ClassNames.tsx` | complete |  |
| `navigation` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling-ref/Slots.tsx` | complete |  |
| `navButton` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/Unstyled.tsx` | complete |  |
| `weekdays` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/Unstyled.tsx`, `snippets/styling/unstyled.tsx` | complete |  |
| `weekday` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/ClassNames.tsx`, `examples/styling/Unstyled.tsx` | complete |  |
| `grid` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `week` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/Unstyled.tsx`, `snippets/styling/unstyled.tsx` | complete |  |
| `dayCell` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling-ref/StateAttributes.tsx`, `snippets/styling/setup.tsx` | complete |  |
| `dayButton` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/ClassNames.tsx`, `examples/styling/DataAttributes.tsx` | complete |  |
| `dayContent` | classNames key | `#/styling-reference`, `#/styling` | `examples/styling/DataAttributes.tsx`, `snippets/styling/setup.tsx` | complete |  |
| `rangeBackground` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `tooltip` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `loadMore` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `loading` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `error` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `liveRegion` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |
| `readOnlyNotice` | classNames key | `#/styling-reference`, `#/styling` | — | complete |  |

### CSS variable (18)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `--cal-font` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-color` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-muted` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-bg` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-accent` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-accent-contrast` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-range` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-preview` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-hover` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-focus` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-today` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-ring` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-danger` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling-ref/AllVariables.css`, `examples/styling-ref/AllVariables.tsx` | complete |  |
| `--cal-radius` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-circle` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-tooltip-bg` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-tooltip-color` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling/CssVariables.css`, `examples/styling-ref/AllVariables.css` | complete |  |
| `--cal-tooltip-shadow` | CSS variable | `#/styling-reference`, `#/styling` | `examples/styling-ref/AllVariables.css` | complete |  |

### CSS variable (honoured, not declared on .cal-root) (1)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `--cal-tooltip-max-width` | CSS variable (honoured, not declared on .cal-root) | `#/styling-reference`, `#/styling` | `examples/styling-ref/AllVariables.css` | complete | Read by the tooltip with a 280px fallback; inherits from ancestors because the root does not declare it. |

### CSS variable (internal, set inline) (8)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `--cal-day-min-w` | CSS variable (internal, set inline) | `#/styling-reference` | — | complete | Internal: written inline from props/layout; documented as read-only. |
| `--cal-day-min-h` | CSS variable (internal, set inline) | `#/styling-reference` | — | complete | Internal: written inline from props/layout; documented as read-only. |
| `--cal-day-max` | CSS variable (internal, set inline) | `#/styling-reference` | — | complete | Internal: written inline from props/layout; documented as read-only. |
| `--cal-month-gap` | CSS variable (internal, set inline) | `#/styling-reference` | — | complete | Internal: written inline from props/layout; documented as read-only. |
| `--cal-month-padding` | CSS variable (internal, set inline) | `#/styling-reference` | — | complete | Internal: written inline from props/layout; documented as read-only. |
| `--cal-month-min` | CSS variable (internal, set inline) | `#/styling-reference` | — | complete | Internal: written inline from props/layout; documented as read-only. |
| `--cal-columns` | CSS variable (internal, set inline) | `#/styling-reference` | — | complete | Internal: written inline from props/layout; documented as read-only. |
| `--cal-tooltip-arrow` | CSS variable (internal, set inline) | `#/styling-reference` | — | complete | Internal: written inline from props/layout; documented as read-only. |

### data attribute (day cell + button) (25)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `data-date` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-today` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling-ref/StateAttributes.css`, `examples/styling-ref/StateAttributes.tsx` | complete |  |
| `data-past` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-disabled` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling/DataAttributes.tsx` | complete |  |
| `data-unavailable` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling-ref/StateAttributes.css`, `examples/styling-ref/StateAttributes.tsx` | complete |  |
| `data-out-of-schedule` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-selected` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling/DataAttributes.tsx`, `snippets/styling/unstyled.css` | complete |  |
| `data-range-start` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling/DataAttributes.css`, `examples/styling-ref/StateAttributes.css` | complete |  |
| `data-range-end` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling/DataAttributes.css`, `examples/styling-ref/StateAttributes.css` | complete |  |
| `data-in-range` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling/DataAttributes.tsx` | complete |  |
| `data-included` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-preview` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-preview-start` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-preview-end` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling-ref/StateAttributes.css` | complete |  |
| `data-focused` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-hovered` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-loading` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-status` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-reason` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-day-reason` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-week-start` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-week-end` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-month-start` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-month-end` | data attribute (day cell + button) | `#/styling-reference` | — | complete |  |
| `data-mod-<name>` | data attribute (day cell + button) | `#/styling-reference` | `examples/styling/DataAttributes.css`, `examples/styling/DataAttributes.tsx` | complete | One per true modifier. |

### data attribute (day cell only) (2)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `data-band` | data attribute (day cell only) | `#/styling-reference` | `examples/styling-ref/StateAttributes.css`, `examples/styling-ref/StateAttributes.tsx` | complete |  |
| `data-band-preview` | data attribute (day cell only) | `#/styling-reference` | `examples/styling-ref/StateAttributes.css`, `examples/styling-ref/StateAttributes.tsx` | complete |  |

### data attribute (root) (8)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `data-mode` | data attribute (root) | `#/styling-reference` | — | complete |  |
| `data-phase` | data attribute (root) | `#/styling-reference` | — | complete |  |
| `data-orientation` | data attribute (root) | `#/styling-reference` | — | complete |  |
| `data-navigation` | data attribute (root) | `#/styling-reference` | — | complete |  |
| `data-overflow` | data attribute (root) | `#/styling-reference` | — | complete |  |
| `data-at-min-size` | data attribute (root) | `#/styling-reference` | — | complete |  |
| `data-measured` | data attribute (root) | `#/styling-reference` | — | complete |  |
| `data-highlight-today` | data attribute (root) | `#/styling-reference` | — | complete |  |

### data attribute (month) (3)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `data-month` | data attribute (month) | `#/styling-reference` | — | complete |  |
| `data-status` | data attribute (month) | `#/styling-reference` | — | complete |  |
| `data-skeleton` | data attribute (month) | `#/styling-reference` | — | complete |  |

### data attribute (nav button, load-more button and area) (1)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `data-direction` | data attribute (nav button, load-more button and area) | `#/styling-reference` | `snippets/styling/statusSlots.tsx` | complete |  |

### data attribute (default loading element) (1)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `data-scope` | data attribute (default loading element) | `#/styling-reference` | `snippets/styling/statusSlots.tsx` | complete |  |

### data attribute (tooltip) (1)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `data-placement` | data attribute (tooltip) | `#/styling-reference` | — | complete |  |

### CalendarMessages key (25)

| Item | Category | Docs page | Example | Status | Note |
| --- | --- | --- | --- | --- | --- |
| `calendar` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `previousMonth` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `nextMonth` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `loadNext` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `loadPrevious` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `loading` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `error` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `retry` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `today` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `todayLabel` | CalendarMessages key | `#/api-messages` | `examples/helpers/CustomMessages.tsx` | complete |  |
| `readOnlyNotice` | CalendarMessages key | `#/api-messages` | `examples/features/ModeReadonly.tsx`, `snippets/helpers/messages.ts` | complete |  |
| `selected` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `rangeStart` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `rangeEnd` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `inRange` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `unavailable` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `announceStart` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `announceRange` | CalendarMessages key | `#/api-messages` | `examples/helpers/CustomMessages.tsx`, `snippets/helpers/messages.ts` | complete |  |
| `announceSingle` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `announceAdded` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `announceRemoved` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `announceCleared` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `announceRejected` | CalendarMessages key | `#/api-messages` | — | complete |  |
| `reasons` | CalendarMessages key | `#/api-messages` | `examples/helpers/CustomMessages.tsx`, `snippets/helpers/messages.ts` | complete |  |
| `dayReasons` | CalendarMessages key | `#/api-messages` | `examples/helpers/CustomMessages.tsx`, `examples/rules/CombinedRules.tsx` | complete |  |

## Previous demo → new docs

The pre-docs demo (`git show 312aa1e:apps/demo/src/App.tsx`, examples in `apps/demo/src/examples/{Features,Stay,Others,Loading,Sync,Locales,Playground}.tsx`)
was one Turkish-language page of sections. Each section maps to the new examples below (paths under `apps/demo/src/`).
The **event log** panel and the **React commit-timing graph** of the playground were intentionally not carried over: the
events are documented per callback on `#/api-events` (with snippets), and measured timings are on `#/performance`.

| Previous section | What it showed | New example(s) | Docs page | Status |
| --- | --- | --- | --- | --- |
| `f-endpoints` | Range endpoint look (outer half-ring, band, single-day circle) and a `singleDayFirst` toggle | `examples/features/ModeRange.tsx`, `examples/concepts/RangeSemantics.tsx`, `examples/styling-ref/StateAttributes.tsx` (band/ring states), `examples/recipes/EventTickets.tsx` (`singleDayFirst`) | `#/selection-modes`, `#/styling-reference`, `#/api-rules`, `#/recipe-event-tickets` | complete — `singleDayFirst` is shown on, without the on/off toggle of the old demo |
| `f-custom` | “Custom dates” (`relaxSchedule`) lifting schedule rules while bookings stay | `examples/recipes/BoatRental.tsx`, `examples/recipes/HomeRental.tsx`, `examples/rules/CombinedRules.tsx`, `snippets/rules/relax.ts` | `#/api-rules`, `#/length-rules`, `#/recipe-boat-rental` | complete |
| `f-tooltip` | `tooltip={{ boundary, placement }}` in a narrow box | `examples/features/TooltipViewport.tsx`, `examples/features/Tooltip.tsx` | `#/tooltip` | complete |
| `f-loadmore` — default | Default load-more buttons | `examples/features/LoadMoreDefault.tsx` | `#/load-more` | complete |
| `f-loadmore` — `loadMoreLabels` | Custom content of the default buttons | `examples/features/LoadMore.tsx` | `#/load-more` | complete |
| `f-loadmore` — `renderLoadMore` | A different control | `examples/features/LoadMoreRender.tsx` | `#/load-more` | complete |
| `f-loadmore` — manual + footer | `loadMore="manual"` with `ctx.actions.loadMore()` in the footer | `examples/features/LoadMoreManual.tsx` | `#/load-more`, `#/api-controller` | complete |
| `f-loading` | Equal-size skeleton, no visible text; optional `renderLoading` | `examples/features/InitialLoad.tsx`, `examples/features/LoadingIndicator.tsx` | `#/loading` | complete |
| `f-today` | Today circle + “Today” tooltip, `highlightToday={false}` | `examples/features/TodayMarker.tsx` | `#/date-limits` | complete (adds `timeZone`) |
| `stay` | Stay reference: `[start, end)` nights, prices, custom dates, clear/book footer, late check-out through `ruleContext`, guidance tooltips | `examples/recipes/HomeRental.tsx`, `examples/features/Tooltip.tsx` (hints while choosing) | `#/recipe-home-rental`, `#/tooltip` | complete — the old check-in-only (“startOnly”) toggle has no direct counterpart |
| `mobile` | Vertical continuous list, load more in both directions with `loadMoreLabels`, container scaling, inner scroll | `examples/features/LoadMore.tsx`, `examples/features/Responsive.tsx`, `examples/features/DaySize.tsx` | `#/load-more`, `#/responsive`, `#/day-size` | complete |
| `boat` | Saturday → Saturday, custom dates relax it, booked days still blocked | `examples/recipes/BoatRental.tsx` | `#/recipe-boat-rental` | complete — now built with `stayRules` (check-in/out Saturday, 7–14 nights) instead of `dayRangeRules` start/end weekdays; `startWeekdays`/`endWeekdays` are shown in `snippets/rules/relax.ts`, `snippets/rules/combine-fields.ts` |
| `boat-weekend` | `availableWeekdays` (weekends only) + `singleDayFirst`, ranges cannot cross weekdays | `examples/recipes/EventTickets.tsx` (Thu–Sun + `singleDayFirst` + `maxDays`), `snippets/rules/stay-weekdays.ts` | `#/recipe-event-tickets`, `#/api-rules` | complete — same capability with Thursday–Sunday instead of a weekend-only boat |
| `event` | Single date with icon, badge, markers, sold-out days with custom day-reason texts | `examples/features/DayContent.tsx`, `examples/recipes/EventTickets.tsx` (sold-out = closed), `examples/rules/CombinedRules.tsx` + `examples/helpers/CustomMessages.tsx` (custom `dayReasons`) | `#/day-content`, `#/api-messages` | complete — spread over several examples instead of one |
| `multiple` | Multiple dates, at most 5, only Tuesday/Thursday, custom reason texts | `examples/features/ModeMultiple.tsx`, `examples/features/SessionDays.tsx` | `#/selection-modes`, `#/api-rules` | complete |
| `readonly` | `mode="readonly"` with booked days, a modifier, markers and a legend | `examples/features/ModeReadonly.tsx`, `examples/styling/DataAttributes.tsx` (modifiers) | `#/selection-modes`, `#/styling-reference` | complete — the legend/markers part is not repeated in the read-only example |
| `loading` | Async availability, error + retry, go to first available month, stale-response guard | `examples/features/MonthData.tsx`, `examples/features/GoToMonth.tsx` | `#/loading`, `#/go-to-month` | complete |
| `sync` — inline | Shared `value` + `activeEndpoint` + rules | `examples/features/Synced.tsx`, `examples/recipes/ThreeCalendars.tsx` | `#/synced`, `#/recipe-three-calendars` | complete |
| `sync` — modal | The same synced selection inside a `<dialog>` | `examples/features/SyncedDialog.tsx`, `examples/features/Modal.tsx` | `#/synced`, `#/placement` | complete |
| `sync` — portal | The same synced selection in a portalled panel | `examples/features/Popover.tsx`, `examples/features/SyncedDialog.tsx` | `#/placement`, `#/synced` | partial — the portalled popover is a standalone single-date calendar; syncing works the same way as in the dialog example (shared props) but is not shown through a portal |
| `locales` | tr / en / de / fr / es / it / nl / ar (RTL) side by side, different themes on one page | `examples/features/LocaleTurkish.tsx`, `examples/features/Rtl.tsx`, `examples/features/WeekStart.tsx`, `examples/features/MoreLocales.tsx`, `examples/helpers/CustomMessages.tsx` | `#/i18n`, `#/api-messages`, `#/styling` | complete — themes: the Styling page shows the default theme next to a variable-based dark theme |
| `playground` — orientation | horizontal / vertical | `examples/features/Vertical.tsx`, `examples/features/MultipleMonths.tsx` | `#/orientation` | complete |
| `playground` — navigation | paged / continuous | `examples/features/MultipleMonths.tsx` (paged, `stepMonths`), `examples/features/LoadMoreDefault.tsx` (continuous) | `#/orientation`, `#/load-more` | complete |
| `playground` — overflow | wrap / scroll / reduce-months | `examples/features/OverflowWrap.tsx`, `examples/features/OverflowScroll.tsx`, `examples/features/OverflowReduce.tsx` | `#/responsive` | complete |
| `playground` — numberOfMonths | 1–6 months | `examples/features/MultipleMonths.tsx` | `#/orientation` | complete |
| `playground` — monthPosition | Reference month position | `examples/features/MonthPosition.tsx`, `examples/features/DisableFutureWindow.tsx` | `#/month-position` | complete |
| `playground` — minDaySize | 24–64 px days | `examples/features/DaySize.tsx`, `examples/recipes/ThreeCalendars.tsx` | `#/day-size` | complete |
| `playground` — disableFuture | Future days blocked | `examples/features/PastFuture.tsx`, `examples/features/DisableFutureWindow.tsx` | `#/date-limits` | complete |
| `playground` — RTL | `he-IL` | `examples/features/Rtl.tsx` (`ar`) | `#/i18n` | complete (Arabic instead of Hebrew) |
| `playground` — resize | Resizable container | `examples/features/Responsive.tsx` | `#/responsive` | complete |
| `playground` — events | Live `onEvent` log | `snippets/events/misc.tsx`, `snippets/events/*.tsx` | `#/api-events` | not carried over (intentional): no live event log; every event is documented with payload tables and snippets |
| `playground` — React commit timings | `Profiler` commit graph | — | `#/performance` | not carried over (intentional): measured numbers are on the performance page |
