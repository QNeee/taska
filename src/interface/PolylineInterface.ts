import L from "leaflet";
import { ICustomPolyline } from "../Polylines";
import { changePolylineWeight, setContextMenuXY, setGeneralMenu, setId, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen } from "../Redux/map/mapSlice";


export class PolylineInterface {
    static handleOnClickPolyline(e: L.LeafletMouseEvent, dispatch: Function) {
        // const lat = e.latlng.lat;
        // const lng = e.latlng.lng;

    }
    static handleContextMenuPolyline(e: L.LeafletMouseEvent, dispatch: Function) {
        e.originalEvent.preventDefault();
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        dispatch(setMuftaMenuOpen(false));
        dispatch(setGeneralMenu(false));
        dispatch(setPolylineMenuOpen(true));
    }
    static handleMouseOverPolyline(e: L.LeafletMouseEvent, dispatch: Function, item: ICustomPolyline, drag: boolean, index: number, polylines: ICustomPolyline[]) {
        if (!drag) {
            dispatch(setId(item.id));
            dispatch(setItemMenu(true));
            const poly = [...polylines];
            poly.forEach((line) => {
                if (line.id === item.id) {
                    line.options.weight = 12;
                }
            })
            dispatch(changePolylineWeight(poly));
        }
    }
    static handleMouseOutPolyline(e: L.LeafletMouseEvent, dispatch: Function, item: ICustomPolyline, index: number, polylines: ICustomPolyline[]) {
        const poly = [...polylines];
        poly.forEach((line) => {
            if (line.id === item.id) {
                line.options.weight = 4;
            }
        })
        dispatch(setItemMenu(false));
        dispatch(changePolylineWeight(poly));
    }
}