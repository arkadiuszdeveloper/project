import "./createRoom.sass";

import React, { useContext, useEffect, useId, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { RoomsContext } from "../../contexts/roomContext";
import UserDetails from "./userDetails/userDetails";
import { ApiContext } from "../../contexts/apiContext";

import { CiRead } from "react-icons/ci";
import { CiUnread } from "react-icons/ci";
import { RiChatNewLine } from "react-icons/ri";

import { navigate } from "gatsby";
import { useRecoilState, useRecoilValue } from "recoil";
import { homeModeState } from "../../atoms/home";
import Icon from "../ui/icon/icon";
import { userDataState } from "../../atoms/auth";

const CreateRoomComponent: React.FunctionComponent = () => {
    const userData = useRecoilValue(userDataState);
    const [, setSidebarMode] = useRecoilState(homeModeState);

    const [relatedIds, setSelectedUsers] = useState<TUser[]>([]);
    const [userList, setUserList] = useState<TUser[]>([]);

    const [readonly, setReadonly] = useState(false);

    const { roomApi: { createRoom, room } } = useContext(RoomsContext);
    const { appendUsers, getUsersByName } = useContext(ApiContext);

    const id = useId();
    const methods = useForm();

    const { handleSubmit, watch } = methods;
    const searchTerm = watch('friendData') || '';
    const onSubmit = async () => {
        // if (!relatedIds.length) return null;

        const response = await createRoom({relatedIds: relatedIds.map(u => u.id), readonly});
        if (response.id) {
            room.append(response);
            navigate('/' + response.id);
        }
        if (relatedIds.length > 2)
            setSidebarMode('groups');
        else
            setSidebarMode('friends');
    };

    const filterList = (user: TUser) => {
        const { firstName, lastName } = user;

        const fn = firstName.toLowerCase();
        const ln = lastName.toLowerCase();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        if (user.id === userData.id)
            return false;

        if (relatedIds.includes(user))
            return false;

        return fn.includes(lowerCaseSearchTerm) || ln.includes(lowerCaseSearchTerm);
    }

    const onSearchUserByName = async (name: string) => {
        const response = await getUsersByName(name);

        if (response) {
            appendUsers(response);
            setUserList(response);
        }
    }

    const removeUser = (user: TUser) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    } 

    const selectUser = (user: TUser) => {
        if (!relatedIds.includes(user))
            setSelectedUsers(prev => [...prev, user])
    }

    useEffect(() => {}, [userList]);

    return <div className="room-create">
        <div className="room-create-header">
            <label htmlFor={`friendData-${id}`} className="room-create-title">Create room</label>
            <div className="room-create-options">
                <span className="room-create-submit" onClick={() => setReadonly(r => !r)}>
                    { readonly ?
                        <Icon Icon={ CiUnread } onClick={() => {}} />
                        :
                        <Icon Icon={ CiRead } onClick={() => {}} />
                    }
                </span>
                <span className="room-create-submit">
                    <Icon Icon={ RiChatNewLine } onClick={() => handleSubmit(onSubmit)()} />
                </span>
            </div>
        </div>
        <div className="room-create-form-container">
            { relatedIds?.map(user => <UserDetails key={ user.id } { ...user } onClick={ () => removeUser(user) } remove={ true } />) }
            <FormProvider { ...methods }>
                <form onSubmit={handleSubmit(onSubmit)} className="room-create-form">
                    <div className="auth-form-field">
                        <input type="text" onInput={(e) => onSearchUserByName(e.currentTarget.value)} id={`friendData-${id}`} className="room-create-form-input" placeholder="First name or surname" />
                    </div>
                </form>
            </FormProvider>
        </div>
        <div className="room-create-users">
            { userList.filter(filterList).map(user => <UserDetails key={ user.id } { ...user } onClick={() => selectUser(user)} remove={ false } />) }
        </div>
    </div>
}

export default CreateRoomComponent;