import { ICustomCube } from "../Cubes";
import { ICustomMarker } from "../Mufts";
import { ICustomPolyline } from "../Polylines";
import { IPolyLinesArr } from "../Redux/app/appSlice";
import { setPolylineMenuOpen } from "../Redux/map/mapSlice";
import { IDrawItemLatLng } from "./ContextMenuInterface";

export class ContextMenuPolylineInterface {
    static handleMenuClickChangeLineFromThis(latlng: IDrawItemLatLng, dispatch: Function, polylines: ICustomPolyline[], drawCircles: ICustomMarker[], id: string, cubes: ICustomCube[]) {
        // Lines.changeLine(latlng, dispatch, polylines, drawCircles, id, cubes);
    }
    static handleMenuClickChangeLineNewFromThis(latlng: IDrawItemLatLng, dispatch: Function, polylines: IPolyLinesArr[], id: string) {
        // dispatch(setDrawLine(true));
        // Lines.drawFreeLine(latlng, dispatch, polylines, id);
        // dispatch(setClickAccept(true));
    }
    static handleMenuClickInfo(latlng: IDrawItemLatLng, dispatch: Function) {

    }
    static handleMenuClose(dispatch: Function) {
        dispatch(setPolylineMenuOpen(false));
    }
}