import { useDispatch, useSelector } from "react-redux"
import { getCubes, getDrag, getPolyLines } from "../../../Redux/map/mapSelectors"
import { Marker } from "react-leaflet";
import { CubeInterface } from "../../../interface/CubeInterface";



export const Cubes = () => {
    const cubes = useSelector(getCubes);
    const dispatch = useDispatch();
    const polyLines = useSelector(getPolyLines);
    const drag = useSelector(getDrag);
    return <>
        {cubes.map((item, index) => (
            <Marker
                draggable={true}
                key={item.id}
                position={item.getLatLng()}
                icon={item.getIcon()}
                eventHandlers={{
                    contextmenu: (e) => CubeInterface.handleCubeContextMenu(e, dispatch),
                    click: () => CubeInterface.handleCubeOnClick(polyLines, item),
                    dragstart: () => CubeInterface.handleCubeDragStart(dispatch),
                    drag: (e) => CubeInterface.handleCubeDrag(e, dispatch, polyLines, item, index, cubes),
                    dragend: (e) => CubeInterface.handleCubeDragEnd(e, dispatch, polyLines, item, index),
                    mouseover: (e) => CubeInterface.handleCubeMouseOver(e, dispatch, item.id as string, drag),
                    mouseout: (e) => CubeInterface.handleCubeMouseEnd(e, dispatch),
                }}
            />
        ))}
    </>
}