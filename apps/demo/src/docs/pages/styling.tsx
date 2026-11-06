import { Example } from '../Code';
import { Note, Page, PropsTable, Section } from '../ui';

export function Styling() {
  return (
    <Page
      title="Styling & Customization"
      lead="Start with the default theme and go only as far as you need: variables, then classes and state attributes, then custom content, then your own markup."
    >
      <PropsTable
        caption="Which approach?"
        rows={[
          { name: 'CSS variables', type: 'colours, radius, sizes', description: 'Theming (brand colours, dark mode). Cheapest; no selectors into the markup.' },
          { name: 'classNames', type: 'parts', description: 'Adding your design system classes to specific parts.' },
          { name: 'data-* attributes', type: 'state', description: 'Styling states (selected, in range, disabled, your modifiers) from your own CSS.' },
          { name: 'renderDayContent', type: 'inside the day', description: 'Different content in the default, accessible day button.' },
          { name: 'renderDay + getDayProps', type: 'whole day', description: 'Your own day element, keeping keyboard, focus, ARIA and selection.' },
          { name: 'unstyled', type: 'everything', description: 'No default classes at all; you style every part.' },
        ]}
      />
      <Section title="Default theme">
        <p>
          Import <code>calendar-kit/styles.css</code> once. It does not need <code>!important</code> overrides: state selectors use <code>:where()</code> to stay
          low-specificity, and everything visual reads CSS variables set on the calendar root.
        </p>
      </Section>
      <Section title="CSS variables">
        <p>
          Set variables on the root through <code>className</code> or <code>style</code>. Available: <code>--cal-color</code>, <code>--cal-muted</code>,{' '}
          <code>--cal-bg</code>, <code>--cal-accent</code>, <code>--cal-accent-contrast</code>, <code>--cal-range</code>, <code>--cal-preview</code>,{' '}
          <code>--cal-hover</code>, <code>--cal-focus</code>, <code>--cal-today</code>, <code>--cal-ring</code>, <code>--cal-danger</code>,{' '}
          <code>--cal-radius</code>, <code>--cal-circle</code>, <code>--cal-font</code> and the tooltip variables <code>--cal-tooltip-bg</code>,{' '}
          <code>--cal-tooltip-color</code>, <code>--cal-tooltip-shadow</code>, <code>--cal-tooltip-max-width</code> (copied to the portalled tooltip).
        </p>
        <Example src="styling/CssVariables" title="Dark theme with variables" />
      </Section>
      <Section title="classNames">
        <p>
          Parts: <code>root, header, footer, viewport, months, month, monthHeader, monthTitle, navigation, navButton, weekdays, weekday, grid, week, dayCell,
          dayButton, dayContent, rangeBackground, tooltip, loadMore, loading, error, liveRegion, readOnlyNotice</code>. <code>dayCell</code>,{' '}
          <code>dayButton</code> and <code>dayContent</code> accept a function of the day&apos;s state.
        </p>
        <Example src="styling/ClassNames" title="classNames" />
      </Section>
      <Section title="State attributes and modifiers">
        <p>
          Day cells and buttons carry <code>data-today</code>, <code>data-past</code>, <code>data-disabled</code>, <code>data-unavailable</code>,{' '}
          <code>data-selected</code>, <code>data-range-start</code>, <code>data-range-end</code>, <code>data-in-range</code>, <code>data-preview</code>,{' '}
          <code>data-focused</code>, <code>data-loading</code>, <code>data-reason</code>, <code>data-mod-*</code> and more; cells also have{' '}
          <code>data-band=&quot;start | mid | end&quot;</code>. Pair them with your own classes so your CSS does not depend on internal class names.
        </p>
        <Example src="styling/DataAttributes" title="Modifiers and data attributes" />
      </Section>
      <Section title="renderDayContent">
        <Example src="styling/DayContentRender" title="Custom day content" />
      </Section>
      <Section title="renderDay and getDayProps">
        <p>
          <code>getDayProps</code> merges the ref (tooltip anchor, roving focus), <code>tabIndex</code>, ARIA attributes, <code>data-*</code> state and event
          handlers with yours. With a non-button element, the calendar handles Enter and Space.
        </p>
        <Example src="styling/RenderDay" title="Custom day element" />
      </Section>
      <Section title="unstyled">
        <p>No default class names are added. The months grid and day sizing stay inline, so layout keeps working; everything visual is yours.</p>
        <Example src="styling/Unstyled" title="Unstyled calendar" />
      </Section>
      <Note>
        <p>
          Never put buttons or links inside <code>renderDayContent</code>: the day is already a button. For an action inside a day, render the day yourself (
          <code>renderDay</code>) and move the action out of the button, for example into a tooltip or a slot.
        </p>
      </Note>
    </Page>
  );
}
