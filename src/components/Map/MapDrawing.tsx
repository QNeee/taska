import { useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import { getAllDrawData, getCircleMenu, getCircleMenuOpen, getMenu } from "../../Redux/app/appSelectors";
import { AppDispatch } from "../../Redux/store";
import { makeUndraw, setCircleMenuOpen, setDrawItemLatLng, setGeneralMenu } from "../../Redux/app/appSlice";
import { useState } from "react";
import { LeafletMouseEvent } from "leaflet";
import ContextMenu from "./ContextMenu";
export const MapDrawing = () => {
    const dispatch: AppDispatch = useDispatch();
    const allDrawData = useSelector(getAllDrawData);
    const menuOpen = useSelector(getMenu);
    const circleMenuOpen = useSelector(getCircleMenuOpen);
    const [contextMenuX, setContextMenuX] = useState(0);
    const [contextMenuY, setContextMenuY] = useState(0);
    const circleMenu = useSelector(getCircleMenu);
    const handleContextMenu = (e: LeafletMouseEvent) => {
        e.originalEvent.preventDefault();
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const obj = { lat, lng };
        dispatch(setDrawItemLatLng(obj));
        setContextMenuX(e.originalEvent.clientX);
        setContextMenuY(e.originalEvent.clientY);
        if (!circleMenu) {
            dispatch(setCircleMenuOpen(false));
            dispatch(setGeneralMenu(true));
        } else {
            dispatch(setGeneralMenu(false));
            dispatch(setCircleMenuOpen(true));
        }

    };
    const onCloseMenu = () => {
        dispatch(setGeneralMenu(false));
        dispatch(setCircleMenuOpen(false));
    }
    useMapEvents({
        contextmenu: handleContextMenu,
        keydown: (e) => {
            console.log('keydown');
            if (allDrawData.length > 0) {
                if (e.originalEvent.ctrlKey && e.originalEvent.key === 'z' && !e.originalEvent.shiftKey) {
                    dispatch(makeUndraw(allDrawData[allDrawData.length - 1]));
                }

                if (e.originalEvent.ctrlKey && e.originalEvent.shiftKey && e.originalEvent.key === 'Z') {
                    // dispatch(makeUndraw(allDrawData[allDrawData.length - 1]));
                    console.log('dd');
                }
            }
        },

    });
    return <>
        {(menuOpen || circleMenuOpen) && (
            <ContextMenu left={contextMenuX} top={contextMenuY} onClose={onCloseMenu} />
        )}
    </>;
}