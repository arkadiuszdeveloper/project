import "./roomAccordion.sass";

import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import React from "react";

const RoomAccordion: React.FunctionComponent<{
    title: string;
    children: JSX.Element | JSX.Element[];
    toggle: () => void;
    isOpen: boolean;
    flexCenter: boolean;

}> = ({ title, children, toggle, isOpen, flexCenter = false }) => {
    return <div className={`room-details-accordion${flexCenter ? ' flexCenter' : ''}`}>
        <div className="room-details-accordion-header" onClick={ toggle }>
            <span className="room-details-accordion-header-title">{ title }</span>
            <span>
                { isOpen ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown /> }
            </span>
        </div>

        <div className="room-details-accordion-content">
            { isOpen ? (
                Array.isArray(children) ?
                    children.map((child, index) => <span key={ index } className="room-details-accordion-item">{ child }</span>)
                    :
                    <span className="room-details-accordion-item">{ children }</span>
            ) : <React.Fragment /> }
        </div>
    </div>
}

export default RoomAccordion;
