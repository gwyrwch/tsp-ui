import { navigate } from "raviger";
import React, { useEffect, useState } from "react";
import firebase from "../firebase/firebase";
import BrainApi from "./brain-api";
import { Header } from "./header";
import { Map } from "./map/map";
import { Menu } from "./menu";

interface Props {
    auth: firebase.auth.Auth;
    database: firebase.database.Database;
}

export const MainPage = (props: Props) => {
    const { auth, database } = props;
    const brainClient = BrainApi.getInstance();
    const [tour, setTour] = useState<Array<Number>>([]);
    const [currentUser, setCurrentUser] = useState<firebase.User | null>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            console.log("In table");
            console.log("User = ", user);
            user ? setCurrentUser(user) : setCurrentUser(null);
        });
    }, [auth]);

    const run = async () => {
        setLoading(true);

        await brainClient.buildMatrix();
        const response = await brainClient.run();
        const newTour = response["tour"];
        newTour.push(newTour[0]);
        setTour(newTour);

        setLoading(false);
    };

    return (
        <div className="App">
            <div>
                <Header
                    auth={auth}
                    isSignedIn={currentUser ? true : false}
                ></Header>
                <Menu runOnClick={run} runLoading={loading}></Menu>
            </div>
            <Map tour={tour} loading={loading}></Map>
        </div>
    );
};
