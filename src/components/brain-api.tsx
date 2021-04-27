export default class BrainApi {
    matrix: Array<Array<Number>>;
    points: Array<Array<Number>>;

    private constructor() {
        this.matrix = [];
        this.points = [];
    }

    // singleton
    private static _instance: BrainApi;
    static getInstance() {
        return this._instance || (this._instance = new this());
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

    setPoints(points: Array<Array<Number>>) {
        this.points = points;
    }

    fetchData(methodName: string, body: string) {
        return fetch(`http://localhost:3002/${methodName}`, {
            // mode: "no-cors",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        });
    }

    async addPoint() {
        const response = await this.fetchData(
            "addpoint",
            JSON.stringify({
                userId: 123,
                filename: "test.tsp",
                point: "1",
            })
        );
        return response.json();
    }

    async newFile() {
        const response = await this.fetchData(
            "newfile",
            JSON.stringify({
                userId: 123,
                filename: "xyz.tsp",
            })
        );
        return response.json();
    }

    async getFile() {
        const response = await this.fetchData(
            "file",
            JSON.stringify({ userId: 5, filename: "getFile.tsp" })
        );

        return response.json();
    }

    async getAllFiles() {
        const response = await this.fetchData(
            "allfiles",
            JSON.stringify({ userId: 5 })
        );

        return response.json();
    }

    async run() {
        const response = await this.fetchData(
            "run",
            JSON.stringify({
                userId: 5,
                matrix: this.matrix,
            })
        );

        return response.json();
    }
}
