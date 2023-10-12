import { v4 as uuidv4 } from 'uuid';
import L, { LatLng } from "leaflet";
import { IUpdateObjCubes, updateCubes } from './Redux/map/mapSlice';
export interface ICustomCube extends L.Marker {
    id?: string;
    owner?: string;
    start?: LatLng;
    end?: LatLng;
    to?: string;
    distanceToOwner?: number,
    distanceToTo?: number,
    countOwner?: number,
    countTo?: number,
    lineIds?: string,
    drager?: boolean,
}
export interface ICubic {
    id?: string,
    owner: string,
    lat: number,
    lng: number,
    to: string,
}
export const iconUrl1 = 'https://cdn.icon-icons.com/icons2/605/PNG/512/square-cut_icon-icons.com_56037.png';
export class Cubes {
    cubic: ICustomCube | null = null;

    constructor(private cubicObj: ICustomCube, cubicInfo: any) {
        this.cubic = L.marker(cubicObj.getLatLng(), { icon: L.icon({ iconUrl: iconUrl1, iconSize: [25, 25] }) });
        this.cubic.id = uuidv4();
        this.cubic.owner = cubicInfo.owner;
        this.cubic.to = cubicInfo.to;
    }
    static changeCubeDragable() {

    }
    getCub() {
        return this.cubic;
    }
    static updateCube(dispatch: Function, obj: IUpdateObjCubes) {
        const objToUpdate = {
            indexCircle: obj.index,
            newArr: obj.newArr,
            cubes: obj.cubes
        }
        dispatch(updateCubes(objToUpdate));
    }
}
