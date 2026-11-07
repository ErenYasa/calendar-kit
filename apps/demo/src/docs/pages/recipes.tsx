import { Example } from '../Code';
import { Page, Section } from '../ui';

export function HomeRental() {
  return (
    <Page
      title="Home rental"
      lead="Nightly stays with a minimum, live availability, prices, a check-out time and “custom dates”. The booking lives in app state; the calendar only selects dates."
    >
      <Section title="How it fits together">
        <ul>
          <li>
            <code>stayRules</code> gives exclusive ranges (nights), a 2-night minimum and booked days from the loaded data.
          </li>
          <li>
            The check-out time is app state. It reaches a rule through <code>ruleContext</code>: with an 18:00 check-out, a day on which the next guest arrives
            cannot be a check-out.
          </li>
          <li>
            “Custom dates” turns on <code>relaxSchedule</code>: the minimum stay is ignored, bookings are not.
          </li>
          <li>Prices are day labels; the total is computed by the app and shown in the footer slot with Clear and Book.</li>
        </ul>
        <Example src="recipes/HomeRental" title="Home rental" />
      </Section>
    </Page>
  );
}

export function BoatRental() {
  return (
    <Page title="Boat rental" lead="Weekly charters from Saturday to Saturday, with maintenance days and an override for special requests.">
      <Section title="Saturday to Saturday">
        <p>
          Check-in and check-out weekdays plus a 7–14 night length are schedule rules. “Custom dates” relaxes them; the closed maintenance days still apply because
          they are real unavailability.
        </p>
        <Example src="recipes/BoatRental" title="Boat rental" />
      </Section>
    </Page>
  );
}

export function EventTickets() {
  return (
    <Page title="Event tickets" lead="Day tickets and multi-day passes for an event that runs on some weekdays only.">
      <Section title="Day ticket or pass">
        <p>
          <code>dayRangeRules</code> counts days inclusively. With <code>singleDayFirst</code> the first click already selects one day and a later click extends
          it into a pass. <code>availableWeekdays</code> closes the other weekdays; sold-out days are closed through <code>getDayStatus</code>. The number of
          tickets and the price are app state.
        </p>
        <Example src="recipes/EventTickets" title="Event tickets" />
      </Section>
    </Page>
  );
}

export function ThreeCalendars() {
  return (
    <Page title="Three synced calendars" lead="Three presentations of one booking: compact, list and overview, all editing the same range.">
      <Section title="One state, three calendars">
        <p>
          Each calendar receives the same <code>value</code>, <code>onChange</code>, <code>activeEndpoint</code> and <code>onActiveEndpointChange</code>. A start
          picked in one can be finished in another. Visible months, focus and tooltips stay per calendar.
        </p>
        <Example src="recipes/ThreeCalendars" title="Three synced calendars" />
      </Section>
    </Page>
  );
}
