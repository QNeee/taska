import { IPolyLinesArr, changePolylineWeight, setContextMenuXY, setDrawItemLatLng, setGeneralMenu, setId, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen } from "../Redux/app/appSlice";


export class PolylineInterface {
    static handleOnClickPolyline(e: L.LeafletMouseEvent, dispatch: Function) {
        // const lat = e.latlng.lat;
        // const lng = e.latlng.lng;

    }
    static handleContextMenuPolyline(e: L.LeafletMouseEvent, dispatch: Function) {
        e.originalEvent.preventDefault();
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const obj = { lat, lng };
        dispatch(setDrawItemLatLng(obj));
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        dispatch(setMuftaMenuOpen(false));
        dispatch(setGeneralMenu(false));
        dispatch(setPolylineMenuOpen(true));
    }
    static handleMouseOverPolyline(e: L.LeafletMouseEvent, dispatch: Function, item: IPolyLinesArr, drag: boolean, index: number) {
        if (!drag) {
            dispatch(setId(item.id));
            dispatch(setItemMenu(true));
            const newItem = {
                ...item,
                weight: 12
            }
            dispatch(changePolylineWeight({ newItem, index }));
        }
    }
    static handleMouseOutPolyline(e: L.LeafletMouseEvent, dispatch: Function, item: IPolyLinesArr, index: number) {
        const newItem = {
            ...item,
            weight: null
        }
        dispatch(setItemMenu(false));
        dispatch(changePolylineWeight({ newItem, index }));
    }
}