import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../.';
import TimelineContainer from '../src/Timeline/TimelineContainer';
import {
  colors,
  labels,
  timeFrame,
  timelineData,
  zoneIds,
} from '../src/Timeline/defaults';

const App = () => {
  return (
    <div>
      <Thing />
      <TimelineContainer
        timeFrame={timeFrame}
        timelineData={timelineData}
        labels={labels}
        colors={colors}
        zoneIds={zoneIds}
        selectedZone={null}
        onClickZone={() => {}}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
