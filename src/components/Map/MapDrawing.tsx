import { useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "../../Redux/store";
import ContextMenu from "./ContextMenu";
import { getChangeLineModal, getContextMenu, getContextMenuXY, getFiberInfoModal, getFiberOpticsMenu, getId, getMainLine, getMuftaInfoModal, getMufts, getPolyLines, getPolylineInfoModal, getTrack, getWardrobeInfoModal, getWardrobes } from "../../Redux/map/mapSelectors";
import { setContextMenu, setContextMenuXY } from "../../Redux/map/mapSlice";
import PolylineModal from "../Modal/Polyline/PolylineModal";
import { MuftaModal } from "../Modal/Mufta/MuftaModal";
import { FiberOpticModal } from "../Modal/FiberOptic/FiberOpticModal";
import { WardrobeModal } from "../Modal/Wardrobe/WardrobeModal";

export const MapDrawing = () => {
    const dispatch: AppDispatch = useDispatch();
    const contextMenuXY = useSelector(getContextMenuXY);
    const contextMenu = useSelector(getContextMenu);
    const polylineInfoModal = useSelector(getPolylineInfoModal);
    const changeInfoModal = useSelector(getChangeLineModal);
    const fiberCountsMenu = useSelector(getFiberOpticsMenu);
    const muftaInfoModal = useSelector(getMuftaInfoModal)
    const id = useSelector(getId);
    const polyLines = useSelector(getPolyLines);
    const muftsArr = useSelector(getMufts);
    const fiberInfoModal = useSelector(getFiberInfoModal);
    const mainLineId = useSelector(getMainLine);
    const wardrobeInfoModal = useSelector(getWardrobeInfoModal);
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
        {polylineInfoModal || changeInfoModal ? <>
            <PolylineModal id={id} polyLines={polyLines} muftsArr={muftsArr} wardrobesArr={wardrobes} />
        </> : null}
        {muftaInfoModal ? <>
            <MuftaModal id={id} mufts={muftsArr} />
        </> : null}
        {fiberInfoModal ? <>
            <FiberOpticModal id={id} mufts={muftsArr} mainLineId={mainLineId} polyLines={polyLines} />
        </> : null}
        {wardrobeInfoModal ? <>
            <WardrobeModal id={id} wardrobes={wardrobes} />
        </> : null}
        {(contextMenu.general || fiberCountsMenu || contextMenu.muft || contextMenu.poly || contextMenu.cube || contextMenu.wardrobes || contextMenu.fiber) && (
            <ContextMenu left={contextMenuXY?.x as number} top={contextMenuXY?.y as number} />
        )}
    </>;
}