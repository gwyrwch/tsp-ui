import React from "react";

interface Props {
    children: JSX.Element;
    isShowing: boolean;
}

export const Modal = (props: Props) => {
    const modalClass = props.isShowing ? "modal-show" : "modal-close";
    return <div className={`modal ${modalClass}`}>{props.children}</div>;
};
