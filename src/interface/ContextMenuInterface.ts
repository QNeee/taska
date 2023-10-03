import { Line } from "../Line";
import { IMuftaData, Mufta } from "../Mufta";
import { IDrawArr, IPolyLinesArr, setAddLine } from "../Redux/app/appSlice";

export interface IDrawItemLatLng {
    lat: number,
    lng: number
}

export class ContextMenuInterface {
    static handleMenuClickMufta(obj: IMuftaData, dispatch: Function) {
        Mufta.add(obj, dispatch);
    }
    static handleAddLineFrom(latlng: IDrawItemLatLng, dispatch: Function, id: string) {
        Line.makeTempPoly(latlng, dispatch, id);
        dispatch(setAddLine(true));
    }
    static handleDeleteMufta(muftsArr: IDrawArr[], polyArr: IPolyLinesArr[], id: string, dispatch: Function) {
        const idx = muftsArr.findIndex(item => item.id === id);
        const item = muftsArr[idx];
        const polylinesIndexOwner = polyArr.map((line, index) => {
            if (line.owner === item.id) {
                return index;
            } else {
                return -1;
            }
        }).filter(index => index !== -1);
        const polylinesIndexTo = polyArr.map((line, index) => {
            if (line.to === item.id) {
                return index;
            } else {
                return -1;
            }
        }).filter(index => index !== -1);
        const indexesPoly = [...polylinesIndexOwner, ...polylinesIndexTo];
        Mufta.deleteMufta(idx, indexesPoly, dispatch);
    }
    static handleAddLineTo(tempPoly: IPolyLinesArr, latlng: IDrawItemLatLng, id: string, dispatch: Function) {
        Line.makePoly(tempPoly, latlng, dispatch, id);
        dispatch(setAddLine(false));
    }


}