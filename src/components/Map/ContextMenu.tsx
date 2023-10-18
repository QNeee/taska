import { useSelector } from 'react-redux';
import { getAddLine } from '../../Redux/app/appSelectors';
import React, { useEffect, useState } from 'react';
import { getContextMenu, getCubes, getId, getLineStart, getMufts, getPolyLines, getWardrobes } from '../../Redux/map/mapSelectors';
import { useMap } from 'react-leaflet';
import { ILineStart } from '../../Redux/map/mapSlice';
import { MuftaMenu } from './MapItems/ContextMenu/MuftaMenu';
import { ICustomMarker } from '../../Mufts';
import { GeneralMenu } from './MapItems/ContextMenu/GeneralMenu';
import { PolylineMenu } from './MapItems/ContextMenu/PolylineMenu';
import { CubeMenu } from './MapItems/ContextMenu/CubeMenu';

interface Iprops {
    left: number,
    top: number,
}
export interface ICoords {
    lat: number,
    lng: number,
}


const ContextMenu = ({ left, top }: Iprops) => {
    const map = useMap();
    const polyLinesArr = useSelector(getPolyLines);
    const id = useSelector(getId);
    const addLine = useSelector(getAddLine);
    const cubesArr = useSelector(getCubes);
    const lineStart = useSelector(getLineStart);
    const muftsArr = useSelector(getMufts);
    const [isChangeHovered, setIsChangeHovered] = useState(false);
    const wardrobes = useSelector(getWardrobes);
    const contextMenu = useSelector(getContextMenu);
    const item = muftsArr.find(item => item.id === id) || wardrobes.find(item => item.id === id);
    const [form, setForm] = useState({ lat: 0, lng: 0 });
    const handleMouseEnterChange = () => {
        setIsChangeHovered(true);
    };
    useEffect(() => {
        if (id)
            setForm({ lat: item?.getLatLng().lat as number, lng: item?.getLatLng().lng as number })
    }, [id, item])
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setForm(prev => ({
            ...prev,
            [id]: value
        }))
    }
    const handleMouseLeaveChange = () => {
        setIsChangeHovered(false);
    };
    const obj = {
        x: left,
        y: top
    }
    if (contextMenu.muft) {
        return <MuftaMenu left={obj.x} top={obj.y} addLine={addLine} form={form}
            handleInputChange={handleInputChange} muftsArr={muftsArr}
            id={id} lineStart={lineStart as ILineStart} polyLinesArr={polyLinesArr}
            cubesArr={cubesArr} item={item as ICustomMarker}
        />
    } else if (contextMenu.general) {
        return (
            <GeneralMenu left={obj.x} top={obj.y} map={map} contextMenu={contextMenu} />
        );
    } else if (contextMenu.poly) {
        return <PolylineMenu top={obj.y} left={obj.x} isChangeHovered={isChangeHovered}
            handleMouseEnterChange={handleMouseEnterChange} handleMouseLeaveChange={handleMouseLeaveChange}
        />
    } else if (contextMenu.cube) {
        return <CubeMenu left={obj.x} top={obj.y} contextMenu={contextMenu} />
    }
    return null;
};

export default ContextMenu;