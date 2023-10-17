import { useDispatch, useSelector } from "react-redux"
import { getCubes, getHideCubes, getItemMenu, getMufts, getPolyLines } from "../../../Redux/map/mapSelectors"
import { Polyline, useMap } from "react-leaflet";
import { IClickData, PolylineInterface } from "../../../interface/PolylineInterface";
import { getDrag } from "../../../Redux/app/appSelectors";
import { LatLng } from "leaflet";
import { drawCube, drawPolyline, setContextMenuXY, setGeneralMenu, setHideCubes, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen, updateMufta } from "../../../Redux/map/mapSlice";


export const Polylines = () => {
    const polyLines = useSelector(getPolyLines);
    const dispatch = useDispatch();
    const drag = useSelector(getDrag);
    const cubesArr = useSelector(getCubes);
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
                    click: (e) => {
                        if (hideCubes) {
                            return dispatch(setHideCubes(false));
                        }
                        const { data, idOwner, idTo, polys, cubes }: IClickData = PolylineInterface.handleOnClickPolyline(e, item, map, polyLines, cubesArr, index, mufts)
                        dispatch(updateMufta({ idOwner, idTo, data }));
                        dispatch(drawPolyline(polys));
                        dispatch(drawCube(cubes));
                    },
                    mouseover: (e) => {
                        if (!drag && !itemMenu) {
                            dispatch(setItemMenu(true));
                            const data = PolylineInterface.handleMouseOverPolyline(e, item, drag, polyLines, mufts);
                            dispatch(drawPolyline(data));
                        }
                    },
                    mouseout: (e) => {
                        const data = PolylineInterface.handleMouseOutPolyline(e, item, polyLines, mufts)
                        dispatch(drawPolyline(data));
                        dispatch(setItemMenu(false));

                    },
                    contextmenu: (e) => {
                        e.originalEvent.preventDefault();
                        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
                        dispatch(setMuftaMenuOpen(false));
                        dispatch(setGeneralMenu(false));
                        dispatch(setPolylineMenuOpen(true));
                    },
                }}
            />
        })}
    </>
}