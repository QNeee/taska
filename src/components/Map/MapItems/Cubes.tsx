import { useDispatch, useSelector } from "react-redux"
import { getCubes, getDrag, getHideCubes, getItemMenu, getMufts, getPolyLines } from "../../../Redux/map/mapSelectors"
import { Marker, useMap } from "react-leaflet";
import { CubeInterface } from "../../../interface/CubeInterface";
import { setDrag } from "../../../Redux/map/mapSlice";



export const Cubes = () => {
    const cubes = useSelector(getCubes);
    const dispatch = useDispatch();
    const polyLines = useSelector(getPolyLines);
    const mufts = useSelector(getMufts);
    const drag = useSelector(getDrag);
    const map = useMap();
    const itemMenu = useSelector(getItemMenu);
    const hideCubes = useSelector(getHideCubes);
    if (!hideCubes) {
        return <>
            {cubes.map((item, index) => (
                <Marker
                    draggable={true}
                    key={item.id}
                    position={item.getLatLng()}
                    icon={item.getIcon()}
                    eventHandlers={{
                        // dblclick: (e) => CubeInterface.handleDoubleClick(e, dispatch),
                        contextmenu: (e) => CubeInterface.handleCubeContextMenu(e, dispatch),
                        click: (e) => CubeInterface.handleCubeOnClick(e, dispatch, cubes, mufts, item, polyLines, index),
                        dragstart: (e) => CubeInterface.handleCubeDragStart(e, dispatch, cubes, mufts, item, polyLines),
                        drag: (e) => CubeInterface.handleCubeDrag(e, dispatch, polyLines, item, index, cubes, drag, map, mufts, item),
                        dragend: (e) => dispatch(setDrag(false)),
                        mouseover: (e) => CubeInterface.handleCubeMouseOver(e, dispatch, item.id as string, drag, itemMenu),
                        mouseout: (e) => CubeInterface.handleCubeMouseEnd(e, dispatch),
                    }}
                />
            ))}
        </>
    } else {
        return null;
    }
}