interface Props {
    allFiles: string | null;
    closeModal: () => void;
}

export const AllFilesModalModal = (props: Props) => {
    const { closeModal, allFiles } = props;

    const errorText = "NO FILES FOUND";

    const filesJSX = allFiles
        ?.split("\n")
        .filter((fileName) => fileName.length > 0)
        .map((fileName, index) => <li key={index}>{fileName}</li>);

    return (
        <div className="modal-wrapper">
            <div>{filesJSX}</div>
            <span>{allFiles?.length === 0 ? errorText : ""}</span>
            <div>
                <button className="btn-modal-cancel" onClick={closeModal}>
                    Close
                </button>
            </div>
        </div>
    );
};
