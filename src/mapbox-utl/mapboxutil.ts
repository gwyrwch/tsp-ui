import mapboxgl from "mapbox-gl";

export default class ClickableMarker extends mapboxgl.Marker {
    private _handleClick: any;
    private _element: any;

    // new method onClick, sets _handleClick to a function you pass in
    onClick(handleClick: any) {
        this._handleClick = handleClick;
        return this;
    }

    // the existing _onMapClick was there to trigger a popup
    // but we are hijacking it to run a function we define
    _onMapClick(e: any) {
        const targetElement = e.originalEvent.target;
        const element = this._element;

        if (
            this._handleClick &&
            (targetElement === element || element.contains(targetElement))
        ) {
            this._handleClick();
        }
    }
}

/*
mapbox-gl.js:33 Uncaught TypeError: Cannot read property 'parentNode' of undefined
    at Object.i.remove (mapbox-gl.js:33)
    at ClickableMarker.o.remove (mapbox-gl.js:33)
    at ClickableMarker.o.addTo (mapbox-gl.js:33)
    at r.<anonymous> (map.tsx:30)
    at r.St.fire (mapbox-gl.js:29)
    at HTMLDivElement.<anonymous> (mapbox-gl.js:33)
*/
