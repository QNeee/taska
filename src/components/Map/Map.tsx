import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector, useDispatch } from 'react-redux';
import {
    getAllDrawData,
    getDrag,
    getDrawArrCircles,
    getGeneralId,
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
    setCircleMenu,
    setId,
    setShowOwnerLines,
} from '../../Redux/app/appSlice';
import { MapInterface } from '../../interface/MapInterface';

const iconUrl =
    'https://c0.klipartz.com/pngpicture/720/285/gratis-png-punto-rojo-redondo-bandera-de-japon-bandera-de-japon-s-thumbnail.png';

export const Map = () => {
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const position = useSelector(getPosition);
    const drawingCircle = useSelector(getDrawArrCircles);
    const id = useSelector(getGeneralId);
    const dispatch: AppDispatch = useDispatch();
    const allDrawData = useSelector(getAllDrawData);
    const restoredData = useSelector(getResotredData);
    const drag = useSelector(getDrag);

    const redIcon = useMemo(
        () =>
            new L.Icon({
                iconUrl: iconUrl,
                iconSize: [30, 30],
            }),
        []
    );

    const polyLines = useSelector(getPolyLines);
    const showOwnerLines = useSelector(getShowOnwerLines);
    const key = useMemo(() => position.join(','), [position]);
    // const handleDragStart = useCallback(() => {
    //     dispatch(setDrag(true));
    // }, [dispatch]);
    // const handleMarkerDrag = useCallback(
    //     (e: L.LeafletEvent) => {
    //         const lat = e.target.getLatLng().lat;
    //         const lng = e.target.getLatLng().lng;
    //         const indexCircle = drawingCircle.findIndex(item => item.id === id);
    //         if (indexCircle !== -1) {
    //             const newArr = [...polyLines];
    //             newArr.forEach((line, index) => {
    //                 if (line.owner === id) {
    //                     newArr[index] = {
    //                         ...line,
    //                         start: { lat, lng }
    //                     };
    //                 } else if (line.to === id) {
    //                     newArr[index] = {
    //                         ...line,
    //                         end: { lat, lng }
    //                     };
    //                 }
    //             });

    //             const obj1 = {
    //                 ...drawingCircle[indexCircle],
    //                 lat,
    //                 lng
    //             };

    //             dispatch(updatePoly({ indexCircle, newArr, obj1 }));
    //         }
    //     },
    //     [drawingCircle, id, polyLines, dispatch]
    // );
    // const handleMarkerDragEnd = useCallback(
    //     (e: L.LeafletEvent) => {
    //         const lat = e.target.getLatLng().lat;
    //         const lng = e.target.getLatLng().lng;
    //         const indexCircle = drawingCircle.findIndex(item => item.id === id);
    //         let newArr;
    //         let indexAllDataCircle = null;
    //         if (indexCircle !== -1) {
    //             const obj = {
    //                 ...drawingCircle[indexCircle],
    //                 lat,
    //                 lng
    //             };
    //             if (polyLines.length > 0) {
    //                 newArr = [...polyLines];
    //                 newArr.forEach((line, index) => {
    //                     if (line.owner === id) {
    //                         newArr[index] = {
    //                             ...line,
    //                             start: { lat, lng }
    //                         };
    //                     } else if (line.to === id) {
    //                         newArr[index] = {
    //                             ...line,
    //                             end: { lat, lng }
    //                         };
    //                     }
    //                 });
    //             }
    //             if (allDrawData.length > 0) {
    //                 indexAllDataCircle = allDrawData.findIndex(item => item.id === id);
    //             }
    //             dispatch(dragLine({ indexCircle, indexAllDataCircle, newArr, updatedObject: obj }));
    //         }
    //         dispatch(setDrag(false));
    //     },
    //     [drawingCircle, dispatch, id, polyLines, allDrawData]
    // );
    const markers = useMemo(() => {
        return drawingCircle.map((item) => (
            <Marker
                draggable={true}
                key={item.id}
                position={[item.lat, item.lng]}
                icon={redIcon}
                eventHandlers={{
                    mouseover: (e) => {
                        if (!drag) {
                            dispatch(setId(item.id));
                        }
                        if (!showOwnerLines) {
                            dispatch(setShowOwnerLines(true));
                        }
                        dispatch(setCircleMenu(true));
                    },
                    mouseout: () => {
                        dispatch(setShowOwnerLines(false));
                        dispatch(setCircleMenu(false));
                    },
                    dragstart: (e) => MapInterface.handleDragStart(dispatch),
                    drag: (e) => MapInterface.handleMarkerDrag(e, dispatch, polyLines, drawingCircle, id),
                    dragend: (e) => MapInterface.handleMarkerDragEnd(e, dispatch, polyLines, drawingCircle, id, allDrawData),
                }}
            />
        ));
    }, [drawingCircle, redIcon, drag, showOwnerLines, dispatch, polyLines, id, allDrawData]);
    const polylineElements = useMemo(() => {
        if (polyLines.length > 0) {
            return polyLines.map((item) => (
                <Polyline
                    positions={[
                        [item.start?.lat as number, item.start?.lng as number],
                        [item.end?.lat as number, item.end?.lng as number],
                    ]}
                    key={item.id}
                    weight={4}
                    pathOptions={{ color: showOwnerLines && item.owner === id ? 'green' : 'red' }}
                />
            ));

        }
        return null;
    }, [id, polyLines, showOwnerLines]);
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
                    style={{ height: '400px', width: '100%' }}


                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {drawingCircle.length > 0 ? (
                        <>
                            {markers}
                            {polylineElements}
                        </>
                    ) : null}
                    <MapDrawing />
                </MapContainer>
            </div>
        </>
    );
};
