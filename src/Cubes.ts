import { v4 as uuidv4 } from 'uuid';
import L, { LatLng } from "leaflet";
export interface ICustomCube extends L.Marker {
    id?: string;
    owner?: string;
    start?: LatLng;
    end?: LatLng;
    to?: string;
}
const iconUrl1 = 'https://cdn.icon-icons.com/icons2/605/PNG/512/square-cut_icon-icons.com_56037.png';

export class Cubes {
    static addCube(cube: ICustomCube, dispatch: Function) {
        cube.id = uuidv4();
        cube.setIcon(new L.Icon({
            iconUrl: iconUrl1,
            iconSize: [30, 30],
        }));
        // dispatch(drawMufta(muft));
    }
}
