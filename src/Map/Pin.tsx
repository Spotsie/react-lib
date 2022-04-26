import * as React from 'react';
import { Marker } from 'react-map-gl/dist/es5';
import { LocationMarkerIcon } from './LocationMarker';

const pinStyle = {
  cursor: 'pointer',
  stroke: 'black',
  marginLeft: '-17px',
  marginTop: '-35px',
};

export interface PinProps {
  longitude: number;
  latitude: number;
}

type Props = { onClick?: () => void } & PinProps;

function Pin({ longitude, latitude }: Props) {
  return (
    <Marker longitude={longitude} latitude={latitude}>
      <LocationMarkerIcon style={pinStyle} size={32} />
    </Marker>
  );
}

export default React.memo(Pin);
