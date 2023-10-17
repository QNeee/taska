
import L from "leaflet";
import { IXyObj, setGeneralMenu } from "../Redux/map/mapSlice";
import { Mufts } from "../Mufts";
import { Wardrobe } from "../Wardrobe";

export class ContextMenuGeneralInterface {
    static handleMenuClickMufta(obj: IXyObj, map: L.Map) {
        const points = L.point(obj.x, obj.y);
        const latLng = map.containerPointToLatLng(points);
        const data = new Mufts(latLng).getMuft();
        return data;
    }
    static handleMenuClickWardrobe(obj: IXyObj, map: L.Map) {
        const points = L.point(obj.x, obj.y);
        const latLng = map.containerPointToLatLng(points);
        const data = new Wardrobe(latLng).getWardrobe();
        return data;
    }
    static handleOnCloseGeneralMenu(dispatch: Function) {
        dispatch(setGeneralMenu(false));
    }
}