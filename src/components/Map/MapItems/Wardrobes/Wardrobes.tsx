import { useDispatch, useSelector } from "react-redux"
import { Marker } from "react-leaflet";
import { getContextMenu, getDrag, getWardrobes } from "../../../../Redux/map/mapSelectors";
import { setContextMenu, setContextMenuXY, setDrag, setId } from "../../../../Redux/map/mapSlice";
import { ContextMenuWardrobe } from "../../../../interface/ContextMenuWardrobe";

export const Wardrobes = () => {

    const wardRobes = useSelector(getWardrobes);
    const dispatch = useDispatch();
    // const mufts = useSelector(getMufts);
    // const polyLines = useSelector(getPolyLines);
    const drag = useSelector(getDrag);
    const contextMenu = useSelector(getContextMenu);
    return <>
        {wardRobes.map((item, index) => (
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
                        // const data = MuftaInterface.handleMouseOver(item, polyLines)
                        // dispatch(setPolysOwner(data));
                    },
                    mouseout: () => {
                        // const data = MuftaInterface.handleMouseOut(item.id as string, polyLines)
                        dispatch(setContextMenu({
                            ...contextMenu,
                            item: false,
                        }))
                        // dispatch(setPolysOwner(data));
                    },
                    dragstart: () => dispatch(setDrag(true)),
                    drag: (e) => {
                        // const data = MuftaInterface.handleMarkerDrag(e, polyLines, item, index, mufts, wardRobes);
                        // dispatch(updatePoly(data));

                    },
                    dragend: () => dispatch(setDrag(false)),
                    contextmenu: async (e) => {
                        e.originalEvent.preventDefault();
                        dispatch(setId(item.id));
                        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
                        const menu = ContextMenuWardrobe.OpenMenu();
                        dispatch(setContextMenu(menu));
                    }
                }}
            />
        ))}
    </>
}