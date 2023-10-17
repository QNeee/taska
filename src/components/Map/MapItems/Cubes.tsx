import { useDispatch, useSelector } from "react-redux"
import { getCubes, getDrag, getHideCubes, getItemMenu, getMufts, getPolyLines } from "../../../Redux/map/mapSelectors"
import { Marker } from "react-leaflet";
import { CubeInterface } from "../../../interface/CubeInterface";
import { setContextMenuXY, setDrag, setGeneralMenu, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen, updateCubes, updateCubesDelete, updateMufta } from "../../../Redux/map/mapSlice";
import { setCubeMenu } from "../../../Redux/app/appSlice";
import { IClickData } from "../../../interface/PolylineInterface";



export const Cubes = () => {
    const cubesArr = useSelector(getCubes);
    const dispatch = useDispatch();
    const polyLines = useSelector(getPolyLines);
    const mufts = useSelector(getMufts);
    const drag = useSelector(getDrag);
    const itemMenu = useSelector(getItemMenu);
    const hideCubes = useSelector(getHideCubes);
    if (!hideCubes) {
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
                            dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
                            dispatch(setMuftaMenuOpen(false));
                            dispatch(setGeneralMenu(false));
                            dispatch(setPolylineMenuOpen(false));
                            dispatch(setCubeMenu(true));
                        },
                        click: (e) => {
                            const { data, idOwner, idTo, cubes, polys }: IClickData = CubeInterface.handleCubeOnClick(cubesArr, mufts, item, polyLines)
                            dispatch(updateMufta({ idOwner, idTo, data }));
                            dispatch(updateCubesDelete({ cubes, polyLines: polys }));
                            dispatch(setItemMenu(false));
                        },
                        dragstart: () => dispatch(setDrag(true)),
                        drag: (e) => {
                            if (drag) {
                                const data = CubeInterface.handleCubeDrag(e, polyLines, index, cubesArr, mufts, item)
                                dispatch(updateCubes(data));
                            }
                        },
                        dragend: () => dispatch(setDrag(false)),
                        mouseover: () => {
                            if (!drag && !itemMenu) {
                                dispatch(setItemMenu(true));
                            }
                        },
                        mouseout: (e) => dispatch(setItemMenu(false)),
                    }}
                />
            ))}
        </>
    } else {
        return null;
    }
}