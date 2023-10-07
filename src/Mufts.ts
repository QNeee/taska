import { v4 as uuidv4 } from 'uuid';
import { deleteMufta, drawMufta } from './Redux/map/mapSlice';
import L from 'leaflet';

const iconUrl =
    'https://c0.klipartz.com/pngpicture/720/285/gratis-png-punto-rojo-redondo-bandera-de-japon-bandera-de-japon-s-thumbnail.png';
export interface ICustomMarker extends L.Marker {
    id?: string;
}

export class Mufts {
    static addMuft(muft: ICustomMarker, dispatch: Function) {
        muft.id = uuidv4();
        muft.setIcon(new L.Icon({
            iconUrl: iconUrl,
            iconSize: [30, 30],
        }));
        dispatch(drawMufta(muft));
    }
    static deleteMufta(mufts: ICustomMarker[], dispatch: Function) {
        dispatch(deleteMufta(mufts));
    }
}