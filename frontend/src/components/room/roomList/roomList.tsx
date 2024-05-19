import React, { useContext, useEffect } from "react";
import { RoomsContext } from "../../../contexts/roomContext";
import { navigate } from "gatsby";
import RoomListItem from "../roomListItem/roomListItem";

const RoomListComponent: React.FunctionComponent<{ roomId: number, mode: THomeMode }> = ({ roomId, mode }) => {
    const { roomApi: { room, findRoom } } = useContext(RoomsContext);
    const roomList = room.get();

    const fetchOne = async (roomId: number) => {
        const response = await findRoom(roomId);
        if (response.id) {
            navigate(`/${response.id}`);
        }
    }

    useEffect(() => {}, [roomList]);

    const filterRooms = (room: TRoom) => {
        const isGroup = room.relatedIds.length > 2;
        return (mode === 'groups' && isGroup) || (mode === 'friends' && !isGroup) ? room : null;
    };

    const sortRooms = (roomA: TRoom, roomB: TRoom) => {
        const a = Number(new Date(roomA.lastMessage?.lastEditDateTime || roomA.lastActiveDateTime || 0));
        const b = Number(new Date(roomB.lastMessage?.lastEditDateTime || roomB.lastActiveDateTime || 0));

        return b-a;
    }

    return <React.Fragment>
        { roomList.length ? roomList.filter(filterRooms).sort(sortRooms).map(room => <RoomListItem key={ room.id } roomId={ roomId } { ...room } onClick={() => fetchOne(room.id)} />) : <React.Fragment /> }
    </React.Fragment>
}

export default RoomListComponent;
