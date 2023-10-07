import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { setContextMenuXY, setDrag, setGeneralMenu, setId, setMuftaMenuOpen, setPolylineMenuOpen, setShowOwnerLines } from "../Redux/map/mapSlice";
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
    static handleMouseOver(id: string, dispatch: Function, drag: boolean, showOwnerLines: boolean) {
        if (!drag) {
            dispatch(setId(id));
        }
        if (!showOwnerLines) {
            dispatch(setShowOwnerLines(true));
        }
    }
    static handleMouseOut(dispatch: Function) {
        dispatch(setShowOwnerLines(false));
    }
    static handleContextMenuHandler(e: LeafletMouseEvent, dispatch: Function) {
        e.originalEvent.preventDefault();
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