import { useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "../../Redux/store";
import ContextMenu from "./ContextMenu";
import { getContextMenu, getContextMenuXY } from "../../Redux/map/mapSelectors";
import { setContextMenu, setContextMenuXY } from "../../Redux/map/mapSlice";

export const MapDrawing = () => {
    const dispatch: AppDispatch = useDispatch();
    const contextMenuXY = useSelector(getContextMenuXY);
    const contextMenu = useSelector(getContextMenu);
    useMapEvents({
        contextmenu: (e) => {
            e.originalEvent.preventDefault();
            dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
            if (!contextMenu.general && !contextMenu.item) {
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
        {(contextMenu.general || contextMenu.muft || contextMenu.poly || contextMenu.cube || contextMenu.wardrobes) && (
            <ContextMenu left={contextMenuXY?.x as number} top={contextMenuXY?.y as number} />
        )}
    </>;
}