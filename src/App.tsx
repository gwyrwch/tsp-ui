import React, { useCallback, useEffect, useState } from "react";
import { Map } from "./components/map";
import "./App.css";

const App = () => {
    const [t, setT] = useState<string>("-");

    useEffect(() => {});

    const fetchData = (methodName: string, body: string) => {
        return fetch(`http://localhost:3002/${methodName}`, {
            // mode: "no-cors",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        });
    };

    const addPoint = useCallback(async () => {
        const response = await fetchData(
            "addpoint",
            JSON.stringify({
                userId: 123,
                filename: "test.tsp",
                point: "1",
            })
        );

        const data = await response.json();

        if (data) {
            console.log(data);
            setT(data.filename);
        }
    }, []);

    const newFile = useCallback(async () => {
        const response = await fetchData(
            "newfile",
            JSON.stringify({
                userId: 123,
                filename: "xyz.tsp",
            })
        );

        const data = await response.json();

        if (data) {
            console.log(data);
            setT(data.filename);
        }
    }, []);

    const getFile = useCallback(async () => {
        const response = await fetchData(
            "file",
            JSON.stringify({ userId: 5, filename: "getFile.tsp" })
        );

        const data = await response.json();

        if (data) {
            console.log(data);
            setT(data.filename);
        }
    }, []);

    const getAllFiles = useCallback(async () => {
        const response = await fetchData(
            "allfiles",
            JSON.stringify({ userId: 5 })
        );

        const data = await response.json();

        if (data) {
            console.log(data);
            setT("userId: " + data.userId);
        }
    }, []);

    const run = useCallback(async () => {
        const response = await fetchData(
            "run",
            JSON.stringify({
                userId: 5,
                filename: "run.tsp",
                options: { kek: "lol" },
            })
        );

        const data = await response.json();

        if (data) {
            console.log(data);
            setT(data.filename);
        }
    }, []);

    const markerList = [];

    return (
        <div className="App">
            <div>
                <button onClick={run}>RUN</button>
            </div>
            <div>
                <button onClick={addPoint}>ADD POINT</button>
            </div>
            <div>
                <button onClick={newFile}>NEW FILE</button>
            </div>
            <div>
                <button onClick={getFile}>GET FILE</button>
            </div>
            <div>
                <button onClick={getAllFiles}>GET ALL FILES</button>
            </div>
            {t}
            <Map></Map>
        </div>
    );
};

export default App;
