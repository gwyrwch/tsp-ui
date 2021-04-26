import mapboxgl, { Marker, LngLatBounds, Popup } from "mapbox-gl";
import { useEffect, useState } from "react";

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3d5cndjaCIsImEiOiJja254NWpwbG8wNjVxMnByeHFnenJuZHN0In0.TcPjWaplIJGJccgDCgRwoA";

export const Map = () => {
    const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

    useEffect(() => {
        console.log("map created");
        const map = new mapboxgl.Map({
            container: "map", // container ID
            style: "mapbox://styles/mapbox/streets-v11", // style URL
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9, // starting zoom
        });
        map.on("load", (loadEvent) => {
            map.on("click", (event) => {
                const point = event.lngLat;

                console.log(markers);

                if (
                    markers.filter((marker) => marker.getLngLat() === point)
                        .length > 0
                ) {
                } else {
                    const marker = new mapboxgl.Marker()
                        .setLngLat([point.lng, point.lat])
                        .setPopup(new mapboxgl.Popup().setHTML("Kek!"))
                        .setDraggable(true)
                        .addTo(map);

                    setMarkers((markers) => {
                        markers.push(marker);
                        return markers;
                    });
                }
            });
        });
    });

    return <div id="map" style={{ height: 500, width: 1000 }}></div>;
};
