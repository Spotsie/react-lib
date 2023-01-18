import React from "react";
import { TimelineContainer } from "./lib";

function App() {
  return (
    <div>
      <TimelineContainer
        timeFrame={{
          start: new Date(),
          end: new Date(),
        }}
        timelineData={{ 1: [] }}
        labels={{}}
        colors={["#ff0000"]}
        zoneIds={[{ id: 1 }]}
        selectedZone={null}
      />
    </div>
  );
}

export default App;
