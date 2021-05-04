import React, { useEffect, useState } from "react";

interface Props {
    errorMessage: string | null;
    submitOnClick: (data: string) => void;
    closeModal: () => void;
    labelText: string;
    currentFile: string;
}

export const InputModal = (props: Props) => {
    const [inputData, setInputData] = useState<string>("");

    const {
        submitOnClick,
        errorMessage,
        labelText,
        closeModal,
        currentFile,
    } = props;

    useEffect(() => {
        setInputData(currentFile);
    }, [currentFile]);

    const createInputChangeHandler = (
        setterMethod: React.Dispatch<React.SetStateAction<string>>
    ) => (event: React.FormEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setterMethod(value);
    };

    return (
        <div className="modal-wrapper">
            <div>
                <label>
                    {labelText}:
                    <input
                        type="text"
                        value={inputData}
                        placeholder="myFile"
                        onChange={createInputChangeHandler(setInputData)}
                        className="sign-in-input"
                    />
                </label>
            </div>
            <span>{errorMessage}</span>
            <div>
                <button
                    className="btn-modal-submit"
                    onClick={() => submitOnClick(inputData)}
                >
                    Submit
                </button>
                <button className="btn-modal-cancel" onClick={closeModal}>
                    Close
                </button>
            </div>
        </div>
    );
};
