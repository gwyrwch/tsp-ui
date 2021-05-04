import React, { useCallback, useEffect, useState } from "react";
import validFilename from "valid-filename";
import firebase from "../firebase/firebase";
import BrainApi from "./brain-api";
import { Header } from "./header";
import { Map } from "./map/map";
import { Menu } from "./menu";
import { InputModal } from "./modal/input-modal";
import { Modal } from "./modal/modal";

interface Props {
    auth: firebase.auth.Auth;
    database: firebase.database.Database;
}

enum RequestType {
    NONE = 0,
    NEW_FILE = 1,
    OPEN_FILE = 2,
    SAVE_FILE = 3,
}

export const MainPage = (props: Props) => {
    const { auth, database } = props;
    const brainClient = BrainApi.getInstance();
    const [tour, setTour] = useState<Array<Number>>([]);
    const [currentUser, setCurrentUser] = useState<firebase.User | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorModalMessage, setErrorModalMessage] = useState<string | null>(
        null
    );
    const [currentFile, setCurrentFile] = useState<string>("");
    const [
        requestTypeForModalSubmit,
        setRequestTypeForModalSubmit,
    ] = useState<RequestType>(RequestType.NONE);

    const onAuthStateChange = useCallback(() => {
        return auth.onAuthStateChanged((user) => {
            user ? setCurrentUser(user) : setCurrentUser(null);
        });
    }, [auth]);

    useEffect(() => {
        const unsubscribe = onAuthStateChange();
        return () => {
            unsubscribe();
        };
    }, [onAuthStateChange]);

    const run = async () => {
        if (brainClient.markers.length < 2) {
            console.log("cannot build matrix");
            return;
        }
        setLoading(true);

        await brainClient.buildMatrix();
        const response = await brainClient.run(currentUser?.uid);

        console.log(response);
        const newTour = response["tour"];
        newTour.push(newTour[0]);
        setTour(newTour);

        // todo: get total time

        setLoading(false);
    };

    const newFile = async (fileName: string) => {
        if (!currentUser) return;

        setLoading(true);
        const response = await brainClient.newFile(currentUser.uid, fileName);
        setLoading(false);

        return response["code"];
    };

    const saveFile = async (fileName: string) => {
        if (!currentUser) return;

        setLoading(true);
        const response = await brainClient.saveFile(currentUser.uid, fileName);
        setLoading(false);

        return response["code"];
    };

    const newFileOnClick = () => {
        setErrorModalMessage("");
        setRequestTypeForModalSubmit(RequestType.NEW_FILE);
    };

    const saveFileOnClick = () => {
        setErrorModalMessage("");
        setRequestTypeForModalSubmit(RequestType.SAVE_FILE);
    };

    const submitOnClick = async (data: string) => {
        if (validFilename(data) === false) {
            setErrorModalMessage("invalid filename");
            return;
        } else {
            if (requestTypeForModalSubmit === RequestType.NEW_FILE) {
                const code = await newFile(data);
                if (code === 201) {
                    setErrorModalMessage(null);
                    setRequestTypeForModalSubmit(RequestType.NONE);

                    setCurrentFile(data);
                } else if (code === 400) {
                    setErrorModalMessage("file already exists");
                } else if (code === 500) {
                    setErrorModalMessage("server error, try later");
                }
            } else if (requestTypeForModalSubmit === RequestType.SAVE_FILE) {
                const code = await saveFile(data);
                if (code === 201) {
                    setErrorModalMessage(null);
                    setRequestTypeForModalSubmit(RequestType.NONE);
                } else if (code === 400) {
                    setErrorModalMessage("file doesn't exist");
                } else if (code === 500) {
                    setErrorModalMessage("server error, try later");
                }
            }
        }
    };

    return (
        <div className="App">
            <Modal isShowing={errorModalMessage !== null}>
                <InputModal
                    submitOnClick={submitOnClick}
                    closeModal={() => {
                        setErrorModalMessage(null);
                        setRequestTypeForModalSubmit(RequestType.NONE);
                    }}
                    errorMessage={errorModalMessage}
                    labelText={"File name"}
                    currentFile={currentFile}
                />
            </Modal>
            <div>
                <Header
                    auth={auth}
                    isSignedIn={currentUser ? true : false}
                ></Header>
                <Menu
                    runOnClick={run}
                    isSignedIn={currentUser ? true : false}
                    newFileOnClick={newFileOnClick}
                    saveFileOnClick={saveFileOnClick}
                    runLoading={loading}
                ></Menu>
                <div
                    style={{
                        color: "#fff",
                        marginLeft: "1em",
                        fontSize: "smaller",
                    }}
                >
                    Current file: <b>{currentFile}</b>
                </div>
            </div>
            <Map tour={tour} loading={loading}></Map>
        </div>
    );
};
