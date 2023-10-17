import { LeafletMouseEvent } from "leaflet";
import { IPolyLinesArr, setClickAccept, setDrawLine } from "../Redux/app/appSlice";
import { Lines } from "../Line"


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
}