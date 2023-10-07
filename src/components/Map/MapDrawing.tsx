import { useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import { getClickAccept, getCubeMenu, getDrawLine, getTempPoly } from "../../Redux/app/appSelectors";
import { AppDispatch } from "../../Redux/store";
import ContextMenu from "./ContextMenu";
import { ContextMenuInterface } from "../../interface/ContextMenuInterface";
import { getContextMenuXY, getGeneralMenu, getItemMenu, getMuftaMenuOpen, getPolylineMenuOpen } from "../../Redux/map/mapSelectors";

export const MapDrawing = () => {
    const dispatch: AppDispatch = useDispatch();
    const generalMenuOpen = useSelector(getGeneralMenu);
    const muftaMenuOpen = useSelector(getMuftaMenuOpen);
    const polylineMenuOpen = useSelector(getPolylineMenuOpen);
    const contextMenuXY = useSelector(getContextMenuXY);
    const itemMenu = useSelector(getItemMenu);
    const lineDraw = useSelector(getDrawLine);
    const clickAccept = useSelector(getClickAccept);
    const tempPoly = useSelector(getTempPoly);
    const cubeMenu = useSelector(getCubeMenu);
    useMapEvents({
        click: (e) => ContextMenuInterface.handleClick(e, dispatch, lineDraw, clickAccept, tempPoly),
        contextmenu: (e) => ContextMenuInterface.handleContextMenu(e, dispatch, generalMenuOpen, itemMenu, cubeMenu),
    });
    return <>
        {(generalMenuOpen || muftaMenuOpen || polylineMenuOpen || cubeMenu) && (
            <ContextMenu left={contextMenuXY?.x as number} top={contextMenuXY?.y as number} />
        )}
    </>;
}