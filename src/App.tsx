import React, { useState } from "react";
import { Map } from "./components/map";
import "./App.css";
import BrainApi from "./components/brain-api";

const App = () => {
    const brainClient = BrainApi.getInstance();
    const [tour, setTour] = useState<Array<Number>>([]);

    return (
        <div className="App">
            <div>
                <div>
                    <button
                        onClick={async () => {
                            if (brainClient.matrix !== []) {
                                const response = await brainClient.run();
                                const newTour = response["tour"];
                                newTour.push(newTour[0]);
                                setTour(newTour);
                            }
                        }}
                    >
                        RUN
                    </button>
                </div>
                <div>
                    <button onClick={brainClient.addPoint}>ADD POINT</button>
                </div>
                <div>
                    <button onClick={brainClient.newFile}>NEW FILE</button>
                </div>
                <div>
                    <button onClick={brainClient.getFile}>GET FILE</button>
                </div>
                <div>
                    <button onClick={brainClient.getAllFiles}>
                        GET ALL FILES
                    </button>
                </div>
            </div>
            <Map tour={tour}></Map>
        </div>
    );
};

export default App;
