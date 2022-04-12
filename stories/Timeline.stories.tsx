import { Meta, Story } from '@storybook/react';
import {
  colors,
  labels,
  timeFrame,
  getTimelineData,
  zoneIds,
} from '../src/Timeline/defaults';
import { TimelineContainer, TimelineProps } from '../src/index';
import { useEffect, useState } from 'react';

const meta: Meta = {
  title: 'Timeline',
  component: TimelineContainer,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<TimelineProps> = ({
  timeFrame: t,
  timelineData: tData,
  onClickZone,
  selectedZone: z,
  ...props
}) => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const [timeFrame, setTimeFrame] = useState(t);

  const [timelineData, setTimelineData] = useState({});

  useEffect(() => {
    if (!timeFrame) {
      return;
    }
    console.log(timeFrame);

    setTimelineData(
      getTimelineData({
        start: timeFrame.start.getTime() / 1000,
        end: timeFrame.end.getTime() / 1000,
      })
    );
  }, [timeFrame]);

  const handleClickZone = (zoneId: number) => {
    if (zoneId === selectedZone) {
      setSelectedZone(null);
    } else {
      setSelectedZone(zoneId);
    }
  };

  const handleScroll = (timeFrame: { start: Date; end: Date }) => {
    setTimeFrame({
      start: timeFrame.start,
      end: timeFrame.end,
    });
  };

  return (
    <TimelineContainer
      timeFrame={timeFrame}
      timelineData={timelineData}
      onClickZone={handleClickZone}
      selectedZone={selectedZone}
      onScroll={handleScroll}
      {...props}
    />
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  timeFrame,
  labels,
  zoneIds,
  colors,
  trackHeight: 25,
  trackGap: 10,
  trackTopOffset: 9,
} as TimelineProps;
