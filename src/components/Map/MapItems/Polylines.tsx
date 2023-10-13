import { useDispatch, useSelector } from "react-redux"
import { getCubes, getHideCubes, getItemMenu, getMufts, getPolyLines } from "../../../Redux/map/mapSelectors"
import { Polyline, useMap } from "react-leaflet";
import { PolylineInterface } from "../../../interface/PolylineInterface";
import { getDrag } from "../../../Redux/app/appSelectors";
import { LatLng } from "leaflet";


export const Polylines = () => {
    const polyLines = useSelector(getPolyLines);
    const dispatch = useDispatch();
    const drag = useSelector(getDrag);
    const cubes = useSelector(getCubes);
    const mufts = useSelector(getMufts);
    const itemMenu = useSelector(getItemMenu);
    const hideCubes = useSelector(getHideCubes);
    const map = useMap();
    return <>
        {polyLines?.map((item, index) => {
            const [{ lat: startLat, lng: startLng }, { lat: endLat, lng: endLng }] = item.getLatLngs() as LatLng[];
            const middleLat = (startLat + endLat) / 2;
            const middleLng = (startLng + endLng) / 2;
            return <Polyline
                positions={[
                    [startLat, startLng],
                    [middleLat, middleLng],
                    [endLat, endLng]
                ]}
                key={item.id}
                pathOptions={{ color: item.options.color, weight: item.options.weight }}
                eventHandlers={{
                    dblclick: (e) => PolylineInterface.handleDbClick(e),
                    // click: (e) => PolylineInterface.handleOnClickPolyline(e, dispatch, item, map, polyLines, cubes, mufts, index),
                    click: (e) => PolylineInterface.handleOnClickPolyline(e, dispatch, item, map, polyLines, cubes, index, mufts, hideCubes),

                    mouseover: (e) => PolylineInterface.handleMouseOverPolyline(e, dispatch, item, drag, index, polyLines, mufts, itemMenu),
                    mouseout: (e) => PolylineInterface.handleMouseOutPolyline(e, dispatch, item, index, polyLines, mufts),
                    contextmenu: (e) => PolylineInterface.handleContextMenuPolyline(e, dispatch),
                }}
            />
        })}
    </>
}