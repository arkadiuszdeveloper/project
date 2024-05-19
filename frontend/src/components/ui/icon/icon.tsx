import "./icon.sass";

import React from "react";

import { IconBaseProps, IconType } from "@react-icons/all-files";

const Icon: React.FunctionComponent<{
    active?: boolean;
    Icon: IconType;
    iconProps?: IconBaseProps;
    onClick: () => any;

}> = ({ Icon, onClick, iconProps, active = false }) => {
    return <div onClick={ onClick } className={`${active ? 'icon icon-active' : 'icon'}`}>
        <Icon { ...iconProps } />
    </div>;
}

export default Icon;