import "./modal.sass";

import { SetterOrUpdater } from "recoil";

import React from "react";
import XIcon from "../x/x";

const Modal: React.FunctionComponent<{
    title: string;
    toggle: [boolean, SetterOrUpdater<boolean>];
    children: JSX.Element;

}> = ({ title, toggle, children }) => {
    const [isOpen, setOpen] = toggle;

    const closeModal = () => setOpen(false);

    if (!isOpen) {
        return <React.Fragment />
    }

    return <div className="modal">
        <span className="modal-background" onClick={ closeModal }></span>
        <div className="modal-container">
            <div className="modal-header">
                <span className="modal-header-title">{ title }</span>
                <XIcon onClick={ closeModal } />
            </div>
            { children }
        </div>
    </div>
}

export default Modal;