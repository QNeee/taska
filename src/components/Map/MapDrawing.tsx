import { useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "../../Redux/store";
import ContextMenu from "./ContextMenu";
import { getContextMenu, getContextMenuXY, getFiberOpticsMenu, getId, getInfoModal, getMufts, getPolyLines, getTrack, getWardrobes } from "../../Redux/map/mapSelectors";
import { setContextMenu, setContextMenuXY } from "../../Redux/map/mapSlice";
import Modal from "../Modal/Modal";

export const MapDrawing = () => {
    const dispatch: AppDispatch = useDispatch();
    const contextMenuXY = useSelector(getContextMenuXY);
    const contextMenu = useSelector(getContextMenu);
    const infoModal = useSelector(getInfoModal);
    const fiberCountsMenu = useSelector(getFiberOpticsMenu);
    const id = useSelector(getId);
    const polyLines = useSelector(getPolyLines);
    const muftsArr = useSelector(getMufts);
    const wardrobes = useSelector(getWardrobes);
    const { track } = useSelector(getTrack);
    useMapEvents({
        contextmenu: (e) => {
            e.originalEvent.preventDefault();
            dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
            if (!contextMenu.general && !contextMenu.item && !track) {
                dispatch(setContextMenu({
                    muft: false,
                    cube: false,
                    poly: false,
                    wardrobes: false,
                    general: true
                }))
            }
        },
    });
    return <>
        {infoModal && <>
            <Modal id={id} polyLines={polyLines} muftsArr={muftsArr} wardrobesArr={wardrobes} />
        </>}
        {(contextMenu.general || fiberCountsMenu || contextMenu.muft || contextMenu.poly || contextMenu.cube || contextMenu.wardrobes || contextMenu.fiber) && (
            <ContextMenu left={contextMenuXY?.x as number} top={contextMenuXY?.y as number} />
        )}
    </>;
}