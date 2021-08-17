import mapboxgl from "mapbox-gl";
import React, { useCallback, useEffect, useState } from "react";
import validFilename from "valid-filename";
import firebase from "../firebase/firebase";
import BrainApi from "./brain-api";
import { Header } from "./header";
import { Map } from "./map/map";
import { Menu } from "./menu";
import { AllFilesModalModal } from "./modal/all-files-modal";
import { InputModal } from "./modal/input-modal";
import { Modal } from "./modal/modal";
import RangeSlider from "./range-slider";

interface Props {
    auth: firebase.auth.Auth;
    database: firebase.database.Database;
}

enum RequestType {
    NONE = 0,
    NEW_FILE = 1,
    OPEN_FILE = 2,
    SAVE_FILE = 3,
    ALL_FILES = 4,
}

export const MainPage = (props: Props) => {
    const { auth } = props;
    const brainClient = BrainApi.getInstance();
    const [tour, setTour] = useState<Array<Number>>([]);
    const [currentUser, setCurrentUser] = useState<firebase.User | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorModalMessage, setErrorModalMessage] = useState<string | null>(
        null
    );
    const [allFilesModalData, setAllFilesModalData] = useState<string | null>(
        null
    );

    const [currentFile, setCurrentFile] = useState<string>("");
    const [requestTypeForModalSubmit, setRequestTypeForModalSubmit] =
        useState<RequestType>(RequestType.NONE);
    const [rangeval, setRangeval] = useState<number>(5);

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
        const response = await brainClient.run(currentUser?.uid, rangeval);

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

    const openFile = async (fileName: string) => {
        if (!currentUser) return;

        setLoading(true);
        const response = await brainClient.getFile(currentUser.uid, fileName);
        setLoading(false);

        console.log("openfileresponse", response);
        return response;
    };

    const allFiles = async () => {
        if (!currentUser) return;

        setLoading(true);
        const response = await brainClient.getAllFiles(currentUser.uid);
        const response1 = await brainClient.getAllFiles1(currentUser.uid);
        console.log("1KEK", response);
        console.log("2KEK", response1);
        setLoading(false);

        return response;
    };

    const allFilesOnClick = async () => {
        const response = await allFiles();
        if (response["code"] === 200) {
            console.log("good", response);
            setAllFilesModalData(response["files"]);
        } else {
            setAllFilesModalData("");
        }
    };

    const newFileOnClick = () => {
        setErrorModalMessage("");
        setRequestTypeForModalSubmit(RequestType.NEW_FILE);
    };

    const saveFileOnClick = () => {
        setErrorModalMessage("");
        setRequestTypeForModalSubmit(RequestType.SAVE_FILE);
    };

    const openFileOnClick = () => {
        setErrorModalMessage("");
        setRequestTypeForModalSubmit(RequestType.OPEN_FILE);
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
            } else if (requestTypeForModalSubmit === RequestType.OPEN_FILE) {
                const response = await openFile(data);
                const code = response["code"];
                if (code === 200) {
                    const matrix = response["matrix"];
                    const points = response["points"];
                    // console.log(points);

                    const markers = points.map((point: number[]) => {
                        return new mapboxgl.Marker({
                            color: "#007afc",
                        })
                            .setLngLat([point[0], point[1]])
                            .setDraggable(true);
                    });

                    brainClient.setMatrix(matrix);
                    brainClient.setPoints(markers);
                    document.body.dispatchEvent(
                        new CustomEvent("abacaba", { detail: "123" })
                    );
                    // brainClient.setMarkers(markers);

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
            <Modal isShowing={allFilesModalData !== null}>
                <AllFilesModalModal
                    closeModal={() => setAllFilesModalData(null)}
                    allFiles={allFilesModalData}
                ></AllFilesModalModal>
            </Modal>
            <div>
                <Header
                    auth={auth}
                    isSignedIn={currentUser ? true : false}
                    isHeaderWithButtons={true}
                ></Header>
                <Menu
                    runOnClick={run}
                    isSignedIn={currentUser ? true : false}
                    newFileOnClick={newFileOnClick}
                    saveFileOnClick={saveFileOnClick}
                    allFilesOnClick={allFilesOnClick}
                    openFileOnClick={openFileOnClick}
                    runLoading={loading}
                ></Menu>
                <RangeSlider
                    onChange={(event) =>
                        setRangeval(+event.currentTarget.value)
                    }
                    rangeval={rangeval}
                ></RangeSlider>
                {/* <div
                    style={{
                        color: "#fff",
                        marginLeft: "1em",
                        fontSize: "smaller",
                    }}
                >
                    Current file: <b>{currentFile}</b>
                </div> */}
            </div>
            <Map
                tour={tour}
                loading={loading}
                isAuth={currentUser !== null}
            ></Map>
        </div>
    );
};
