interface Props {
    runOnClick: () => void;
    newFileOnClick: () => void;
    saveFileOnClick: () => void;
    runLoading: boolean;
    isSignedIn: boolean;
}

export const Menu = (props: Props) => {
    const {
        runOnClick,
        newFileOnClick,
        saveFileOnClick,
        runLoading,
        isSignedIn,
    } = props;
    return (
        <div className="menu">
            <button disabled={runLoading} onClick={runOnClick}>
                RUN
            </button>

            <button
                disabled={runLoading || !isSignedIn}
                onClick={newFileOnClick}
            >
                NEW FILE
            </button>

            <button
                disabled={runLoading || !isSignedIn}
                onClick={() => console.log("brainClient.openFile")}
            >
                OPEN FILE
            </button>

            <button
                disabled={runLoading || !isSignedIn}
                onClick={saveFileOnClick}
            >
                SAVE FILE
            </button>

            <button
                disabled={runLoading || !isSignedIn}
                onClick={() => console.log("brainClient.getAllFiles")}
            >
                GET ALL FILES
            </button>
        </div>
    );
};
