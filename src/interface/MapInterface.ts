import { Line } from "../Line";
import { IDrawArr, IPolyLinesArr, setDrag } from "../Redux/app/appSlice";

export class MapInterface {
    static handleDragStart(dispatch: Function) {
        dispatch(setDrag(true));
    }
    static handleMarkerDrag(e: L.LeafletEvent, dispatch: Function, polyLines: IPolyLinesArr[], mufts: IDrawArr[], id: string) {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        const indexCircle = mufts.findIndex(item => item.id === id);
        if (indexCircle !== -1) {
            const newArr = [...polyLines];
            newArr.forEach((line, index) => {
                if (line.owner === id) {
                    newArr[index] = {
                        ...line,
                        start: { lat, lng }
                    };
                } else if (line.to === id) {
                    newArr[index] = {
                        ...line,
                        end: { lat, lng }
                    };
                }
            });

            const obj = {
                ...mufts[indexCircle],
                lat,
                lng
            };
            Line.updatePoly(dispatch, { indexCircle, newArr, obj });
        }
    }
    static handleMarkerDragEnd(e: L.LeafletEvent, dispatch: Function, polyLines: IPolyLinesArr[], mufts: IDrawArr[], id: string, allDrawData: IDrawArr[]) {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        const indexCircle = mufts.findIndex(item => item.id === id);
        let newArr;
        let indexAllDataCircle = null;
        if (indexCircle !== -1) {
            const obj = {
                ...mufts[indexCircle],
                lat,
                lng
            };
            if (polyLines.length > 0) {
                newArr = [...polyLines];
                newArr.forEach((line, index) => {
                    if (line.owner === id) {
                        newArr[index] = {
                            ...line,
                            start: { lat, lng }
                        };
                    } else if (line.to === id) {
                        newArr[index] = {
                            ...line,
                            end: { lat, lng }
                        };
                    }
                });
            }
            if (allDrawData.length > 0) {
                indexAllDataCircle = allDrawData.findIndex(item => item.id === id);
            }
            Line.dragLine(dispatch, { indexCircle, indexAllDataCircle, newArr,  obj });
        }
        dispatch(setDrag(false));
    }

}