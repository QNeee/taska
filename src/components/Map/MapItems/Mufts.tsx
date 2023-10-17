import { useDispatch, useSelector } from "react-redux"
import { getDrag } from "../../../Redux/app/appSelectors"
import { Marker } from "react-leaflet";
import { getItemMenu, getMufts, getPolyLines } from "../../../Redux/map/mapSelectors";
import { MarkerInterface } from "../../../interface/MarkerInterface";
import { setContextMenuXY, setDrag, setGeneralMenu, setId, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen, setPolysOwner, updatePoly } from "../../../Redux/map/mapSlice";

export const Mufts = () => {
    const dispatch = useDispatch();
    const mufts = useSelector(getMufts);
    const polyLines = useSelector(getPolyLines);
    const drag = useSelector(getDrag);
    const itemMenu = useSelector(getItemMenu);
    return <>
        {mufts.map((item, index) => (
            <Marker
                draggable={item.drag}
                key={item.id}
                position={item.getLatLng()}
                icon={item.getIcon()}
                eventHandlers={{
                    mouseover: () => {
                        if (!drag && !itemMenu) {
                            dispatch(setItemMenu(true));
                        }
                        const data = MarkerInterface.handleMouseOver(item, polyLines)
                        dispatch(setPolysOwner(data));
                    },
                    mouseout: () => {
                        const data = MarkerInterface.handleMouseOut(item.id as string, polyLines)
                        dispatch(setItemMenu(false));
                        dispatch(setPolysOwner(data));
                    },
                    dragstart: () => dispatch(setDrag(true)),
                    drag: (e) => {
                        const data = MarkerInterface.handleMarkerDrag(e, polyLines, item, index, mufts);
                        dispatch(updatePoly(data));

                    },
                    dragend: () => dispatch(setDrag(false)),
                    contextmenu: (e) => {
                        e.originalEvent.preventDefault();
                        dispatch(setId(item.id));
                        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
                        dispatch(setGeneralMenu(false));
                        dispatch(setPolylineMenuOpen(false));
                        dispatch(setMuftaMenuOpen(true));
                    }
                }}
            />
        ))}
    </>
}