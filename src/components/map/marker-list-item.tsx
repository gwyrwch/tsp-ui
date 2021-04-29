import React from "react";
import { IconContext } from "react-icons";
import { AiOutlineDelete } from "react-icons/ai";

interface Props {
    marker: mapboxgl.Marker;
    markerIndex: number;
    deleteMarker: (index: number) => void;
    mouseOverMarker: (index: number) => void;
    mouseOutMarker: (index: number) => void;
}

export const MarkerListItem = (props: Props) => {
    const {
        marker,
        deleteMarker,
        markerIndex,
        mouseOverMarker,
        mouseOutMarker,
    } = props;

    return (
        <div
            className="marker-list-item"
            onMouseOver={() => mouseOverMarker(markerIndex)}
            onMouseOut={() => mouseOutMarker(markerIndex)}
        >
            <div className="lng-lat-container">{`${marker
                .getLngLat()
                .lng.toFixed(3)}, ${marker.getLngLat().lat.toFixed(3)}`}</div>
            <button onClick={() => deleteMarker(markerIndex)}>
                <IconContext.Provider
                    value={{
                        className: "delete-marker-icon",
                    }}
                >
                    <AiOutlineDelete />
                </IconContext.Provider>
            </button>
        </div>
    );
};
