import React, { CSSProperties, ReactNode, SVGProps, useState } from "react";
import { Marker, Popup } from "react-map-gl";

type IconProps = { size: number } & SVGProps<SVGSVGElement>;

const Icon = ({ style, size, color = "#cb5050" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.05025 4.05025C7.78392 1.31658 12.2161 1.31658 14.9497 4.05025C17.6834 6.78392 17.6834 11.2161 14.9497 13.9497L10 18.8995L5.05025 13.9497C2.31658 11.2161 2.31658 6.78392 5.05025 4.05025ZM10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z"
      fill={color}
    />
  </svg>
);

const pinStyle: Partial<CSSProperties> = {
  cursor: "pointer",
  stroke: "black",
  strokeWidth: "1px",
  marginTop: "-35px",
};

export type Props = {
  longitude: number;
  latitude: number;
  properties?: { [key: string]: any } | null;
  color?: string;
  popup?: boolean;
  onFeatureClick?(properties: { [key: string]: any }): ReactNode;
};

const Pin = ({
  longitude,
  latitude,
  color,
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
        <Icon style={pinStyle} size={32} color={color} />
      </Marker>
    </>
  );
};

export default Pin;
