import { useDispatch, useSelector } from "react-redux"
import { Marker } from "react-leaflet";
import { getContextMenu, getDrag, getPolyLines, getWardrobes } from "../../../../Redux/map/mapSelectors";
import { setContextMenu, setContextMenuXY, setDrag, setId, updatePolyWardrobes } from "../../../../Redux/map/mapSlice";
import { ContextMenuWardrobe } from "../../../../interface/ContextMenuWardrobe";
import { WardrobeInterface } from "../../../../interface/WardrobeInterface";

export const Wardrobes = () => {

    const wardRobes = useSelector(getWardrobes);
    const dispatch = useDispatch();
    const drag = useSelector(getDrag);
    const contextMenu = useSelector(getContextMenu);
    const polyLines = useSelector(getPolyLines);
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
                        const data = WardrobeInterface.handleWardrobeDrag(e, polyLines, item, index, wardRobes);
                        dispatch(updatePolyWardrobes(data));

                    },
                    dragend: () => dispatch(setDrag(false)),
                    contextmenu: (e) => {
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