import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { setContextMenuXY, setDrag, setGeneralMenu, setId, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen, setPolysOwner } from "../Redux/map/mapSlice";
import { ICustomMarker } from "../Mufts";
import { ICustomPolyline, Polylines } from "../Polylines";

export class MarkerInterface {
    static handleClickMarker(e: L.LeafletMouseEvent, polylines: ICustomPolyline[]) {
        // const latLngs = new L.LatLng(e.target.getLatLng().lat, e.target.getLatLng().lng);
        // const newArr = [...polylines];
        // newArr.forEach((line, index) => {
        //     const start = line.getLatLngs()[0];
        //     const end = line.getLatLngs()[1];
        //     console.log(latLngs.equals(start as LatLng));
        //     console.log(latLngs.equals(end as LatLng));
        // })
    }
    static handleMouseOver(muft: ICustomMarker, dispatch: Function, drag: boolean, polyLines: ICustomPolyline[], itemMenu: boolean) {
        if (!drag && !itemMenu) {
            dispatch(setItemMenu(true));
        }
        const polys = [...polyLines];
        polys.forEach((item) => {
            if (item.owner === muft.id) {
                item.options.color = 'green';
            }
        })
        dispatch(setPolysOwner(polys));
    }
    static handleMouseOut(dispatch: Function, id: string, polyLines: ICustomPolyline[]) {
        const polys = [...polyLines];
        polys.forEach((item) => {
            if (item.owner === id) {
                item.options.color = 'red';
            }
        })
        dispatch(setItemMenu(false));
        dispatch(setPolysOwner(polys));

    }
    static handleContextMenuHandler(e: LeafletMouseEvent, dispatch: Function, id: string) {
        e.originalEvent.preventDefault();
        dispatch(setId(id));
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        dispatch(setGeneralMenu(false));
        dispatch(setPolylineMenuOpen(false));
        dispatch(setMuftaMenuOpen(true));
    }
    static handleDragStart(dispatch: Function) {
        dispatch(setDrag(true));
    }
    static handleMarkerDrag(e: L.LeafletEvent, dispatch: Function, polyLines: ICustomPolyline[], muft: ICustomMarker, index: number, muftArr: ICustomMarker[]) {
        const latLngs = new L.LatLng(e.target.getLatLng().lat, e.target.getLatLng().lng);
        const newArr = [...polyLines];
        const muftsLatLng = muft.getLatLng();
        newArr.forEach((line, lineIndex) => {

            const startLine = line.getLatLngs()[0];
            const endLine = line.getLatLngs()[1];
            if (muftsLatLng.equals(startLine as LatLng)) {
                newArr[lineIndex].setLatLngs([latLngs, endLine as LatLng]);
            } else if (muftsLatLng.equals(endLine as LatLng)) {
                newArr[lineIndex].setLatLngs([startLine as LatLng, latLngs]);
            }
        });
        const newMufts = [...muftArr];
        newMufts.forEach((item, index) => {
            if (item.id === muft.id) {
                item.setLatLng(latLngs);
            }
        })
        Polylines.updatePoly(dispatch, { index, newArr, mufts: newMufts });
    }
    static handleMarkerDragEnd(e: L.LeafletEvent, dispatch: Function) {
        dispatch(setDrag(false));
    }

}