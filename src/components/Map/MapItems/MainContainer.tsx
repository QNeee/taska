import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { getChangeLineModal, getFiberOpticsMenu, getMuftaInfoModal, getPolylineInfoModal, getTrack } from "../../../Redux/map/mapSelectors";
import { Mufts } from "./Mufts/Mufts";
import { Polylines } from "./Polylines/Polylines";
import { FiberOptics } from "./FiberOptics/FiberOptics";
import { Cubes } from "./Cubes/Cubes";
import { Wardrobes } from "./Wardrobes/Wardrobes";
import { MapDrawing } from "../MapDrawing";



export const MainContainer = () => {
    const polylineInfoModal = useSelector(getPolylineInfoModal);
    const fiberCountMenu = useSelector(getFiberOpticsMenu);
    const changeModal = useSelector(getChangeLineModal);
    const trackObj = useSelector(getTrack);
    const muftaInfoModa = useSelector(getMuftaInfoModal)
    const { idOwner, color, track, index } = trackObj;
    const map = useMap();
    useEffect(() => {
        if (polylineInfoModal || fiberCountMenu || changeModal || muftaInfoModa) {
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
    }, [changeModal, fiberCountMenu, map.doubleClickZoom, map.dragging, map.keyboard, map.scrollWheelZoom, muftaInfoModa, polylineInfoModal, track]);
    return <>
        <Mufts />
        {!track ? <Polylines /> :
            <FiberOptics color={color} idOnwer={idOwner} index={index} />}
        <Cubes />
        <Wardrobes />
        <MapDrawing />
    </>
}