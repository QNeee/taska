import { v4 as uuidv4 } from 'uuid';
import { deleteMufta, updateMufta } from './Redux/map/mapSlice';
import L from 'leaflet';


const iconUrl =
    'https://c0.klipartz.com/pngpicture/720/285/gratis-png-punto-rojo-redondo-bandera-de-japon-bandera-de-japon-s-thumbnail.png';
export interface ICustomMarker extends L.Marker {
    id?: string;
    linesIds?: string[]
}
export interface IMarkerInfo {

}
export class Mufts {
    muft: ICustomMarker | null = null;
    constructor(private muftObj: ICustomMarker) {
        this.muft = new L.Marker(muftObj.getLatLng(), { icon: L.icon({ iconUrl: iconUrl, iconSize: [30, 30] }) })
        this.muft.id = uuidv4();
        this.muft.linesIds = [];
    }
    getMuft() {
        return this.muft;
    }
    static updateMuft(dispatch: Function, muftOwner: ICustomMarker, muftTo: ICustomMarker, line1Id: string, oldId?: string, line2Id?: string) {
        if (oldId) {
            const indexOwnerLineId = muftOwner.linesIds?.findIndex(item => item === oldId) as number;
            const indexToLineId = muftTo.linesIds?.findIndex(item => item === oldId) as number;
            muftOwner.linesIds?.splice(indexOwnerLineId, 1);
            muftTo.linesIds?.splice(indexToLineId, 1);
            muftOwner.linesIds?.push(line1Id as string, line2Id as string);
            muftTo.linesIds?.push(line1Id as string, line2Id as string);
            dispatch(updateMufta({ idOwner: muftOwner?.id, idTo: muftTo?.id, data: [muftTo, muftOwner] }));

        } else {
            muftTo?.linesIds?.push(line1Id);
            muftOwner?.linesIds?.push(line1Id);
            dispatch(updateMufta({ idOwner: muftOwner?.id, idTo: muftTo?.id, data: [muftTo, muftOwner] }));
        }
    }
    static deleteMufta(mufts: ICustomMarker[], dispatch: Function) {
        dispatch(deleteMufta(mufts));
    }
}