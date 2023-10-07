import { useDispatch, useSelector } from "react-redux"
import { getId, getPolyLines, getShowOnwerLines } from "../../../Redux/map/mapSelectors"
import { Polyline } from "react-leaflet";
import { PolylineInterface } from "../../../interface/PolylineInterface";
import { getDrag } from "../../../Redux/app/appSelectors";
import { LatLng } from "leaflet";


export const Polylines = () => {
    const polyLines = useSelector(getPolyLines);
    const dispatch = useDispatch();
    const drag = useSelector(getDrag);
    const showOwnerLines = useSelector(getShowOnwerLines);
    const id = useSelector(getId);
    return <>
        {polyLines?.map((item, index) => {
            const positionArr = item.getLatLngs() as LatLng[];
            const startLat = positionArr[0]['lat'];
            const startLng = positionArr[0]['lng']
            const endLat = positionArr[1]['lat'];
            const endLng = positionArr[1]['lng']
            return <Polyline
                positions={[[startLat, startLng], [endLat, endLng]]}
                key={item.id}
                pathOptions={{ color: showOwnerLines && item.owner === id ? 'green' : 'red', weight: item.options.weight }}
                eventHandlers={{
                    click: (e) => PolylineInterface.handleOnClickPolyline(e, dispatch),
                    mouseover: (e) => PolylineInterface.handleMouseOverPolyline(e, dispatch, item, drag, index, polyLines),
                    mouseout: (e) => PolylineInterface.handleMouseOutPolyline(e, dispatch, item, index, polyLines),
                    contextmenu: (e) => PolylineInterface.handleContextMenuPolyline(e, dispatch),
                }}
            />
        })}
    </>
}