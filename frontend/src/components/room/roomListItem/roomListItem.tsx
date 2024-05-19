import { useRecoilValue } from "recoil";
import { userDataState } from "../../../atoms/auth";
import Avatar from "../../ui/avatar/avatar";
import { SlOptionsVertical } from "react-icons/sl";
import "./roomListItem.sass";

import React, { useEffect } from "react";
import Icon from "../../ui/icon/icon";
import { CiRead, CiUnread } from "react-icons/ci";

function timeAgo(dateString: Date): string {
    const timestamp = Number(new Date(dateString));
    const now = Number(new Date());
    const secondsPast = (now - timestamp) / 1000;

    if (!Math.round(secondsPast))
        return '';

    if (secondsPast < 60) {
        return `- ${Math.round(secondsPast)} sec`;
    } else if (secondsPast < 3600) {
        return `- ${Math.round(secondsPast / 60)} mins`;
    } else if (secondsPast < 86400) {
        return `- ${Math.round(secondsPast / 3600)} hours`;
    } else if (secondsPast < 604800) {
        return `- ${Math.round(secondsPast / 86400)} days`;
    } else if (secondsPast < 2629800) {
        return `- ${Math.round(secondsPast / 604800)} weeks`;
    } else if (secondsPast < 31557600) {
        return `- ${Math.round(secondsPast / 2629800)} months`;
    } else {
        return `- ${Math.round(secondsPast / 31557600)} years`;
    }
}

const RoomListItem: React.FunctionComponent<TRoom & {
    roomId: number;
    onClick: () => void;

}> = ({ roomId, id, name, lastMessage, readonly, onClick }) => {
    const userData = useRecoilValue(userDataState);

    const viewed = lastMessage?.viewedIds.includes(userData.id) || true;
    const viewedClassName = !viewed ? ' notWiewed' : ''
    const isCurrentRoom =  roomId === id ? " active" : "" 

    const getLastMessage = () => {
        if (lastMessage && lastMessage?.crypted === false) {
            if (lastMessage.payload.type === 'text') {
                const who = lastMessage.ownerId === userData.id ? 'You: ' : '';
                return {
                    message: `${who}${lastMessage.payload.message}`,
                    time: `${timeAgo(lastMessage.lastEditDateTime)}`,
                };
            }
        }
    }

    return <div className={`room-item${isCurrentRoom}${viewedClassName}`} onClick={ onClick }>
        <div className="room-item-container">
            <div className="room-item-avatar">
                <Avatar title={ name[0] } roomId={ id } />
            </div>
            <div className="room-item-details">
                <div className="room-item-details-header">
                    <div className="room-item-details-name">
                        { name }
                        { readonly ?
                            <span><Icon Icon={ CiUnread } onClick={() => {}} /></span>
                            :
                            <React.Fragment />
                        }
                    </div>
                </div>
                <div className="room-item-details-footer">
                    <div className="room-item-details-history">{ getLastMessage()?.message }</div>
                    <div className="room-item-details-history-time">{ getLastMessage()?.time }</div>
                </div>
            </div>
            <div className="room-item-settings">
                <Icon Icon={ SlOptionsVertical } onClick={() => {}} />
            </div>
        </div>
    </div>
}

export default RoomListItem;
