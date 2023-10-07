
import L from "leaflet";
import { IXyObj, setGeneralMenu } from "../Redux/map/mapSlice";
import { Mufts } from "../Mufts";

export class ContextMenuGeneralInterface {
    static handleMenuClickMufta(obj: IXyObj, dispatch: Function, map: L.Map) {
        const points = L.point(obj.x, obj.y);
        const latLng = map.containerPointToLatLng(points);
        const mufta = L.marker(latLng);
        Mufts.addMuft(mufta, dispatch);
    }
    static handleOnCloseGeneralMenu(dispatch: Function) {
        dispatch(setGeneralMenu(false));
    }
}