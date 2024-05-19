import { useRecoilState } from "recoil";
import { homeToggleDetailsState } from "../../../atoms/home";
import Avatar from "../../ui/avatar/avatar";
import "./roomDetails.sass";

import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../ui/sidebar/sidebar";
import XIcon from "../../ui/x/x";
import { FaAlignLeft } from "react-icons/fa6";
import { FaAlignRight } from "react-icons/fa6";
import Icon from "../../ui/icon/icon";
import { chatLayoutState, showCustomiseDetailsState, showMemberDetailsState } from "../../../atoms/chat";
import RoomAccordion from "../roomAccordion/roomAccordion";
import { ApiContext } from "../../../contexts/apiContext";
import { SlOptionsVertical } from "react-icons/sl";

const RoomDetails: React.FunctionComponent<TRoom> = ({ id, name, adminIds, relatedIds }) => {
    const { findMoreUser } = useContext(ApiContext);
    const [members, setMembers] = useState<TUser[]>();

    const [showDetails, setDetails] = useRecoilState(homeToggleDetailsState);
    const [chatLayout, setChatLayout] = useRecoilState(chatLayoutState);

    const [showCustomiseDetails, setCustomiseDetails] = useRecoilState(showCustomiseDetailsState);
    const [showMemberDetails, setMemberDetails] = useRecoilState(showMemberDetailsState);

    const toggleCustomiseDetails = () => setCustomiseDetails(t => !t);
    const toggleMemberDetails = () => setMemberDetails(t => !t);

    const leftChatLayout = () => setChatLayout('allLeft');
    const defaultChatLayout = () => setChatLayout('default');

    const hideDetails = () => setDetails(false);

    const sortMembersByRole = (userA: TUser, userB: TUser) => {
        const isAdminA = adminIds.includes(userA.id);
        const isAdminB = adminIds.includes(userB.id);
    
        if (isAdminA && isAdminB) {
            if (userA.firstName === userB.firstName)
                return userA.lastName.localeCompare(userB.lastName);

            return userA.firstName.localeCompare(userB.firstName);

        } else if (isAdminA) {
            return -1;

        } else if (isAdminB) {
            return 1;

        }

        return 0;
    }
    

    const getMemberList = (members: TUser[]) => {
        return <div className="room-details-members">
            { members.sort(sortMembersByRole).map(member => <div key={ member.id } className="room-details-members-item">
                <div className="room-details-members-item-name">
                    <span className="room-details-members-item-avatar"><Avatar userId={ member.id } title={ member.firstName[0] } /></span>
                    { member.firstName } { member.lastName }
                </div>
                <div className="room-details-members-item-options">
                    { adminIds.includes(member.id) ? <span className="room-details-members-item-role">admin</span> : <span></span> }
                    <span className="room-details-members-item-settings">
                        <SlOptionsVertical />
                    </span>
                </div>
            </div>) }
        </div>
    }

    useEffect(() => {
        const fetch = async () => {
            const respose = await findMoreUser(relatedIds);
            setMembers(respose);
        }
        fetch();
    }, [showMemberDetails, id])

    if (!showDetails) {
        return <React.Fragment />
    }

    return <Sidebar size='medium'>
        <div className="room-details">
            <div className="room-details-header">
                <XIcon onClick={ hideDetails } />
            </div>
            <div className="room-details-avatar"><Avatar title={ name[0] } roomId={ id } /></div>
            <div className="room-details-title">{ name }</div>

            <RoomAccordion title="Customise chat" flexCenter toggle={ toggleCustomiseDetails } isOpen={ showCustomiseDetails } >
                <span className="room-details-options-item">
                    <Icon Icon={ FaAlignLeft } onClick={ leftChatLayout } active={ chatLayout === 'allLeft'} />
                </span>
                <span className="room-details-options-item">
                    <Icon Icon={ FaAlignRight } onClick={ defaultChatLayout } active={ chatLayout === 'default'} />
                </span>
            </RoomAccordion>

            <RoomAccordion title="Members" flexCenter={ false } toggle={ toggleMemberDetails } isOpen={ showMemberDetails }>
                { members ? getMemberList(members) : <React.Fragment /> }
            </RoomAccordion>
        </div>
    </Sidebar>
}

export default RoomDetails;
