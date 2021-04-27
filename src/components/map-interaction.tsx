import GeoJSON from "geojson";
import mapboxgl, { GeoJSONSource, Marker } from "mapbox-gl";
import React, { useCallback, useEffect, useState } from "react";
import { setTokenSourceMapRange } from "typescript";
import BrainApi from "./brain-api";
import { MarkerListItem } from "./marker-list-item";

interface Props {
    map: mapboxgl.Map | undefined;
    tour: Array<Number>;
}

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3d5cndjaCIsImEiOiJja254NWpwbG8wNjVxMnByeHFnenJuZHN0In0.TcPjWaplIJGJccgDCgRwoA";

export const MapInteraction = (props: Props) => {
    const { map, tour } = props;
    const [markers, setMarkers] = useState<Marker[]>([]);
    // const [durations, setDurations] = useState<Array<Array<Number>>>();

    const getDrections = useCallback(async () => {
        if (!tour || tour.length === 0 || !map) {
            return;
        }
        const brainClient = BrainApi.getInstance();
        const pointsFormatted = tour
            .map((index) => {
                const { lng, lat } = brainClient.points[+index].getLngLat(); // use brainClient.points
                return `${lng},${lat}`;
            })
            .join(";");
        const request =
            "https://api.mapbox.com/directions/v5/mapbox/driving/" +
            pointsFormatted +
            "?geometries=geojson&access_token=" +
            mapboxgl.accessToken;

        const response = await fetch(request);
        const data = await response.json();
        console.log("data123", data);

        const route = data.routes[0].geometry.coordinates;
        console.log(route);
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
                    "line-color": "#3887be",
                    "line-width": 5,
                    "line-opacity": 0.75,
                },
            });
        }
    }, [markers, map, tour]);

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

            getDrections();

            // map.addLayer()
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
            brainClient.setPoints(markers.slice());

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
