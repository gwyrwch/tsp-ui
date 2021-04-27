import React from "react";
import { Map } from "./components/map";
import "./App.css";
import BrainApi from "./components/brain-api";

const App = () => {
    const brainClient = BrainApi.getInstance();
    return (
        <div className="App">
            <div>
                <div>
                    <button
                        onClick={async () => {
                            const response = await brainClient.run();

                            console.log(response);
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
            <Map></Map>
        </div>
    );
};

export default App;
