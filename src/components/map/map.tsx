import mapboxgl from "mapbox-gl";
import { FormEvent, useEffect, useState } from "react";
import BrainApi from "../brain-api";
import { MapInteraction } from "./map-interaction";
import { TravelMode } from "./travel-mode";

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3d5cndjaCIsImEiOiJja254NWpwbG8wNjVxMnByeHFnenJuZHN0In0.TcPjWaplIJGJccgDCgRwoA";

interface Props {
    tour: Array<Number>;
    loading: boolean;
    isAuth: boolean;
}

export const Map = (props: Props) => {
    const { tour, loading, isAuth } = props;

    const [map, setMap] = useState<mapboxgl.Map>();
    const [travelMode, setTravelMode] = useState<string>("driving");
    const brainClient = BrainApi.getInstance();

    useEffect(() => {
        if (!map) {
            const newMap = new mapboxgl.Map({
                container: "map", // container ID
                style: "mapbox://styles/mapbox/streets-v11", // style URL
                center: [27.586, 53.917], // starting position [lng, lat]
                zoom: 14, // starting zoom,
                minZoom: 5,
            });

            setMap(newMap);
        }
    }, [map]);

    const onTravelModeChange = (e: { target: HTMLInputElement }) => {
        if (e.target.name === "profile") {
            const profile = e.target.value;
            setTravelMode(profile);
            brainClient.setTravelMode(profile);
        } else {
            console.log("govno");
        }
    };

    return (
        <div className="map-container">
            <div id="map" style={{ height: 600, width: "73vw" }}></div>
            <TravelMode onChange={onTravelModeChange}></TravelMode>
            <MapInteraction
                map={map}
                tour={tour}
                loading={loading}
                travelMode={travelMode}
                isAuth={isAuth}
            ></MapInteraction>
        </div>
    );
};
