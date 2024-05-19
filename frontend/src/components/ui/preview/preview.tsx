import './preview.sass';

import React, { useContext, useEffect, useState } from "react";
import { RoomsContext } from "../../../contexts/roomContext";

const defaultUrlId = 0;

const Preview: React.FunctionComponent<{ url: string[] }> = ({ url }) => {
    const { sharedApi: { getLinkPreview } } = useContext(RoomsContext);

    const [preview, setPreview] = useState<TPreview>();

    useEffect(() => {
        const fetchPreview = async () => {
            setPreview(await getLinkPreview(url[defaultUrlId]));
        }
        fetchPreview();
    }, [])

    if (!preview) {
        return <React.Fragment />
    }

    return <div className="preview">
        <div className='preview-title'><a href={ url[defaultUrlId] } target='_blank'>{ preview.title }</a></div>
        <div className='preview-description'>{ preview.description }</div>
        <div className='preview-image'>
            <a href={ url[defaultUrlId] } target='_blank'><img src={ preview.image } alt={ preview.title } /></a>
        </div>
    </div>
}

export default Preview;