import { ApiContext } from '../../../contexts/apiContext';
import { RoomsContext } from '../../../contexts/roomContext';
import './avatar.sass';

import React, { useContext, useEffect, useState } from 'react';

type TAvatarType = 'one' | 'multi';

const Avatar: React.FunctionComponent<{
    title: string;
    type?: TAvatarType;
    onClick?: () => void;
    userId?: number;
    roomId?: number;

}> = ({ title, onClick, type = 'one', userId = 0, roomId = 0 }): JSX.Element => {
    const { getUserById, userList, userData } = useContext(ApiContext);
    const { roomApi: { findRoom } } = useContext(RoomsContext);

    const [room, setRoom] = useState<TRoom>();
    const [user, setUser] = useState<TUser>();
    const [activeStatus, setActiveStatus] = useState(false);

    const checkTime = (user: TUser) => {
        if (userData?.id === userId) {
            return setActiveStatus(true);
        }

        const lastActiveTime = new Date(user.lastActiveDateTime).getTime();
        const now = Date.now();

        setActiveStatus(now - lastActiveTime < 60000);
    }

    useEffect(() => {
        const fetchUserData = async (userId: number) => {
            const userData = await getUserById(userId);
            if (!userData) return;

            setUser(userData);
            checkTime(userData);
        }

        const fetchRoomData = async (roomId: number) => {
            const roomData = await findRoom(roomId);
            if (!roomData) return;

            setRoom(roomData);
        }

        if (userId)
            fetchUserData(userId);

        if (roomId)
            fetchRoomData(roomId);

    }, [user, userList, getUserById, userId, roomId]);

    const getAvatar = (avatarBase64: string) => {
        return <span className='avatar-image' style={{
            background: `url(${avatarBase64}) center center`,
            backgroundSize: 'cover'
        }} />
    }

    return <div className={`avatar avatar-type_${type}${activeStatus ? ' avatar-activeStatus' : ''}`} onClick={ onClick } style={{ cursor: `${onClick ? 'pointer' : 'default'}` }}>
        { user?.avatarBase64 ? getAvatar(user.avatarBase64) : ( room?.avatarBase64 ? getAvatar(room.avatarBase64) : title ) }
    </div>
}

export default Avatar;
