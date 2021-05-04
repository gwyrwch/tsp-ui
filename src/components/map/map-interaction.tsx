import GeoJSON from "geojson";
import mapboxgl, { GeoJSONSource, Marker } from "mapbox-gl";
import React, { useCallback, useEffect, useState } from "react";
import BrainApi from "../brain-api";
import { MarkerListItem } from "./marker-list-item";

interface Props {
    map: mapboxgl.Map | undefined;
    tour: Array<Number>;
    loading: boolean;
    travelMode: string;
}

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3d5cndjaCIsImEiOiJja254NWpwbG8wNjVxMnByeHFnenJuZHN0In0.TcPjWaplIJGJccgDCgRwoA";

export const MapInteraction = (props: Props) => {
    const { map, tour, loading, travelMode } = props;
    const [markers, setMarkers] = useState<Marker[]>([]);
    // const [loading, setLoading] = useState<boolean>(false);
    // const [durations, setDurations] = useState<Array<Array<Number>>>();

    const getDirections = useCallback(async () => {
        if (!tour || tour.length === 0 || !map) {
            return;
        }

        const brainClient = BrainApi.getInstance();
        if (travelMode !== brainClient.matrixTravelMode) {
            // TODO: show modal that needed to rerun
            return;
        }

        const pointsFormatted = tour
            .map((index) => {
                const { lng, lat } = brainClient.points[+index].getLngLat(); // use brainClient.points
                return `${lng},${lat}`;
            })
            .join(";");
        const request =
            `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/` +
            pointsFormatted +
            "?geometries=geojson&access_token=" +
            mapboxgl.accessToken;

        const response = await fetch(request);
        const data = await response.json();
        console.log("data", data);

        const route = data.routes[0].geometry.coordinates;
        const geojson1 = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: route,
            },
        };

        if (map.getSource("route")) {
            (map.getSource("route") as GeoJSONSource).setData(
                geojson1 as GeoJSON.Feature<GeoJSON.Geometry>
            );
        } else {
            // otherwise, make a new request
            map.addLayer({
                id: "route",
                type: "line",
                source: {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: route,
                        },
                    },
                },
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#007afc",
                    "line-width": 5,
                    "line-opacity": 0.75,
                },
            });
        }

        // setLoading(false);
    }, [map, tour, travelMode]);

    useEffect(() => {
        let listener: (event: mapboxgl.MapMouseEvent) => void;
        if (map) {
            listener = (event: mapboxgl.MapMouseEvent) => {
                if (loading) return;
                const point = event.lngLat;

                const marker = new mapboxgl.Marker({ color: "#007afc" })
                    .setLngLat([point.lng, point.lat])
                    // .setPopup(new mapboxgl.Popup().setHTML("Kek!"))
                    .setDraggable(true)
                    .addTo(map);

                const newMarkers = [...markers];
                newMarkers.push(marker);
                setMarkers(newMarkers);

                const brainClient = BrainApi.getInstance();
                brainClient.setMarkers(newMarkers.slice());
            };
            map.on("click", listener);

            getDirections();

            // map.addLayer()
        }
        return () => {
            if (map) {
                map.off("click", listener);
            }
        };
    }, [map, getDirections, markers, loading]);

    const deleteMarker = (index: number) => {
        markers[index].remove();
        const newMarkers = markers.filter((_, i) => i !== index);
        setMarkers(newMarkers);

        const brainClient = BrainApi.getInstance();
        brainClient.setMarkers(newMarkers);
    };

    const mouseOverMarker = (index: number) => {
        const markerSvg = markers[index]
            .getElement()
            .querySelectorAll('svg g[fill="#007afc"]')[0];

        if (markerSvg) {
            markerSvg.setAttribute("fill", "#fa3434");
        }
    };

    const mouseOutMarker = (index: number) => {
        const markerSvg = markers[index]
            .getElement()
            .querySelectorAll('svg g[fill="#fa3434"]')[0];

        if (markerSvg) markerSvg.setAttribute("fill", "#007afc");
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

    return (
        <div className="marker-list-container">
            {markerList}
            {loading ? "loading" : "loaded"}
        </div>
    );
};
