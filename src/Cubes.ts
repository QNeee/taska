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
    type?: string,
}
export interface ICubic {
    id?: string,
    owner: string,
    lat: number,
    lng: number,
    to: string,
}
const icon = 'https://img.icons8.com/?size=256&id=15052&format=png';
export class Cubes {
    cubic: ICustomCube | null = null;

    constructor(private latLng: LatLng, cubicInfo: any) {
        this.cubic = L.marker(latLng, { icon: L.icon({ iconUrl: icon, iconSize: [25, 25] }) });
        this.cubic.id = uuidv4();
        this.cubic.owner = cubicInfo.owner;
        this.cubic.to = cubicInfo.to;
        this.cubic.type = 'cube'
    }

    getCub() {
        return this.cubic;
    }
    static getCubeInfo(owner: string, to: string) {
        return { owner, to }
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
