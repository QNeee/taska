import { ICube } from "../Cube";
import { Lines } from "../Line";
import { IDrawArr, IPolyLinesArr, setContextMenuXY, setCubeMenu, setDrag, setDrawItemLatLng, setGeneralMenu, setId, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen } from "../Redux/app/appSlice";

export class CubeInterface {
    static handleCubeDragStart(dispatch: Function) {
        dispatch(setDrag(true));
    }
    static handleCubeContextMenu(e: L.LeafletMouseEvent, dispatch: Function) {
        e.originalEvent.preventDefault();
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const obj = { lat, lng };
        dispatch(setDrawItemLatLng(obj));
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        dispatch(setMuftaMenuOpen(false));
        dispatch(setGeneralMenu(false));
        dispatch(setPolylineMenuOpen(false));
        dispatch(setCubeMenu(true));
    }
    static handleDeleteCube(id: string) {

    }
    static handleCubeOnClick(polyLines: IPolyLinesArr[], item: ICube) {

    }
    static handleCubeDrag(e: L.LeafletEvent, dispatch: Function, polyLines: IPolyLinesArr[], item: ICube, index: number, cubes: ICube[]) {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        const newArr = [...polyLines];
        newArr.forEach((line, index) => {
            if (line.start?.lat === item.lat && line.start.lng === item.lng) {
                newArr[index] = {
                    ...line,
                    start: {
                        lat, lng
                    }
                }
            } else if (line.end?.lat === item.lat && line.end.lng === item.lng) {
                newArr[index] = {
                    ...line,
                    end: {
                        lat, lng
                    }
                }
            }
        })
        const obj = {
            ...item,
            lat,
            lng
        };
        Lines.updatePoly(dispatch, { indexCircle: index, newArr, obj });
    }
    static handleCubeDragEnd(e: L.LeafletEvent, dispatch: Function, polyLines: IPolyLinesArr[], item: ICube, allDrawData: IDrawArr[], index: number) {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        let newArr;
        let indexAllDataCircle = null;
        const obj = {
            ...item,
            lat,
            lng
        };
        if (polyLines.length > 0) {
            newArr = [...polyLines];
        }
        if (allDrawData.length > 0) {
            indexAllDataCircle = allDrawData.findIndex(data => data.id === item.id);
        }
        Lines.dragLine(dispatch, { indexCircle: index, indexAllDataCircle, newArr, obj });

        dispatch(setDrag(false));
    }
    static handleCubeMouseOver(e: L.LeafletMouseEvent, dispatch: Function, id: string, drag: boolean) {
        if (!drag) {
            dispatch(setId(id));
            dispatch(setItemMenu(true));
        }
    }
    static handleCubeMouseEnd(e: L.LeafletMouseEvent, dispatch: Function) {
        dispatch(setItemMenu(false));
    }
}