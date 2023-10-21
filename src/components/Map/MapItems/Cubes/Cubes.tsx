import { useDispatch, useSelector } from "react-redux"
import { getContextMenu, getCubes, getDrag, getHideCubes, getMufts, getPolyLines, getTrack, getWardrobes } from "../../../../Redux/map/mapSelectors"
import { Marker } from "react-leaflet";
import { CubeInterface } from "../../../../interface/CubeInterface";
import { setContextMenu, setContextMenuXY, setDrag, setId, updateCubes, updateCubesDelete, updateMufta, updateWardrobe } from "../../../../Redux/map/mapSlice";
import { IClickData } from "../../../../interface/PolylineInterface";
import { ContextMenuCubeInterface } from "../../../../interface/ContextMenuCubeInterface";



export const Cubes = () => {
    const cubesArr = useSelector(getCubes);
    const dispatch = useDispatch();
    const polyLines = useSelector(getPolyLines);
    const mufts = useSelector(getMufts);
    const drag = useSelector(getDrag);
    const hideCubes = useSelector(getHideCubes);
    const contextMenu = useSelector(getContextMenu);
    const track = useSelector(getTrack);
    const wardrobes = useSelector(getWardrobes);
    if (!hideCubes && !track.track) {
        return <>
            {cubesArr.map((item, index) => (
                <Marker
                    draggable={true}
                    key={item.id}
                    position={item.getLatLng()}
                    icon={item.getIcon()}
                    eventHandlers={{
                        contextmenu: (e) => {
                            e.originalEvent.preventDefault();
                            dispatch(setId(item.id));
                            dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
                            const menu = ContextMenuCubeInterface.OpenMenu();
                            dispatch(setContextMenu(menu));
                        },
                        click: (e) => {
                            const { data, idOwner, idTo, cubes, polys, to }: IClickData = CubeInterface.handleCubeOnClick(cubesArr, mufts, item, polyLines, wardrobes)
                            if (to.type === 'muft') {
                                dispatch(updateMufta({ idOwner, idTo, data }));
                            } else {
                                dispatch(updateWardrobe({ idOwner, idTo, data }));
                            }
                            dispatch(updateCubesDelete({ cubes, polyLines: polys }));
                        },
                        dragstart: () => {
                            dispatch(setDrag(true))
                        },
                        drag: (e) => {
                            if (drag) {
                                const data = CubeInterface.handleCubeDrag(e, polyLines, index, cubesArr, mufts, item)
                                dispatch(updateCubes(data));
                            }
                        },
                        dragend: () => {
                            dispatch(setDrag(false));
                        },
                        mouseover: () => {
                            if (!drag && !contextMenu.item) {
                                dispatch(setContextMenu({
                                    ...contextMenu,
                                    item: true,
                                }))
                            }
                        },
                        mouseout: () => dispatch(setContextMenu({
                            ...contextMenu,
                            item: false,
                        }))
                    }}
                />
            ))}
        </>
    } else {
        return null;
    }
}