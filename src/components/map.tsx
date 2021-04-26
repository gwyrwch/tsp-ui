import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";
import { MapInteraction } from "./map-interaction";

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3d5cndjaCIsImEiOiJja254NWpwbG8wNjVxMnByeHFnenJuZHN0In0.TcPjWaplIJGJccgDCgRwoA";

export const Map = () => {
    const [map, setMap] = useState<mapboxgl.Map>();
    useEffect(() => {
        console.log("map created");
        const newMap = new mapboxgl.Map({
            container: "map", // container ID
            style: "mapbox://styles/mapbox/streets-v11", // style URL
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9, // starting zoom
        });
        setMap(newMap);
    }, []);

    return (
        <div className="map-container">
            <div id="map" style={{ height: 500, width: 1000 }}></div>
            <MapInteraction map={map}></MapInteraction>
        </div>
    );
};
