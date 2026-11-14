import { Example } from '../Code';
import { Page, Section } from '../ui';

export function HomeRental() {
  return (
    <Page
      title="Home rental"
      lead="A holiday home booked by the night: a 2-night minimum, availability loaded month by month, a price on every free day, a choice of check-out time and a “Custom dates” switch. The calendar only selects the dates; the booking itself lives in your app’s state."
    >
      <Section title="How the pieces work together">
        <ul>
          <li>
            <code>stayRules</code> makes the end date the check-out day, so the footer counts nights. <code>minNights: 2</code> rejects 1-night stays, and{' '}
            <code>getDayStatus</code> closes the booked nights. The first day of a booking can still be a check-out day: you leave in the morning, the next
            guest arrives later.
          </li>
          <li>
            Availability comes from a simulated API. <code>onRenderedMonthsChange</code> tells the app which months to load, and{' '}
            <code>getDataStatus</code> keeps the days of a month unselectable while it loads (about one second).
          </li>
          <li>
            The check-out time (11:00 or 18:00) is app state. <code>ruleContext=&#123;booking&#125;</code> hands it to the rules, where a rule reads it as{' '}
            <code>ctx.context</code> (the second argument of a rule receives the rule context: the selection, today and your <code>ruleContext</code>). With
            18:00, the day the next guest arrives can no longer be the check-out day: switch between the two times and watch those days.
          </li>
          <li>
            “Custom dates” sets <code>relaxSchedule</code>: schedule rules such as the 2-night minimum are switched off, so a 1-night stay can be picked;
            booked days stay closed.
          </li>
          <li>
            Prices are day labels from <code>getDayData</code>. The app adds up the nightly prices of the selected nights and shows the total in{' '}
            <code>renderFooter</code>, next to Clear and Book. Book is enabled only for a complete, valid range.
          </li>
        </ul>
        <Example src="recipes/HomeRental" title="Home rental" />
      </Section>
    </Page>
  );
}

export function BoatRental() {
  return (
    <Page title="Boat rental" lead="Weekly charters from Saturday to Saturday, with maintenance days and a switch for special requests.">
      <Section title="Saturday to Saturday">
        <p>
          A charter starts and ends on a Saturday (<code>checkInWeekdays</code> and <code>checkOutWeekdays</code>) and lasts 7 to 14 nights (
          <code>minNights</code>, <code>maxNights</code>), so only one or two weeks can be picked. These are schedule rules: they describe how the business
          usually works. “Custom dates” sets <code>relaxSchedule</code> and switches them off for a special request; then any start and end day can be
          picked. The maintenance days (the 3rd and 4th of each month) stay closed, because the boat is really unavailable then.
        </p>
        <Example src="recipes/BoatRental" title="Boat rental" />
      </Section>
    </Page>
  );
}

export function EventTickets() {
  return (
    <Page title="Event tickets" lead="Day tickets and multi-day passes for a festival that runs from Thursday to Sunday.">
      <Section title="Day ticket or pass">
        <p>
          <code>dayRangeRules</code> counts days inclusively: the last selected day is part of the pass. With <code>singleDayFirst</code> the first click
          already selects one day (a day ticket); a click on a later day extends it into a pass of up to 4 days, and a second click on the same lone day
          clears it. <code>availableWeekdays</code> closes Monday to Wednesday. Sold-out days are closed through <code>getDayStatus</code>, and days with
          fewer than 10 tickets left show the number as a label. The number of tickets and the price are app state, shown in the footer.
        </p>
        <Example src="recipes/EventTickets" title="Event tickets" />
      </Section>
    </Page>
  );
}

export function ThreeCalendars() {
  return (
    <Page title="Three synced calendars" lead="One booking shown three ways: a compact month, a scrolling list and a two-month overview. Each of them can change the same range.">
      <Section title="One state, three calendars">
        <p>
          All three calendars receive the same <code>value</code> and <code>onChange</code>, and the same <code>activeEndpoint</code> (which end the next
          click sets) with <code>onActiveEndpointChange</code>. Pick a start date in one calendar and the end date in another: the range appears in all three.
          What you see stays separate per calendar: each has its own visible months, focused day and tooltip.
        </p>
        <Example src="recipes/ThreeCalendars" title="Three synced calendars" />
      </Section>
    </Page>
  );
}
