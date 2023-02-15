import React, { ReactNode, useState } from "react";
import { Marker, Popup } from "react-map-gl";

export type Props = {
  longitude: number;
  latitude: number;
  properties?: { [key: string]: any } | null;
  popup?: boolean;
  onFeatureClick?(properties: { [key: string]: any }): ReactNode;
};

const Pin = ({
  longitude,
  latitude,
  popup,
  properties,
  onFeatureClick,
}: Props) => {
  const [popupShow, setPopupShow] = useState<ReactNode>(null);

  return (
    <>
      {popup && popupShow && (
        <Popup
          anchor="bottom"
          longitude={longitude}
          latitude={latitude}
          onClose={() => setPopupShow(null)}
          offset={23}
        >
          {popupShow}
        </Popup>
      )}

      <Marker
        longitude={longitude}
        latitude={latitude}
        onClick={(e) => {
          // Doesn't work without this
          if (!properties || !onFeatureClick) {
            return;
          }
          e.originalEvent.stopPropagation();

          const element = onFeatureClick(properties);

          setPopupShow(element);
        }}
      >
        <span />
      </Marker>
    </>
  );
};

export default Pin;
