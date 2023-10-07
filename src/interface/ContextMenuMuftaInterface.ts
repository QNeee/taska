import L, { LatLng } from "leaflet";
import { ICustomMarker, setAddLine } from "../Redux/app/appSlice";
import { ILineStart, setLineStart, setMuftaMenuOpen } from "../Redux/map/mapSlice";
import { Polylines } from "../Polylines";
import { Mufts } from "../Mufts";

export interface IDrawItemLatLng {
    lat: number,
    lng: number
}


export class ContextMenuMuftaInterface {
    static handleOnCloseMuftaMenu(dispatch: Function) {
        dispatch(setMuftaMenuOpen(false));
    }
    static handleAddLineFrom(mufts: ICustomMarker[], dispatch: Function, id: string) {
        const mufta = mufts.find(item => item.id === id);
        const muftaLatLnt = mufta?.getLatLng();
        const aditInfo = {
            id: mufta?.id,
            latlng: new LatLng(muftaLatLnt?.lat as number, muftaLatLnt?.lng as number)
        }
        dispatch(setLineStart(aditInfo));
        dispatch(setAddLine(true));
    }
    static handleDeleteMufta(muftsArr: ICustomMarker[], id: string, dispatch: Function) {
        const mufts = [...muftsArr];
        const index = muftsArr.findIndex(item => item.id === id);
        mufts.splice(index, 1);
        Mufts.deleteMufta(mufts, dispatch);
    }
    static handleAddLineTo(mufts: ICustomMarker[], id: string, dispatch: Function, lineStart: ILineStart | null) {
        const mufta = mufts.find(item => item.id === id);
        const muftaLatLng = mufta?.getLatLng() as LatLng;
        const ownerLatLng = lineStart?.latlng as LatLng;
        const additionalInfo = {
            owner: lineStart?.id as string,
            to: mufta?.id as string
        }
        const polyline = new L.Polyline([muftaLatLng, ownerLatLng]);
        Polylines.addPolyline(polyline, dispatch, additionalInfo as any);
        dispatch(setAddLine(false));
    }
}