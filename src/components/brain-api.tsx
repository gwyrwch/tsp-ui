import { accessToken, Marker } from "mapbox-gl";

export default class BrainApi {
    matrix: Array<Array<Number>>;
    points: Marker[]; // for tour
    markers: Marker[]; // current markers
    travelMode: string;
    matrixTravelMode: string;

    private constructor() {
        this.matrix = [];
        this.points = [];
        this.markers = [];
        this.travelMode = "driving";
        this.matrixTravelMode = "driving";
    }

    // singleton
    private static _instance: BrainApi;
    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    setTravelMode(newTravelMode: string) {
        this.travelMode = newTravelMode;
    }

    setMatrixTravelMode(newTravelMode: string) {
        this.matrixTravelMode = newTravelMode;
    }

    setMatrix(matrix: Array<Array<Number>>) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                const val = Math.floor(
                    (matrix[i][j].valueOf() + matrix[j][i].valueOf()) / 2
                );
                matrix[i][j] = val;
                matrix[j][i] = val;
            }
        }
        console.log(matrix);
        this.matrix = matrix;
    }

    setPoints(points: Marker[]) {
        this.points = points;
    }

    setMarkers(markers: Marker[]) {
        this.markers = markers;
    }

    async buildMatrix() {
        if (this.markers.length > 1) {
            const coords = this.markers
                .map((marker) => {
                    const { lng, lat } = marker.getLngLat();

                    return `${lng},${lat}`;
                })
                .join(";");

            const requestString = `https://api.mapbox.com/directions-matrix/v1/mapbox/${this.travelMode}/${coords}?access_token=${accessToken}`;
            await this.getMarixFromApi(requestString);
            this.setMatrixTravelMode(this.travelMode);
        }
    }

    async getMarixFromApi(request: string) {
        const response = await fetch(request);

        const data = await response.json();
        this.setPoints(this.markers.slice());
        this.setMatrix(data.durations); // in seconds
    }

    fetchData(methodName: string, body: string) {
        return fetch(`http://localhost:3002/${methodName}`, {
            // mode: "no-cors",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        });
    }

    async getFile(uid: string, fileName: string) {
        const response = await this.fetchData(
            "file",
            JSON.stringify({ userId: uid, filename: fileName })
        );

        return response.json();
    }

    async getAllFiles(uid: string) {
        const response = await this.fetchData(
            "allfiles",
            JSON.stringify({ userId: uid })
        );

        return response.json();
    }

    async run(uid: string | undefined) {
        const response = await this.fetchData(
            "run",
            JSON.stringify({
                userId: uid ? uid : "DEFAULT_USER",
                matrix: this.matrix,
            })
        );

        return response.json();
    }

    async newFile(uid: string, fileName: string) {
        console.log(uid, fileName);
        const response = await this.fetchData(
            "newfile",
            JSON.stringify({
                userId: uid,
                filename: fileName,
            })
        );
        return response.json();
    }

    async saveFile(uid: string, fileName: string) {
        const response = await this.fetchData(
            "savefile",
            JSON.stringify({
                userId: uid,
                filename: fileName,
                matrix: this.matrix,
                points: this.points.map((marker) => [
                    marker.getLngLat().lng,
                    marker.getLngLat().lat,
                ]),
            })
        );

        return response.json();
    }
}
