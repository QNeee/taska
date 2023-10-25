import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { getChangeLineModal, getFiberOpticsMenu, getInfoModal, getTrack } from "../../../Redux/map/mapSelectors";
import { Mufts } from "./Mufts/Mufts";
import { Polylines } from "./Polylines/Polylines";
import { FiberOptics } from "./FiberOptics/FiberOptics";
import { Cubes } from "./Cubes/Cubes";
import { Wardrobes } from "./Wardrobes/Wardrobes";
import { MapDrawing } from "../MapDrawing";



export const MainContainer = () => {
    const infoModal = useSelector(getInfoModal);
    const fiberCountMenu = useSelector(getFiberOpticsMenu);
    const changeModal = useSelector(getChangeLineModal);
    const trackObj = useSelector(getTrack);
    const { idOwner, color, track, index } = trackObj;
    const map = useMap();
    useEffect(() => {
        if (infoModal || fiberCountMenu || changeModal) {
            map.dragging.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.keyboard.disable();
        } else if (track) {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
        } else {
            map.dragging.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.keyboard.enable();
        }
    }, [changeModal, fiberCountMenu, infoModal, map.doubleClickZoom, map.dragging, map.keyboard, map.scrollWheelZoom, track]);
    return <>
        <Mufts />
        {!track ? <Polylines /> :
            <FiberOptics color={color} idOnwer={idOwner} index={index} />}
        <Cubes />
        <Wardrobes />
        <MapDrawing />
    </>
}