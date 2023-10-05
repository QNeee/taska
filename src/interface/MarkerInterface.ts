import { LeafletMouseEvent } from "leaflet";
import { Lines } from "../Line";
import { IDrawArr, IPolyLinesArr, setContextMenuXY, setDrag, setDrawItemLatLng, setGeneralMenu, setId, setMuftaMenuOpen, setPolylineMenuOpen, setShowOwnerLines } from "../Redux/app/appSlice";

export class MarkerInterface {
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
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const obj = { lat, lng };
        dispatch(setDrawItemLatLng(obj));
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        dispatch(setGeneralMenu(false));
        dispatch(setPolylineMenuOpen(false));
        dispatch(setMuftaMenuOpen(true));
    }
    static handleDragStart(dispatch: Function) {
        dispatch(setDrag(true));
    }
    static handleMarkerDrag(e: L.LeafletEvent, dispatch: Function, polyLines: IPolyLinesArr[], mufts: IDrawArr, index: number) {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        const newArr = [...polyLines];
        newArr.forEach((line, index) => {
            if (line.start?.lat === mufts.lat && line.start.lng === mufts.lng) {
                newArr[index] = {
                    ...line,
                    start: {
                        lat, lng
                    }
                }
            } else if (line.end?.lat === mufts.lat && line.end.lng === mufts.lng) {
                newArr[index] = {
                    ...line,
                    end: {
                        lat, lng
                    }
                }
            }
        })
        const obj = {
            ...mufts,
            lat,
            lng
        };
        Lines.updatePoly(dispatch, { indexCircle: index, newArr, obj });

    }
    static handleMarkerDragEnd(e: L.LeafletEvent, dispatch: Function, polyLines: IPolyLinesArr[], mufts: IDrawArr, allDrawData: IDrawArr[], index: number) {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        let newArr;
        let indexAllDataCircle = null;
        const obj = {
            ...mufts,
            lat,
            lng
        };
        if (polyLines.length > 0) {
            newArr = [...polyLines];
            newArr.forEach((line, index) => {
                if (line.start?.lat === mufts.lat && line.start.lng === mufts.lng) {
                    newArr[index] = {
                        ...line,
                        start: {
                            lat, lng
                        }
                    }
                } else if (line.end?.lat === mufts.lat && line.end.lng === mufts.lng) {
                    newArr[index] = {
                        ...line,
                        end: {
                            lat, lng
                        }
                    }
                }
            })
        }
        if (allDrawData.length > 0) {
            indexAllDataCircle = allDrawData.findIndex(item => item.id === mufts.id);
        }
        Lines.dragLine(dispatch, { indexCircle: index, indexAllDataCircle, newArr, obj });

        dispatch(setDrag(false));
    }

}