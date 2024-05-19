import RoomHeader from "./header/header";
import "./room.sass";

import React, { useContext, useEffect, useState } from "react";
import RoomHistory from "./history/history";
import RoomFooter from "./footer/footer";
import { RoomsContext } from "../../../contexts/roomContext";
import { useRecoilState } from "recoil";
import { followMessagesState } from "../../../atoms/chat";

const Room: React.FunctionComponent<TRoom> = ({ id, name }) => {
    const [, setFollowMessages] = useRecoilState(followMessagesState);
    const [scrollTop, setScrollTop] = useState(0);

    const getHistoryRef = ({ current }: React.RefObject<HTMLDivElement>) => {
        if (!current) return;

        const isFollowing = Number(((current.scrollTop + current.offsetHeight) - current.scrollHeight + 1).toFixed(0)) === 1;
        setFollowMessages(isFollowing);

        setScrollTop(current.scrollTop || 0);
    }

    return <div className="room-container">
        <RoomHeader title={ name } roomId={ id } scrollTop={ scrollTop } />
        <RoomHistory title={ name } roomId={ id } getHistoryRef={ getHistoryRef } />
        <RoomFooter roomId={ id } />
    </div>
}

export default Room;