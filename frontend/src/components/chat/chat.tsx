import React, { useContext } from 'react';

import Room from '../room/room/room';
import RoomDetails from '../room/roomDetails/roomDetails';
import { RoomsContext } from '../../contexts/roomContext';

const Chat: React.FunctionComponent<TRoom> = (roomData): JSX.Element => {
    const { messageApi: { getMessages, setMessageList } } = useContext(RoomsContext);

    React.useEffect(() => {
        const fetchHistory = async () => {
            const result = await getMessages(roomData.id, 0);
            setMessageList(result);
            console.log('loading messages')
        }
        if (!roomData.readonly)
            fetchHistory();
    }, [roomData]);

    return <React.Fragment>
        <Room { ...roomData } />
        <RoomDetails { ...roomData } />
    </React.Fragment>
}

export default Chat;
