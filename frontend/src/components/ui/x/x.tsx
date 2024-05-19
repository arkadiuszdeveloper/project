import './x.sass';

import React from 'react';

const XIcon: React.FunctionComponent<{
    onClick?: () => void;

}> = ({ onClick }): JSX.Element => {
    return <span className="xicon" onClick={ onClick }>
        <span></span>
        <span></span>
    </span>
}

export default XIcon;
