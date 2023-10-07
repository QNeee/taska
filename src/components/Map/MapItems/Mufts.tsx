import { useDispatch, useSelector } from "react-redux"
import { getDrag } from "../../../Redux/app/appSelectors"
import { Marker } from "react-leaflet";
import { getMufts, getPolyLines, getShowOnwerLines } from "../../../Redux/map/mapSelectors";
import { MarkerInterface } from "../../../interface/MarkerInterface";

export const Mufts = () => {
    const dispatch = useDispatch();
    const mufts = useSelector(getMufts);
    const polyLines = useSelector(getPolyLines);
    const drag = useSelector(getDrag);
    const showOwnerLines = useSelector(getShowOnwerLines)

    return <>
        {mufts.map((item, index) => (
            <Marker
                draggable={true}
                key={item.id}
                position={item.getLatLng()}
                icon={item.getIcon()}
                eventHandlers={{
                    click: (e) => MarkerInterface.handleClickMarker(e, polyLines),
                    mouseover: (e) => MarkerInterface.handleMouseOver(item.id as string, dispatch, drag, showOwnerLines),
                    mouseout: () => MarkerInterface.handleMouseOut(dispatch),
                    dragstart: (e) => MarkerInterface.handleDragStart(dispatch),
                    drag: (e) => MarkerInterface.handleMarkerDrag(e, dispatch, polyLines, item, index, mufts),
                    dragend: (e) => MarkerInterface.handleMarkerDragEnd(e, dispatch),
                    contextmenu: (e) => MarkerInterface.handleContextMenuHandler(e, dispatch)
                }}
            />
        ))}
    </>
}