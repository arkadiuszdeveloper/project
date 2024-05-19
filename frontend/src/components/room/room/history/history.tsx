import { useRecoilState, useRecoilValue } from "recoil";
import { homeToggleDetailsState } from "../../../../atoms/home";
import Message from "../../../message/message";
import Avatar from "../../../ui/avatar/avatar";
import "./history.sass";

import React, { useContext } from "react";
import { userDataState } from "../../../../atoms/auth";
import { RoomsContext } from "../../../../contexts/roomContext";
import { followMessagesState, messageReplyState } from "../../../../atoms/chat";

const RoomHistory: React.FunctionComponent<{ title: string, roomId: number, getHistoryRef: (ref: React.RefObject<HTMLDivElement>) => void }> = ({ title, roomId, getHistoryRef }) => {
    const followMessages = useRecoilValue(followMessagesState);

    const { messageApi: { getMessageList, getMessages, sendTextMessage } } = useContext(RoomsContext);

    const messageReply = useRecoilValue(messageReplyState);

    const [, setDetails] = useRecoilState(homeToggleDetailsState);
    const userData = useRecoilValue(userDataState);
    const historyRef = React.useRef<HTMLDivElement>(null);

    const toggleDetails = () => setDetails(state => !state);

    const sortMessages = (msgA: TMessage, msgB: TMessage) => {
        const a = Number(new Date(msgA.createDateTime || msgA.lastEditDateTime || 0));
        const b = Number(new Date(msgB.createDateTime || msgB.lastEditDateTime || 0));

        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    }

    React.useEffect(() => {
        if (historyRef.current && followMessages) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [getMessageList, getMessages, sendTextMessage, followMessages])

    const checkMessageOwner = (msg: TMessage, index: number, array: TMessage[]) => {
        var hideAvatar = false;
        var hideName = false;
        if (index) {
            const prevMsg = array[index - 1];
            if (array[index + 1]) {
                const nextMsg = array[index + 1];
                hideAvatar = (prevMsg.ownerId === msg.ownerId || prevMsg.ownerId !== msg.ownerId) && nextMsg.ownerId === msg.ownerId;
            }

            hideName = prevMsg.ownerId === msg.ownerId;
        } else if (array[index + 1] && index === 0) {
            const nextMsg = array[index + 1];
            hideAvatar = nextMsg.ownerId === msg.ownerId && nextMsg.ownerId === msg.ownerId;
        }

        return <Message userId={ userData.id } key={ msg.id } { ...msg } hideAvatar={ hideAvatar } hideName={ hideName } />
    }

    return <div className={`room-history${messageReply ? ' room-history-messageReply' : ''}`} ref={ historyRef } onScroll={ () => getHistoryRef(historyRef) }>
        <div className="room-history-welcome">
            <div className="room-history-welcome-avatar"><Avatar title={ title[0] } onClick={ toggleDetails }/></div>
            <div className="room-history-welcome-title">{ title }</div>
        </div>

        { getMessageList?.filter(msg => msg.roomId === roomId).sort(sortMessages).map(checkMessageOwner) }
    </div>
}

export default RoomHistory;