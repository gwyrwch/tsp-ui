interface Props {
    runOnClick: () => void;
    runLoading: boolean;
}

export const Menu = (props: Props) => {
    const { runOnClick, runLoading } = props;
    return (
        <div className="menu">
            <button disabled={runLoading} onClick={runOnClick}>
                RUN
            </button>

            {/* <button onClick={() => console.log("brainClient.addPoint")}>
                ADD POINT
            </button> */}

            <button
                disabled={runLoading}
                onClick={() => console.log("brainClient.newFile")}
            >
                NEW FILE
            </button>

            <button
                disabled={runLoading}
                onClick={() => console.log("brainClient.getFile")}
            >
                GET FILE
            </button>

            <button
                disabled={runLoading}
                onClick={() => console.log("brainClient.getAllFiles")}
            >
                GET ALL FILES
            </button>
        </div>
    );
};
