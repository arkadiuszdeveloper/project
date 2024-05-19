import './home.sass';

import React, { useContext } from 'react';

import { LuLogOut } from "react-icons/lu";
import { IoSettingsSharp, IoChatbubbleSharp  } from "react-icons/io5";
import { MdCreate } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

import Icon from '../ui/icon/icon';
import Sidebar from '../ui/sidebar/sidebar';
import { ApiContext } from '../../contexts/apiContext';
import { useRecoilState, useRecoilValue } from 'recoil';
import {  homeModeState, homeRoomListModalState, homeSettingsModalState } from '../../atoms/home';
import Modal from '../ui/modal/modal';
import RoomListComponent from '../room/roomList/roomList';
import { navigate } from 'gatsby';
import Chat from '../chat/chat';
import CreateRoomComponent from '../createRoom/createRoom';
import MyAccount from '../myAccount/myAccount';

const iconSize = 20;

const Home: React.FunctionComponent<{ roomId?: number, createRoomMode?: boolean }> = ({ roomId = 0, createRoomMode = false }): JSX.Element => {
    const { logout, userData } = useContext(ApiContext);

    const roomList = useRecoilValue(homeRoomListModalState);
    const roomData = roomList.find(room => room.id === roomId);

    const [sidebarMode, setSidebarMode] = useRecoilState(homeModeState);
    const toggleSettingsModal = useRecoilState(homeSettingsModalState);

    const showSettingsModal = () => toggleSettingsModal[1](true);

    const setModeFriends = () => {
        if (sidebarMode === 'friends') return;
        setSidebarMode('friends');
    }

    const setModeGroups = () => {
        if (sidebarMode === 'groups') return;
        setSidebarMode('groups');
    }

    const createNewRoom = () => navigate('/new');

    const getModeSidebar = () => {
        switch (sidebarMode) {
            case 'friends':
                return <React.Fragment>
                    <div className='sidebar-header'>
                        <span className='sidebar-header-title'>Friends</span>
                        <span className='sidebar-header-btn'>
                            <Icon Icon={ MdCreate } onClick={createNewRoom} iconProps={{ size: 20 }} />
                        </span>
                    </div>
                    <div className='sidebar-container'>
                        <RoomListComponent roomId={ roomId } mode={ sidebarMode } />
                    </div>
                </React.Fragment>

            case 'groups':
                return <React.Fragment>
                    <div className='sidebar-header'>
                        <span className='sidebar-header-title'>Groups</span>
                        <span className='sidebar-header-btn'>
                            <Icon Icon={ MdCreate } onClick={createNewRoom} iconProps={{ size: 20 }} />
                        </span>
                    </div>
                    <div className='sidebar-container'>
                        <RoomListComponent roomId={ roomId } mode={ sidebarMode } />
                    </div>
                </React.Fragment>

            default:
                break;
        }
    }

    return <div className='home'>
        <div className='home-container'>
            <Sidebar size='small' gap={ 5 } down={ true }>
                <React.Fragment>
                    <div className='sidebar-container'></div>
                    <div className='sidebar-item'>
                        <Icon Icon={ FaUserFriends } active={ sidebarMode === 'groups' } onClick={ setModeGroups } iconProps={{ size: iconSize }} />
                    </div>
                    <div className='sidebar-item'>
                        <Icon Icon={ IoChatbubbleSharp } active={ sidebarMode === 'friends' } onClick={ setModeFriends } iconProps={{ size: iconSize }} />
                    </div>
                    <div className='sidebar-item'>
                        <Modal title='My Account' toggle={ toggleSettingsModal }><MyAccount userId={ userData.id } /></Modal>
                        <Icon Icon={ MdAccountCircle } onClick={ showSettingsModal } iconProps={{ size: iconSize }} />
                    </div>
                    <div className='sidebar-item'>
                        <Icon Icon={ LuLogOut } onClick={ logout } iconProps={{ size: iconSize }} />
                    </div>
                </React.Fragment>
            </Sidebar>

            <Sidebar size='big'>
                <React.Fragment>{ getModeSidebar() }</React.Fragment>
            </Sidebar>

            { createRoomMode ? <CreateRoomComponent /> : ( roomData ? <Chat { ...roomData } /> : <React.Fragment /> ) }
        </div>
    </div>
}

export default Home;
