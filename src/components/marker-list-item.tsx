interface Props {
    marker: mapboxgl.Marker;
}

export const MarkerListItem = (props: Props) => {
    const { marker } = props;
    return <div>{marker.getLngLat}</div>;
};
