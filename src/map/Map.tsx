import React, { ReactNode} from "react";
import ReactMapGL, {Layer, MapEvent, ScaleControl, Source, LayerProps} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import geojson from "geojson";
import { Feature } from "geojson";

// Fix for webpack loading
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it
// @ts-ignore
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

type ZoneLayerProps = {
    data: geojson.FeatureCollection;
    style: LayerProps,
};
export function ZoneLayer(props: ZoneLayerProps) {
    return (
        <Source cluster={false} id={"zone"} type={"geojson"} data={props.data}>
            {/*<Marker longitude={14.5370998} latitude={45.2841079}>*/}
            {/*  Something*/}
            {/*</Marker>*/}
            <Layer {...props.style} />
        </Source>
    );
}



export const mapStyles = {
    light: "mapbox://styles/mapbox/light-v10",
    satellite: "mapbox://styles/mapbox/satellite-v9",
};

export type MapStyle = keyof typeof mapStyles;
type Props = {
    children?: ReactNode;
    style?: keyof typeof mapStyles;
    onFeatureClick?: (e: Feature[]) => void;
    featureCollection: geojson.FeatureCollection;
    zoneLayerStyle: LayerProps;
    mapboxAccessToken: string,
};

const scaleControlStyle = {
    left: 5,
    bottom: 30,
};

export const mapSettings = {
    maxZoom: 20,
    minZoom: 8,
};

export function Map({ children, style = "light", ...props }: Props) {
    const [viewport, setViewport] = React.useState({
        latitude: 45.28361487544451,
        longitude: 14.53738009371364,
        zoom: 16,
    });

    const handleOnClick = (e: MapEvent) => {
        console.log("mapEvent", e);
        if (e.features !== undefined && e.features.length > 0) {
            props.onFeatureClick && props.onFeatureClick(e.features);
        }
    };

    return (
        <>
            <ReactMapGL
                {...viewport}
                mapStyle={mapStyles[style]}
                mapboxApiAccessToken={props.mapboxAccessToken}
                width="100%"
                getCursor={() => "crosshair"}
                height="100%"
                maxZoom={mapSettings.maxZoom}
                minZoom={mapSettings.minZoom}
                interactiveLayerIds={["zone"]}
                onClick={handleOnClick}
                onViewportChange={(
                    viewport: React.SetStateAction<{
                        latitude: number;
                        longitude: number;
                        zoom: number;
                    }>
                ) => setViewport(viewport)}
            >

                <ZoneLayer data={props.featureCollection} style={props.zoneLayerStyle}/>
                {children}
                <ScaleControl maxWidth={100} unit="metric" style={scaleControlStyle} />
            </ReactMapGL>
        </>
    );
}
