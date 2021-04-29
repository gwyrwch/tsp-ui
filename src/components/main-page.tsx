import { navigate } from "raviger";
import React, { useEffect, useState } from "react";
import firebase from "../firebase/firebase";
import BrainApi from "./brain-api";
import { Header } from "./header";
import { Map } from "./map/map";

interface Props {
    auth: firebase.auth.Auth;
    database: firebase.database.Database;
}

export const MainPage = (props: Props) => {
    const { auth, database } = props;
    const brainClient = BrainApi.getInstance();
    const [tour, setTour] = useState<Array<Number>>([]);
    const [currentUser, setCurrentUser] = useState<firebase.User | null>();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            console.log("In table");
            console.log("User = ", user);
            user ? setCurrentUser(user) : setCurrentUser(null);
        });
    }, [auth]);

    return (
        <div className="App">
            <div>
                <Header
                    auth={auth}
                    isSignedIn={currentUser ? true : false}
                ></Header>
                <div>
                    <button
                        onClick={async () => {
                            await brainClient.buildMatrix();
                            const response = await brainClient.run();
                            const newTour = response["tour"];
                            newTour.push(newTour[0]);
                            setTour(newTour);
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
