import { navigate } from "raviger";
import React, { useEffect, useState } from "react";
import firebase from "../firebase/firebase";
import BrainApi from "./brain-api";
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

    const _button = currentUser ? (
        <button onClick={() => auth.signOut()}>sign out</button>
    ) : (
        <button onClick={() => navigate("/sign_in")}>sign in</button>
    );

    return (
        <div className="App">
            <div>
                <div>
                    {_button}
                    {/* <button onClick={() => auth.signOut()}>sign out</button> */}
                </div>
                {/* <Modal isShowing={showSignInModal}>
                    <SignInModal
                        auth={auth}
                        database={database}
                        closeModal={() => setShowSignModal(false)}
                    />
                </Modal> */}
                {/* <button onClick={() => setShowSignModal(true)}>sign in</button> */}
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
