import './sidebar.sass';

import React from 'react';

type TSidebarSize = 'small' | 'medium' | 'big';

const Sidebar: React.FunctionComponent<{
    size: TSidebarSize;
    children: JSX.Element;
    gap?: number;
    down?: boolean;

}> = ({ size, children, gap = 0, down = false }): JSX.Element => {
    return <div className={`sidebar ${size} ${down ? 'down' : ''}`} style={{
        gap: `${gap}px`,
        padding: `${gap}px`
    }}>
        { children }
    </div>
}

export default Sidebar;
