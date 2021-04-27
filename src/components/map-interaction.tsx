import mapboxgl, { Marker } from "mapbox-gl";
import React, { useCallback, useEffect, useState } from "react";
import BrainApi from "./brain-api";
import { MarkerListItem } from "./marker-list-item";

interface Props {
    map: mapboxgl.Map | undefined;
}

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3d5cndjaCIsImEiOiJja254NWpwbG8wNjVxMnByeHFnenJuZHN0In0.TcPjWaplIJGJccgDCgRwoA";

export const MapInteraction = (props: Props) => {
    const { map } = props;
    const [markers, setMarkers] = useState<Marker[]>([]);
    // const [durations, setDurations] = useState<Array<Array<Number>>>();

    useEffect(() => {
        let listener: (event: mapboxgl.MapMouseEvent) => void;
        if (map) {
            listener = (event: mapboxgl.MapMouseEvent) => {
                const point = event.lngLat;

                const marker = new mapboxgl.Marker({ color: "#12ef56" })
                    .setLngLat([point.lng, point.lat])
                    .setPopup(new mapboxgl.Popup().setHTML("Kek!"))
                    .setDraggable(true)
                    .addTo(map);

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

    const deleteMarker = (index: number) => {
        markers[index].remove();
        const newMarkers = markers.filter((_, i) => i !== index);
        setMarkers(newMarkers);
    };

    const mouseOverMarker = (index: number) => {
        const markerSvg = markers[index]
            .getElement()
            .querySelectorAll('svg g[fill="#12ef56"]')[0];

        if (markerSvg) {
            markerSvg.setAttribute("fill", "#eeef32");
        }
    };

    const mouseOutMarker = (index: number) => {
        const markerSvg = markers[index]
            .getElement()
            .querySelectorAll('svg g[fill="#eeef32"]')[0];

        if (markerSvg) markerSvg.setAttribute("fill", "#12ef56");
    };

    const markerList = markers.map((marker, index) => {
        return (
            <MarkerListItem
                marker={marker}
                key={index}
                markerIndex={index}
                deleteMarker={deleteMarker}
                mouseOverMarker={mouseOverMarker}
                mouseOutMarker={mouseOutMarker}
            ></MarkerListItem>
        );
    });

    const buildMatrix = () => {
        if (markers.length > 1) {
            const coords = markers
                .map((marker) => {
                    const { lng, lat } = marker.getLngLat();

                    return `${lng},${lat}`;
                })
                .join(";");

            const brainClient = BrainApi.getInstance();
            brainClient.setPoints(
                markers.map((marker) => {
                    const { lng, lat } = marker.getLngLat();
                    return [lng, lat];
                })
            );

            const requestString = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coords}?access_token=${mapboxgl.accessToken}`;

            getMarixFromApi(requestString);
        }
    };

    const getMarixFromApi = useCallback(async (request) => {
        const response = await fetch(request);

        const data = await response.json();
        const brainClient = BrainApi.getInstance();
        brainClient.setMatrix(data.durations); // in seconds
    }, []);

    return (
        <div className="marker-list-container">
            {markerList}
            <button onClick={buildMatrix}>BUILD MATRIX</button>
        </div>
    );
};
