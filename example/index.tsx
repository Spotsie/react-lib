import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TimelineContainer } from '../dist';
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
