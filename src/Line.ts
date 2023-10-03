import { IDrawArr, IPolyLinesArr, addPolyLines, addPolyLinesToArr, dragLine, updatePoly } from "./Redux/app/appSlice";
import { IDrawItemLatLng } from "./interface/ContextMenuInterface";
import { v4 as uuidv4 } from 'uuid';
interface IUpdatePolyObj {
    indexCircle: number;
    newArr: IPolyLinesArr[] | undefined;
    indexAllDataCircle?: number | null;
    obj: IDrawArr
}
export class Line {
    static makeTempPoly(latlng: IDrawItemLatLng, dispatch: Function, id: string) {
        const objPoly = {
            owner: id,
            start: {
                lat: latlng.lat,
                lng: latlng.lng,
            }
        }
        dispatch(addPolyLines(objPoly));
    }
    static makePoly(tempPoly: IPolyLinesArr, latlng: IDrawItemLatLng, dispatch: Function, id: string) {
        const objPoly = {
            ...tempPoly,
            to: id,
            id: uuidv4(),
            end: {
                lat: latlng.lat,
                lng: latlng.lng
            },
        }
        dispatch(addPolyLinesToArr(objPoly));
    }
    static updatePoly(dispatch: Function, obj: IUpdatePolyObj) {
        dispatch(updatePoly(obj));
    }
    static dragLine(dispatch: Function, obj: IUpdatePolyObj) {
        dispatch(dragLine(obj));
    }
}