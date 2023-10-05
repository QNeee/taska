import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector, useDispatch } from 'react-redux';
import {
    getAllDrawData,
    getCubes,
    getCursor,
    getDrag,
    getDrawArrCircles,
    getItemId,
    getPolyLines,
    getPosition,
    getResotredData,
    getShowOnwerLines,
} from '../../Redux/app/appSelectors';
import { MapDrawing } from './MapDrawing';
import L from 'leaflet';
import { AppDispatch } from '../../Redux/store';
import {
    makeRestoreUndraw,
    makeUndraw,
} from '../../Redux/app/appSlice';
import { MarkerInterface } from '../../interface/MarkerInterface';
import { PolylineInterface } from '../../interface/PolylineInterface';
import { CubeInterface } from '../../interface/CubeInterface';

const iconUrl =
    'https://c0.klipartz.com/pngpicture/720/285/gratis-png-punto-rojo-redondo-bandera-de-japon-bandera-de-japon-s-thumbnail.png';
export const iconUrl1 = 'https://cdn.icon-icons.com/icons2/605/PNG/512/square-cut_icon-icons.com_56037.png';
export const Map = () => {
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const position = useSelector(getPosition);
    const drawingCircle = useSelector(getDrawArrCircles);
    const id = useSelector(getItemId);
    const dispatch: AppDispatch = useDispatch();
    const allDrawData = useSelector(getAllDrawData);
    const restoredData = useSelector(getResotredData);
    const drag = useSelector(getDrag);
    const cubesArr = useSelector(getCubes);
    const cursos = useSelector(getCursor);
    const redIcon = useMemo(
        () =>
            new L.Icon({
                iconUrl: iconUrl,
                iconSize: [30, 30],
            }),
        []
    );
    const iconCube = useMemo(
        () =>
            new L.Icon({
                iconUrl: iconUrl1,
                iconSize: [30, 30],
            }),
        []
    );
    const polyLines = useSelector(getPolyLines);
    const showOwnerLines = useSelector(getShowOnwerLines);
    const key = useMemo(() => position.join(','), [position]);
    const markers = useMemo(() => {
        return drawingCircle.map((item, index) => (
            <Marker
                draggable={true}
                key={item.id}
                position={[item.lat, item.lng]}
                icon={redIcon}
                eventHandlers={{
                    mouseover: (e) => MarkerInterface.handleMouseOver(item.id, dispatch, drag, showOwnerLines),
                    mouseout: () => MarkerInterface.handleMouseOut(dispatch),
                    dragstart: (e) => MarkerInterface.handleDragStart(dispatch),
                    drag: (e) => MarkerInterface.handleMarkerDrag(e, dispatch, polyLines, item, index),
                    dragend: (e) => MarkerInterface.handleMarkerDragEnd(e, dispatch, polyLines, item, allDrawData, index),
                    contextmenu: (e) => MarkerInterface.handleContextMenuHandler(e, dispatch)
                }}
            />
        ));
    }, [drawingCircle, redIcon, drag, showOwnerLines, dispatch, polyLines, allDrawData]);
    const polylineElements = useMemo(() => {
        if (polyLines.length > 0) {
            return polyLines.map((item, index) => (
                <Polyline
                    positions={[
                        [item.start?.lat as number, item.start?.lng as number],
                        [item.end?.lat as number, item.end?.lng as number]
                    ]}
                    key={item.id}
                    pathOptions={{ color: showOwnerLines && item.owner === id ? 'green' : 'red', weight: item.weight ? item.weight : 4 }}
                    eventHandlers={{
                        click: (e) => PolylineInterface.handleOnClickPolyline(e, dispatch),
                        mouseover: (e) => PolylineInterface.handleMouseOverPolyline(e, dispatch, item, drag, index),
                        mouseout: (e) => PolylineInterface.handleMouseOutPolyline(e, dispatch, item, index),
                        contextmenu: (e) => PolylineInterface.handleContextMenuPolyline(e, dispatch),
                    }}
                />
            ));

        }
    }, [dispatch, drag, id, polyLines, showOwnerLines]);
    const cubes = useMemo(() => {
        return cubesArr.map((item, index) => (
            <Marker
                draggable={true}
                key={item.id}
                position={[item.lat, item.lng]}
                icon={iconCube}
                eventHandlers={{
                    contextmenu: (e) => CubeInterface.handleCubeContextMenu(e, dispatch),
                    click: () => CubeInterface.handleCubeOnClick(polyLines, item),
                    dragstart: () => CubeInterface.handleCubeDragStart(dispatch),
                    drag: (e) => CubeInterface.handleCubeDrag(e, dispatch, polyLines, item, index, cubesArr),
                    dragend: (e) => CubeInterface.handleCubeDragEnd(e, dispatch, polyLines, item, allDrawData, index),
                    mouseover: (e) => CubeInterface.handleCubeMouseOver(e, dispatch, item.id, drag),
                    mouseout: (e) => CubeInterface.handleCubeMouseEnd(e, dispatch),
                }}
            />
        ));
    }, [allDrawData, cubesArr, dispatch, drag, iconCube, polyLines]);
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
                    {drawingCircle.length > 0 ? (
                        <>
                            {markers}
                            {polylineElements}
                            {cubes}
                        </>
                    ) : null}
                    <MapDrawing />
                </MapContainer>
            </div>
        </>
    );
};
