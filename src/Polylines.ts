import { v4 as uuidv4 } from 'uuid';
import L, { LatLng } from 'leaflet';
import { ICubicHelper, IItemInfoPoly, IUpdateObjMufts, addCubePoly, drawPolyline } from './Redux/map/mapSlice';
import { ICustomMarker } from './Mufts';
export interface ICustomPolyline extends L.Polyline {
    id?: string;
    owner?: string;
    start?: LatLng;
    end?: LatLng;
    to?: string;
    cubeId?: string;
    muftPoly?: boolean;
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
        this.line.cubeId = objInfo.cubeId;
        this.line.muftPoly = muftPoly;
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
    // static getDistanceToMarker(markerLatLng: LatLng, clickLatLng: LatLng, polyLines: ICustomPolyline[], map: L.Map) {
    //     let totalDistance = 0;
    //     for (const line of polyLines) {
    //         const latLngs = line.getLatLngs() as LatLng[];
    //         let distanceFromMarker = 0;
    //         let distanceFromClick = 0; // Ініціалізуємо відстань від clickLatLng до найближчої точки на лінії
    //         for (let i = 1; i < latLngs.length; i++) {
    //             const start = latLngs[i - 1] as LatLng;
    //             const end = latLngs[i] as LatLng;
    //             const distanceToStart = markerLatLng.distanceTo(start);
    //             const distanceToEnd = markerLatLng.distanceTo(end);
    //             if (distanceToStart <= distanceToEnd) {
    //                 distanceFromMarker += distanceToStart;
    //             } else {
    //                 distanceFromMarker += distanceToEnd;
    //             }
    //         }

    //         // Знаходимо найближчу точку на лінії до clickLatLng
    //         const closestPoint = L.GeometryUtil.closest(map, line, clickLatLng);
    //         const distanceFromClick = clickLatLng.distanceTo({ lat: closestPoint?.lat as number, lng: closestPoint?.lng as number }); // Отримуємо відстань від clickLatLng до найближчої точки на лінії
    //         totalDistance += Math.min(distanceFromMarker, distanceFromClick);
    //     }
    //     return totalDistance;
    // }
    static getSumVectors(x1: number, y1: number, x2: number, y2: number) {
        return { x: x1 + x2, y: y1 + y2 };
    }
    static getPolyCenter(latlng: LatLng[]): LatLng | null {
        if (latlng.length < 2) {
            return null;
        }
        const centerLat = (latlng[0].lat + latlng[1].lat) / 2;
        const centerLng = (latlng[0].lng + latlng[1].lng) / 2;
        return { lat: centerLat, lng: centerLng } as LatLng
    }
    static updatePolyLine(polyLine: ICustomPolyline) {
        return uuidv4();
    }
    static addPolyline(polyLine: ICustomPolyline[] | ICustomPolyline, dispatch: Function, muftInfo?: IItemInfoPoly | ICubicHelper) {
        if (Array.isArray(polyLine)) {
            polyLine.forEach((item, index) => {
                item.options.weight = 4;
                item.options.color = 'red';
            })
        } else {
            polyLine.id = uuidv4();
            if (typeof muftInfo === 'object') {
                polyLine.owner = muftInfo?.owner as string;
                polyLine.to = muftInfo?.to as string;
            }
            polyLine.options.weight = 4;
            polyLine.options.color = 'red';
        }
        dispatch(addCubePoly(muftInfo));
        dispatch(drawPolyline(polyLine));
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