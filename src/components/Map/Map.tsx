import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector, useDispatch } from 'react-redux';
import {
    getAllDrawData,
    getCursor,
    getPosition,
    getResotredData,
} from '../../Redux/app/appSelectors';
import { MapDrawing } from './MapDrawing';
import { AppDispatch } from '../../Redux/store';
import {
    makeRestoreUndraw,
    makeUndraw,
} from '../../Redux/app/appSlice';
import { Mufts } from './MapItems/Mufts';
import { Polylines } from './MapItems/Polylines';

export const iconUrl1 = 'https://cdn.icon-icons.com/icons2/605/PNG/512/square-cut_icon-icons.com_56037.png';
export const Map = () => {
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const position = useSelector(getPosition);
    const dispatch: AppDispatch = useDispatch();
    const allDrawData = useSelector(getAllDrawData);
    const restoredData = useSelector(getResotredData);
    // const drag = useSelector(getDrag);
    // const cubesArr = useSelector(getCubes);
    const cursos = useSelector(getCursor);
    // const iconCube = useMemo(
    //     () =>
    //         new L.Icon({
    //             iconUrl: iconUrl1,
    //             iconSize: [30, 30],
    //         }),
    //     []
    // );
    const key = useMemo(() => position.join(','), [position]);
    // const cubes = useMemo(() => {
    //     return cubesArr.map((item, index) => (
    //         <Marker
    //             draggable={true}
    //             key={item.id}
    //             position={[item.lat, item.lng]}
    //             icon={iconCube}
    //             eventHandlers={{
    //                 contextmenu: (e) => CubeInterface.handleCubeContextMenu(e, dispatch),
    //                 click: () => CubeInterface.handleCubeOnClick(polyLines, item),
    //                 dragstart: () => CubeInterface.handleCubeDragStart(dispatch),
    //                 drag: (e) => CubeInterface.handleCubeDrag(e, dispatch, polyLines, item, index, cubesArr),
    //                 dragend: (e) => CubeInterface.handleCubeDragEnd(e, dispatch, polyLines, item, allDrawData, index),
    //                 mouseover: (e) => CubeInterface.handleCubeMouseOver(e, dispatch, item.id, drag),
    //                 mouseout: (e) => CubeInterface.handleCubeMouseEnd(e, dispatch),
    //             }}
    //         />
    //     ));
    // }, [allDrawData, cubesArr, dispatch, drag, iconCube, polyLines]);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Control') {
                setIsCtrlPressed(true);
            } else if (e.key === 'Shift') {
                setIsShiftPressed(true);
            } else if (isCtrlPressed && (e.key === 'z' || e.key === 'я') && !isShiftPressed) {
                if (allDrawData.length > 0) {
                    const item = allDrawData[allDrawData.length - 1];
                    dispatch(makeUndraw(item));
                }
            } else if (isCtrlPressed && isShiftPressed && (e.key === 'Z' || e.key === 'Я')) {
                if (restoredData.length > 0) {
                    const item = restoredData[restoredData.length - 1];
                    dispatch(makeRestoreUndraw(item));
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Control') {
                setIsCtrlPressed(false);
            } else if (e.key === 'Shift') {
                setIsShiftPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [allDrawData, dispatch, isCtrlPressed, isShiftPressed, restoredData]);

    return (
        <>
            <div>
                <MapContainer

                    key={key}
                    center={position}
                    zoom={13}
                    style={{ height: '400px', width: '100%', cursor: cursos }}

                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <>
                        <Mufts />
                        <Polylines />
                        {/* {cubes} */}
                    </>

                    <MapDrawing />
                </MapContainer>
            </div>
        </>
    );
};
