import mapboxgl, { Marker } from "mapbox-gl";
import React, { useEffect, useState } from "react";
import { MarkerListItem } from "./marker-list-item";

interface Props {
    map: mapboxgl.Map | undefined;
}

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3d5cndjaCIsImEiOiJja254NWpwbG8wNjVxMnByeHFnenJuZHN0In0.TcPjWaplIJGJccgDCgRwoA";

export const MapInteraction = (props: Props) => {
    const { map } = props;
    const [markers, setMarkers] = useState<Marker[]>([]);

    useEffect(() => {
        let listener: (event: mapboxgl.MapMouseEvent) => void;
        if (map) {
            listener = (event: mapboxgl.MapMouseEvent) => {
                console.log("click called");
                const point = event.lngLat;

                const marker = new mapboxgl.Marker()
                    .setLngLat([point.lng, point.lat])
                    .setPopup(new mapboxgl.Popup().setHTML("Kek!"))
                    .setDraggable(true)
                    .addTo(map);

                console.log("kerk", markers.length);
                setMarkers((old) => {
                    const new_ = old.slice();
                    new_.push(marker);
                    return new_;
                });
            };
            map.on("click", listener);
        }
        return () => {
            if (map) {
                map.off("click", listener);
            }
        };
    });

    const markerList = markers.map((marker, index) => {
        return <MarkerListItem marker={marker} key={index}></MarkerListItem>;
    });

    return <div>{markerList}</div>;
};
