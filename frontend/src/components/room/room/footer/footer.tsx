import { useForm } from "react-hook-form";
import "./footer.sass";
import { FiSend } from "react-icons/fi";

import React, { useContext, useState } from "react";
import { RoomsContext } from "../../../../contexts/roomContext";
import { messageReplyState } from "../../../../atoms/chat";
import { useRecoilState } from "recoil";
import MsgReply from "../../../ui/reply/reply";

const RoomFooter: React.FunctionComponent<{ roomId: number }> = ({ roomId }) => {
    const [messageReply, setMessageReply] = useRecoilState(messageReplyState);

    const [inputHeight, setInputHeight] = useState(22);
    const { messageApi: { sendTextMessage, handleNewMessages } } = useContext(RoomsContext);
    const { handleSubmit, register, reset } = useForm();

    const onSubmit = async ({text}: any) => {
        if (!text) return;

        try {
            const response = await sendTextMessage(roomId, text, false);
            setMessageReply(0);
            handleNewMessages(response);
            setInputHeight(22);
            reset();
        } catch (error) {
            console.log(error)
        }
    }

    const onKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(onSubmit)();
        } else {
            setInputHeight(e.currentTarget.scrollHeight); 
        }
    }

    return <React.Fragment>        
        <div className="room-footer">
            <div className="room-footer-container">
                { messageReply ? <MsgReply /> : <React.Fragment /> }
                <form onSubmit={handleSubmit(onSubmit)} className="room-footer-form">
                    <textarea { ...register('text') } style={{ height: `${inputHeight}px` }} onKeyDown={onKeyDown} className="room-footer-form-message" placeholder="Type message here..." />
                    <span className="room-footer-form-submit" onClick={handleSubmit(onSubmit)}><FiSend /></span>
                </form>
            </div>
        </div>
    </React.Fragment>
}

export default RoomFooter;