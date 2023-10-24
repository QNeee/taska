import { useDispatch, useSelector } from 'react-redux';
import { getAddLine } from '../../Redux/app/appSelectors';
import React, { useEffect, useState } from 'react';
import { getContextMenu, getCubes, getFiberOpticsMenu, getId, getLineStart, getMufts, getPolyLines, getWardrobes } from '../../Redux/map/mapSelectors';
import { useMap } from 'react-leaflet';
import { MuftaMenu } from './MapItems/ContextMenu/MuftaMenu';
import { ICustomMarker } from '../../Mufts';
import { GeneralMenu } from './MapItems/ContextMenu/GeneralMenu';
import { PolylineMenu } from './MapItems/ContextMenu/PolylineMenu';
import { CubeMenu } from './MapItems/ContextMenu/CubeMenu';
import { ILineStart, setFiberOpticsMenu } from '../../Redux/map/mapSlice';
import { AppDispatch } from '../../Redux/store';
import { MakeLineModal } from '../Modal/MakeLineModal';
import { FiberMenu } from './MapItems/ContextMenu/FiberMenu';
import { WardrobeMenu } from './MapItems/ContextMenu/WardrobeMenu';

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
    const fiberCountsMenu = useSelector(getFiberOpticsMenu);
    const muftsArr = useSelector(getMufts);
    const wardrobes = useSelector(getWardrobes);
    const contextMenu = useSelector(getContextMenu);
    const dispatch: AppDispatch = useDispatch();
    const item = muftsArr.find(item => item.id === id) || wardrobes.find(item => item.id === id);
    const [form, setForm] = useState({ lat: 0, lng: 0 });
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
    const onCloseFiberCountsMenu = () => {
        dispatch(setFiberOpticsMenu(false));
    }
    const obj = {
        x: left,
        y: top
    }
    if (contextMenu.muft) {
        return <MuftaMenu left={obj.x} top={obj.y} addLine={addLine} form={form}
            handleInputChange={handleInputChange} muftsArr={muftsArr}
            id={id} polyLinesArr={polyLinesArr} wardrobesArr={wardrobes}
            cubesArr={cubesArr} item={item as ICustomMarker} setFiberOpticsMenu={setFiberOpticsMenu}
        />
    } else if (contextMenu.general) {
        return (
            <GeneralMenu left={obj.x} top={obj.y} map={map} contextMenu={contextMenu} />
        );
    } else if (contextMenu.poly) {
        return <PolylineMenu top={obj.y} left={obj.x}

        />
    } else if (contextMenu.cube) {
        return <CubeMenu left={obj.x} top={obj.y} contextMenu={contextMenu} id={id} cubesArr={cubesArr} muftsArr={muftsArr} polyLinesArr={polyLinesArr} wardrobesArr={wardrobes} />
    } else if (fiberCountsMenu) {
        return <MakeLineModal muftsArr={muftsArr} wardrobesArr={wardrobes} item={item} lineStart={lineStart as ILineStart}
            onClose={onCloseFiberCountsMenu}
        />
    } else if (contextMenu.fiber) {
        return <FiberMenu left={obj.x} top={obj.y} map={map} contextMenu={contextMenu} />
    } else if (contextMenu.wardrobes) {
        return <WardrobeMenu left={obj.x} top={obj.y} addLine={addLine} form={form}
            handleInputChange={handleInputChange}
            id={id} wardrobesArr={wardrobes}
            item={item as ICustomMarker} setFiberOpticsMenu={setFiberOpticsMenu} polyLinesArr={polyLinesArr} muftsArr={muftsArr} cubesArr={cubesArr} />;
    }
    return null;
};

export default ContextMenu;