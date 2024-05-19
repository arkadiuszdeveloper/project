import Avatar from '../ui/avatar/avatar';
import Markdown from 'react-markdown';
import './message.sass';

import React, { useContext, useEffect, useState } from 'react';
import { RoomsContext } from '../../contexts/roomContext';
import { ApiContext } from '../../contexts/apiContext';
import { useRecoilState, useRecoilValue } from 'recoil';
import { chatLayoutState, messageReplyState } from '../../atoms/chat';
import Preview from '../ui/preview/preview';

import { FaReply } from "react-icons/fa";
import { LuSmilePlus } from "react-icons/lu";
import { IoTrashSharp } from "react-icons/io5";
import { FaArrowRotateRight } from "react-icons/fa6";
import { TiArrowBack } from "react-icons/ti";
import { useVisibilityObserver } from '../../hooks/useObserver';


const Message: React.FunctionComponent<TMessage & { userId: number, hideAvatar: boolean, hideName: boolean }> = (messageProps): JSX.Element => {
    const { id, userId, ownerId, crypted, payload, viewedIds, hideAvatar, hideName, replied_to_message_id } = messageProps;

    const { ref, isVisible } = useVisibilityObserver(true);

    const chatLayout = useRecoilValue(chatLayoutState);

    const [user, setUser] = useState<TUser>();
    const { messageApi: { seenMessage, getMessage } } = useContext(RoomsContext);
    const { getUserById } = useContext(ApiContext);

    const [messageReply, setMessageReply] = useRecoilState(messageReplyState);
    const [repliedMessage, setRepliedMessage] = useState<TMessage>();

    const messageOwnerIn = `${user?.firstName[0]}${user?.lastName[0]}`
    const messageOwnerName = `${user?.firstName} ${user?.lastName} `

    useEffect(() => {
        const fetchUserData = async () => {
            setUser(await getUserById(ownerId));
            if (replied_to_message_id) {
                const msg = await getMessage(replied_to_message_id);
                setRepliedMessage(msg);
            }
        }
        fetchUserData();
        if (!viewedIds.includes(userId)) {
            seenMessage(id);
        }
    }, []);

    const getMessageDateTime = (date: Date) => {
        const d = new Date(date);

        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const findFirstURL = (text: string): string[] | undefined => {
        const urlRegex = /https?:\/\/[^\s]+/g;
        const urls = text.match(urlRegex);
        if (urls && urls.length > 0) {
            return urls;
        }
    }

    const toggleReply = () => setMessageReply(messageReply === id ? 0 : id);
    const highlightReply = messageReply === id;

    const getRepliedMessageContent = ({ crypted, payload }: TMessage) => {
        if (!crypted) {
            switch (payload.type) {
                case 'text':
                    const { message } = payload;
                    const url = findFirstURL(message);

                    return <div className='message-content-main message-reply'>
                        <Markdown className='message-content-text markdown-body'>{ message }</Markdown>
                        { url ? <Preview url={ url } /> : <React.Fragment />}
                    </div>

                case 'vote':
                    const { votes } = payload;
                    return <React.Fragment>
                        <div className='message-content-text'>{ JSON.stringify(votes) }</div>
                    </React.Fragment>

                default:
                    return <React.Fragment />;
            }
        }
    }

    const getMessageContent = ({ crypted, payload, lastEditDateTime }: TMessage) => {
        if (!crypted) {
            switch (payload.type) {
                case 'text':
                    const { message } = payload;
                    const url = findFirstURL(message);

                    return <div className='message-content-main-container'>
                        { repliedMessage ? getRepliedMessageContent(repliedMessage) : <React.Fragment /> }
                        <div className='message-content-main'>
                            <Markdown className='message-content-text markdown-body'>{ message }</Markdown>
                            { url ? <Preview url={ url } /> : <React.Fragment />}
                            <span className='message-content-time'>{ getMessageDateTime(lastEditDateTime) }</span>
                        </div>
                    </div>

                case 'vote':
                    const { votes } = payload;
                    return <React.Fragment>
                        <div className='message-content-text'>{ JSON.stringify(votes) }</div>
                    </React.Fragment>

                default:
                    return <React.Fragment />;
            }
        }
    }

    return <div className={`message message-layout-${chatLayout}${highlightReply ? ' message-replyHighlight' : ''}${hideAvatar ? ' message-hideAvatar' : ''}${hideName ? ' message-hideName' : ''}${ownerId === userId ? ' message-owner' : ''}${isVisible ? '' : ' hide'}`}>
        <div className='message-container' ref={ ref }>
            <div className='message-avatar'><Avatar userId={ user?.id || 0 } title={ messageOwnerIn } /></div>
            <div className='message-content'>
                { (chatLayout === 'default' && ownerId !== userId) || chatLayout !== 'default' ? <div className='message-content-name'>{ messageOwnerName }</div> : <React.Fragment /> }
                <div className='message-contentFlex' style={{ display: 'flex' }}>
                    { getMessageContent(messageProps) }
                    <div className='message-options'>
                        <span className='message-options-item' onClick={toggleReply}><TiArrowBack /></span>
                        <span className='message-options-item'><LuSmilePlus /></span>
                        <span className='message-options-item'><IoTrashSharp /></span>
                        <span className='message-options-item'><FaArrowRotateRight /></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Message;
