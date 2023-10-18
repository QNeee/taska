import { useDispatch, useSelector } from "react-redux"
import { getDrag } from "../../../Redux/app/appSelectors"
import { Marker } from "react-leaflet";
import { getContextMenu, getMufts, getPolyLines } from "../../../Redux/map/mapSelectors";
import { MuftaInterface } from "../../../interface/MuftaInterface";
import { setContextMenu, setContextMenuXY, setDrag, setId, setPolysOwner, updatePoly } from "../../../Redux/map/mapSlice";
import { ContextMenuMuftaInterface } from "../../../interface/ContextMenuMuftaInterface";

export const Mufts = () => {
    const dispatch = useDispatch();
    const mufts = useSelector(getMufts);
    const polyLines = useSelector(getPolyLines);
    const drag = useSelector(getDrag);
    const contextMenu = useSelector(getContextMenu);
    return <>
        {mufts.map((item, index) => (
            <Marker
                draggable={item.drag}
                key={item.id}
                position={item.getLatLng()}
                icon={item.getIcon()}
                eventHandlers={{
                    mouseover: () => {
                        if (!drag && !contextMenu.item) {
                            dispatch(setContextMenu({
                                ...contextMenu,
                                item: true,
                            }))
                        }
                        const data = MuftaInterface.handleMouseOver(item, polyLines)
                        dispatch(setPolysOwner(data));
                    },
                    mouseout: () => {
                        const data = MuftaInterface.handleMouseOut(item.id as string, polyLines)
                        dispatch(setContextMenu({
                            ...contextMenu,
                            item: false,
                        }))
                        dispatch(setPolysOwner(data));
                    },
                    dragstart: () => dispatch(setDrag(true)),
                    drag: (e) => {
                        const data = MuftaInterface.handleMarkerDrag(e, polyLines, item, index, mufts);
                        dispatch(updatePoly(data));

                    },
                    dragend: () => dispatch(setDrag(false)),
                    contextmenu: (e) => {
                        e.originalEvent.preventDefault();
                        dispatch(setId(item.id));
                        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
                        const menu = ContextMenuMuftaInterface.OpenMenu();
                        dispatch(setContextMenu(menu));
                    }
                }}
            />
        ))}
    </>
}