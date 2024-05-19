import { useRecoilState } from "recoil";
import { homeToggleDetailsState } from "../../../../atoms/home";
import Avatar from "../../../ui/avatar/avatar";
import "./header.sass";

import React from "react";

import { IoSettingsSharp  } from "react-icons/io5";
import Icon from "../../../ui/icon/icon";

const RoomHeader: React.FunctionComponent<{ title: string; scrollTop: number; roomId: number }> = ({ title, scrollTop, roomId }) => {
    const [isDetailsOpen, setDetails] = useRecoilState(homeToggleDetailsState);
    const toggleDetails = () => setDetails(state => !state);

    if (!scrollTop) {
        return <React.Fragment />
    }

    return <div className="room-header" style={{
        opacity: `clamp(0, ${scrollTop / 360}, 1)`
    }}>
        <div className="room-header-title">
            <div className="room-header-avatar"><Avatar title={ title[0] } roomId={ roomId } onClick={ toggleDetails } /></div>
            { title }
        </div>
        <div className="room-header-options">
            { !isDetailsOpen ? <span className="room-header-options-item">
                <Icon Icon={ IoSettingsSharp } onClick={ toggleDetails } />
            </span> : <React.Fragment />}
        </div>
    </div>
}

export default RoomHeader;