import { Meta, Story } from '@storybook/react';
import {
  colors,
  labels,
  timeFrame,
  timelineData,
  zoneIds,
} from '../src/Timeline/defaults';
import { TimelineContainer, TimelineProps } from '../src/index';

const meta: Meta = {
  title: 'Timeline',
  component: TimelineContainer,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<TimelineProps> = (props) => (
  <TimelineContainer {...props} />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  timelineData,
  timeFrame,
  labels,
  zoneIds,
  colors,
};
