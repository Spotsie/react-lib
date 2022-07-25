import { Meta, Story } from '@storybook/react';
import { useMemo, useState } from 'react';
import { Map, MapProps } from '../src/Map/Map';
import { colors } from '../src/Timeline/defaults';
import produce from 'immer';
import { zoneIds as zones } from '../src/Timeline/defaults';
import { Props as PinProps } from '../src/Map/Pin';
import React from 'react';
import { Feature, FeatureCollection, Point } from '../src/Map/types';
import { centroid, newFeatureCollectionFromZones } from '../src/Map/helpers';

// import evacuationPoints from '../src/Map/evacuationPointsData.json';

const meta: Meta = {
  title: 'Map',
  component: Map,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const initialViewState = {
  latitude: 45.28361487544451,
  longitude: 14.53738009371364,
  zoom: 16,
};

const Template: Story<MapProps> = ({ mapTheme, heatmap }) => {
  const [displayType, setDisplayType] = useState(heatmap);

  const [subjectLocations, setSubjectLocations] = useState<[number, number][]>([
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [7, 1],
    [8, 1],
    [9, 1],
    [10, 7],
    [11, 1],
    [12, 1],
  ]);

  const [followedBeacons, setFollowedBeacons] = useState<number[]>([1, 10]);

  const featureCollection: FeatureCollection = useMemo(() => {
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: newFeatureCollectionFromZones(zones),
    };

    return fc;
  }, [zones]);

  const zoneCentroidMap = useMemo(() => {
    const zoneCentroid: { [zoneID: number]: Feature<Point> } = {};

    featureCollection.features.forEach((feature) => {
      zoneCentroid[feature.properties!.zoneID] = centroid(feature, {
        properties: { zoneID: feature.properties?.zoneID },
      });
    });

    return zoneCentroid;
  }, [featureCollection]);

  const zoneFeatureCollection: FeatureCollection = useMemo(() => {
    const zonePopulation: { [zoneId: number]: number } = {};
    zones.forEach((zone) => (zonePopulation[zone.id] = 0));

    subjectLocations.forEach(([_, zoneId]) => {
      if (zonePopulation[zoneId] !== undefined) {
        zonePopulation[zoneId]++;
      }
    });

    const nextFeatureCollection = produce(featureCollection, (draft) => {
      draft.features.forEach((feature) => {
        feature.properties!.population =
          zonePopulation[feature!.properties!.zoneID] || 0;
      });
    });

    return nextFeatureCollection;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureCollection, subjectLocations]);

  const subjectLocationsFc = useMemo(() => {
    const features = subjectLocations
      .map(([subject, location]) => {
        const zoneCentroid = zoneCentroidMap[location];
        if (!zoneCentroid) {
          // TODO: fix this
          console.error(`zone centroid not found (zone: ${location}} `);
          return null;
        }
        const f: Feature<Point> = {
          type: 'Feature',
          geometry: zoneCentroid.geometry,
          id: subject,
          properties: {
            subject,
            location,
          },
        };
        return f;
      })
      .filter((fc) => fc !== null);

    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: features as any,
    };

    return featureCollection;
  }, [zoneCentroidMap, subjectLocations]);

  const pins = useMemo(() => {
    const focusedBeacons: PinProps[] = [];

    subjectLocations.forEach(([sub, loc]) => {
      if (!followedBeacons.includes(sub)) {
        return;
      }
      const zoneCentroid = zoneCentroidMap[loc];
      const elem: PinProps = {
        longitude: zoneCentroid.geometry.coordinates[0],
        latitude: zoneCentroid.geometry.coordinates[1],
        color: colors[focusedBeacons.length],
      };
      focusedBeacons.push(elem);
    });

    return focusedBeacons;
  }, [followedBeacons, zoneCentroidMap, subjectLocations]);

  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <Map
        mapboxAccessToken="pk.eyJ1IjoiYW50ZWciLCJhIjoiY2twN2FlcWEwMTNybDJ3czFqc210aXh3byJ9.64MwAnoP61Go4hUcEza14w"
        mapTheme={mapTheme}
        zoneFeatureCollection={zoneFeatureCollection}
        subjectFeatureCollection={subjectLocationsFc}
        // iconFeatureCollections={[evacuationPoints as FeatureCollection]}
        heatmap={displayType}
        pins={pins}
        initialViewState={initialViewState}
      />
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const DefaultMap = Template.bind({});

DefaultMap.args = {
  mapTheme: 'light',
  heatmap: 'color',
} as MapProps;
