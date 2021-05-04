interface Props {
    runOnClick: () => void;
    newFileOnClick: () => void;
    saveFileOnClick: () => void;
    allFilesOnClick: () => void;
    openFileOnClick: () => void;
    runLoading: boolean;
    isSignedIn: boolean;
}

export const Menu = (props: Props) => {
    const {
        runOnClick,
        newFileOnClick,
        saveFileOnClick,
        allFilesOnClick,
        openFileOnClick,
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
                onClick={openFileOnClick}
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
                onClick={allFilesOnClick}
            >
                GET ALL FILES
            </button>
        </div>
    );
};
