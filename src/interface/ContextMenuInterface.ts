import { LeafletMouseEvent } from "leaflet";
import { IPolyLinesArr, setClickAccept, setCubeMenu, setDrawLine } from "../Redux/app/appSlice";
import { Lines } from "../Line"
import { setContextMenuXY, setGeneralMenu, setMuftaMenuOpen, setPolylineMenuOpen } from "../Redux/map/mapSlice";


export interface IDrawItemLatLng {
    lat: number,
    lng: number
}

export class ContextMenuInterface {

    static handleClick(e: LeafletMouseEvent, dispatch: Function, lineDraw: boolean, clickAccept: boolean, tempPoly: IPolyLinesArr) {
        if (lineDraw && clickAccept) {
            const latlng = e.latlng;
            Lines.makePoly(tempPoly, latlng, dispatch);
            dispatch(setDrawLine(false));
            dispatch(setClickAccept(false));
        }
    }
    static handleContextMenu(e: LeafletMouseEvent, dispatch: Function, generalMEnu: boolean, itemMenu: boolean, cubeMenu: boolean) {
        e.originalEvent.preventDefault();
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        if (!generalMEnu && !itemMenu && !cubeMenu) {
            dispatch(setMuftaMenuOpen(false));
            dispatch(setPolylineMenuOpen(false));
            dispatch(setCubeMenu(false));
            dispatch(setGeneralMenu(true));
        }

    }
}