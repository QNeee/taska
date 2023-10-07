import { v4 as uuidv4 } from 'uuid';
import L, { LatLng } from 'leaflet';
import { IUpdateObj, drawPolyline, updatePoly } from './Redux/map/mapSlice';
export interface ICustomPolyline extends L.Polyline {
    id?: string;
    owner?: string;
    start?: LatLng;
    end?: LatLng;
    to?: string;
}
export interface IMuftInfo {
    id: string,
    owner: string,
    to: string;
}
export class Polylines {
    static updatePolyLine(polyLine: ICustomPolyline) {
        return uuidv4();
    }
    static addPolyline(polyLine: ICustomPolyline, dispatch: Function, muftInfo: IMuftInfo) {
        polyLine.id = uuidv4();
        polyLine.owner = muftInfo.owner;
        polyLine.to = muftInfo.to;
        polyLine.options.weight = 4;
        const latlngStart = polyLine.getLatLngs()[0];
        const latlngEnd = polyLine.getLatLngs()[1];
        polyLine.start = latlngStart as L.LatLng;
        polyLine.end = latlngEnd as L.LatLng;
        dispatch(drawPolyline(polyLine));
    }
    static updatePoly(dispatch: Function, obj: IUpdateObj) {
        const objToUpdate = {
            indexCircle: obj.index,
            newArr: obj.newArr,
            mufts: obj.mufts
        }
        dispatch(updatePoly(objToUpdate));
    }
}