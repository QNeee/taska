import { ICube } from "../Cube";
import { Lines } from "../Line";
import { IDrawArr, IPolyLinesArr, setClickAccept, setDrawLine, setPolylineMenuOpen } from "../Redux/app/appSlice";
import { IDrawItemLatLng } from "./ContextMenuInterface";

export class ContextMenuPolylineInterface {
    static handleMenuClickChangeLineFromThis(latlng: IDrawItemLatLng, dispatch: Function, polylines: IPolyLinesArr[], drawCircles: IDrawArr[], id: string, cubes: ICube[]) {
        Lines.changeLine(latlng, dispatch, polylines, drawCircles, id, cubes);
    }
    static handleMenuClickChangeLineNewFromThis(latlng: IDrawItemLatLng, dispatch: Function, polylines: IPolyLinesArr[], id: string) {
        dispatch(setDrawLine(true));
        Lines.drawFreeLine(latlng, dispatch, polylines, id);
        dispatch(setClickAccept(true));
    }
    static handleMenuClickInfo(latlng: IDrawItemLatLng, dispatch: Function) {

    }
    static handleMenuClose(dispatch: Function) {
        dispatch(setPolylineMenuOpen(false));
    }
}