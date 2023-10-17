import { useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import { getCubeMenu } from "../../Redux/app/appSelectors";
import { AppDispatch } from "../../Redux/store";
import ContextMenu from "./ContextMenu";
import { getContextMenuXY, getGeneralMenu, getItemMenu, getMuftaMenuOpen, getPolylineMenuOpen } from "../../Redux/map/mapSelectors";
import { setContextMenuXY, setGeneralMenu, setMuftaMenuOpen, setPolylineMenuOpen } from "../../Redux/map/mapSlice";
import { setCubeMenu } from "../../Redux/app/appSlice";

export const MapDrawing = () => {
    const dispatch: AppDispatch = useDispatch();
    const generalMenuOpen = useSelector(getGeneralMenu);
    const muftaMenuOpen = useSelector(getMuftaMenuOpen);
    const polylineMenuOpen = useSelector(getPolylineMenuOpen);
    const generalMenu = useSelector(getGeneralMenu);
    const contextMenuXY = useSelector(getContextMenuXY);
    const itemMenu = useSelector(getItemMenu);
    const cubeMenu = useSelector(getCubeMenu);
    useMapEvents({
        contextmenu: (e) => {
            e.originalEvent.preventDefault();
            dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
            if (!generalMenu && !itemMenu && !cubeMenu) {
                dispatch(setMuftaMenuOpen(false));
                dispatch(setPolylineMenuOpen(false));
                dispatch(setCubeMenu(false));
                dispatch(setGeneralMenu(true));
            }
        },
    });
    return <>
        {(generalMenuOpen || muftaMenuOpen || polylineMenuOpen || cubeMenu) && (
            <ContextMenu left={contextMenuXY?.x as number} top={contextMenuXY?.y as number} />
        )}
    </>;
}