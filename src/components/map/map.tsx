import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";
import { MapInteraction } from "./map-interaction";

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3d5cndjaCIsImEiOiJja254NWpwbG8wNjVxMnByeHFnenJuZHN0In0.TcPjWaplIJGJccgDCgRwoA";

interface Props {
    tour: Array<Number>;
}

export const Map = (props: Props) => {
    const { tour } = props;

    const [map, setMap] = useState<mapboxgl.Map>();

    useEffect(() => {
        if (!map) {
            const newMap = new mapboxgl.Map({
                container: "map", // container ID
                style: "mapbox://styles/mapbox/streets-v11", // style URL
                center: [27.586, 53.917], // starting position [lng, lat]
                zoom: 14, // starting zoom
            });
            setMap(newMap);
        }
    }, [map]);

    return (
        <div className="map-container">
            <div id="map" style={{ height: 500, width: "70vw" }}></div>
            <MapInteraction map={map} tour={tour}></MapInteraction>
        </div>
    );
};
