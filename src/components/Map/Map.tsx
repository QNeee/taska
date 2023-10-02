import React, { useMemo, useCallback } from 'react';
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
    getTempItems,
} from '../../Redux/app/appSelectors';
import { MapDrawing } from './MapDrawing';
import L from 'leaflet';
import { AppDispatch } from '../../Redux/store';
import {
    dragLine,
    makeRestoreUndraw,
    makeUndraw,
    setCircleMenu,
    setDrag,
    setId,
    updatePoly,
} from '../../Redux/app/appSlice';

const iconUrl =
    'https://c0.klipartz.com/pngpicture/720/285/gratis-png-punto-rojo-redondo-bandera-de-japon-bandera-de-japon-s-thumbnail.png';

export const Map = () => {
    const position = useSelector(getPosition);
    const drawingCircle = useSelector(getDrawArrCircles);
    const id = useSelector(getGeneralId);
    const dispatch: AppDispatch = useDispatch();
    const allDrawData = useSelector(getAllDrawData);
    const restoredData = useSelector(getResotredData);
    const tempItems = useSelector(getTempItems);
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
    const key = useMemo(() => position.join(','), [position]);
    const handleDragStart = useCallback(() => {
        dispatch(setDrag(true));
    }, [dispatch]);

    const handleMarkerDrag = useCallback(
        (e: L.LeafletEvent) => {
            const lat = e.target.getLatLng().lat;
            const lng = e.target.getLatLng().lng;
            const indexCircle = drawingCircle.findIndex(item => item.id === id);
            if (polyLines.length > 0) {
                if (indexCircle !== -1) {
                    const newArr = [...polyLines];
                    newArr.forEach((line, index) => {
                        if (line.owner === id) {
                            newArr[index] = {
                                ...line,
                                start: { lat, lng }
                            };
                        } else if (line.to === id) {
                            newArr[index] = {
                                ...line,
                                end: { lat, lng }
                            };
                        }
                    });

                    const obj1 = {
                        ...drawingCircle[indexCircle],
                        lat,
                        lng
                    }
                    dispatch(updatePoly({ indexCircle, newArr, obj1 }));
                }
            }
        },
        [polyLines, id, dispatch, drawingCircle]
    );
    const handleMarkerDragEnd = useCallback(
        (e: L.LeafletEvent) => {
            const lat = e.target.getLatLng().lat;
            const lng = e.target.getLatLng().lng;
            const index = drawingCircle.findIndex((item) => item.id === id);
            if (index !== -1) {
                const obj = {
                    type: drawingCircle[index].type,
                    lat,
                    lng,
                    role: drawingCircle[index].role,
                    id: id,
                };
                dispatch(dragLine({ index, updatedObject: obj }));
            }
            dispatch(setDrag(false));
        },
        [drawingCircle, id, dispatch]
    );

    const markers = useMemo(() => {
        return drawingCircle.map((item) => (
            <Marker
                draggable={true}
                key={item.id}
                position={[item.lat, item.lng]}
                icon={redIcon}
                eventHandlers={{
                    mouseover: () => {
                        if (!drag) {
                            dispatch(setId(item.id));
                        }
                        dispatch(setCircleMenu(true));
                    },
                    mouseout: () => {
                        dispatch(setCircleMenu(false));
                    },
                    dragstart: handleDragStart,
                    drag: handleMarkerDrag,
                    dragend: handleMarkerDragEnd,
                }}
            />
        ));
    }, [dispatch, drawingCircle, handleMarkerDrag, handleMarkerDragEnd, redIcon, handleDragStart, drag]);
    console.log(allDrawData);
    return (
        <div tabIndex={-1} onKeyDown={(e) => {
            if (allDrawData.length > 0) {
                if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                    // const newArr = [...allDrawData];
                    // const item = newArr.pop();
                    const item = allDrawData[allDrawData.length - 1];
                    dispatch(makeUndraw({ data: allDrawData[allDrawData.length - 1], item }));
                }
            }
            if (restoredData.length > 0) {
                if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
                    // const newArr = [...tempItems];
                    // const item = newArr.pop();
                    const item = tempItems[tempItems.length - 1];
                    const newItem = restoredData[restoredData.length - 1];
                    dispatch(makeRestoreUndraw({ index: item?.index, newItem }));
                }
            }
        }}>
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
                        {polyLines.length > 0
                            ? polyLines.map((item, index) => (
                                <Polyline
                                    positions={[
                                        [item.start?.lat as number, item.start?.lng as number],
                                        [item.end?.lat as number, item.end?.lng as number],
                                    ]}
                                    key={index}
                                    color="red"
                                    weight={4}
                                />
                            ))
                            : null}
                    </>
                ) : null}
                <MapDrawing />
            </MapContainer>
        </div>
    );
};
