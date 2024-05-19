import { useRecoilState } from 'recoil';
import { messageReplyState } from '../../../atoms/chat';
import { RoomsContext } from '../../../contexts/roomContext';
import './reply.sass';


import { CiCircleRemove } from "react-icons/ci";


import React, { useContext, useEffect, useState } from "react";
import { ApiContext } from '../../../contexts/apiContext';

const MsgReply: React.FunctionComponent = () => {
    const [user, setUser] = useState<TUser>();
    const [messageReplyId, setMessageReply] = useRecoilState(messageReplyState);
    const { messageApi: { getMessageList } } = useContext(RoomsContext);
    const { getUserById } = useContext(ApiContext);

    const stopReplying = () => setMessageReply(0);

    const message = getMessageList.find(msg => msg.id === messageReplyId);
    

    useEffect(() => {
        const fetchUserData = async ({ ownerId }: TMessage) => {
            setUser(await getUserById(ownerId));
        }

        if (message)
            fetchUserData(message);
    }, []);

    if (!message || message.crypted) {
        return <React.Fragment />
    }

    switch (message.payload.type) {
        case 'text':
            return <div className="room-reply">
                <span className="room-reply-title">Replying to { user?.firstName } { user?.lastName }</span>
                <span className='room-reply-remove' onClick={ stopReplying } ><CiCircleRemove /></span>
            </div> 
    
        default:
            break;
    }

    return <div className="room-reply">
        Replying to ...
    </div>
}

export default MsgReply;
