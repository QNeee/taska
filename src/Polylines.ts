import { v4 as uuidv4 } from 'uuid';
import L, { LatLng } from 'leaflet';
import { IItemInfoPoly, IUpdateObjMufts } from './Redux/map/mapSlice';
import { ICustomMarker } from './Mufts';
export interface ICustomPolyline extends L.Polyline {
    id?: string;
    owner?: string;
    to?: string;
    type?: string;
}
export interface IMuftInfo {
    id: string,
    owner: string,
    to: string;
}
export class Polylines {
    line: ICustomPolyline | null = null;
    constructor(private latlng: LatLng[], objInfo: IItemInfoPoly, muftPoly?: boolean) {
        this.line = new L.Polyline(latlng, {
            color: 'red',
            weight: 4
        });
        this.line.id = uuidv4();
        this.line.owner = objInfo.owner;
        this.line.to = objInfo.to;
        this.line.type = 'polyline'
    }
    static changePolyLineWeight(muftOwner: ICustomMarker, muftTo: ICustomMarker, polyLines: ICustomPolyline[], weight: number) {
        const poly = [...polyLines];
        poly.forEach((line) => {
            if (line.owner === muftOwner.id && line.to === muftTo.id) {
                line.options.weight = weight;
            }
        })
        return poly;
    }
    getLine() {
        return this.line;
    }
    static getLineInfo(owner: string, to: string) {
        return { owner, to };
    }
    static updatePoly(obj: IUpdateObjMufts) {
        const objToUpdate = {
            indexCircle: obj.index,
            newArr: obj.newArr,
            mufts: obj.mufts
        }
        return objToUpdate;
    }
}