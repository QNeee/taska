import { v4 as uuidv4 } from 'uuid';
import { deleteMufta, updateMufta } from './Redux/map/mapSlice';
import L from 'leaflet';


const iconUrl =
    'https://c0.klipartz.com/pngpicture/720/285/gratis-png-punto-rojo-redondo-bandera-de-japon-bandera-de-japon-s-thumbnail.png';
export interface ICustomMarker extends L.Marker {
    id?: string;
    linesIds?: string[];
    cubesIds?: string[];
}
export interface IMarkerInfo {

}
export class Mufts {
    muft: ICustomMarker | null = null;
    constructor(private muftObj: ICustomMarker) {
        this.muft = new L.Marker(muftObj.getLatLng(), { icon: L.icon({ iconUrl: iconUrl, iconSize: [30, 30] }) })
        this.muft.id = uuidv4();
        this.muft.linesIds = [];
        this.muft.cubesIds = [];
    }
    getMuft() {
        return this.muft;
    }
    static updateMuftCube(dispatch: Function, muftOwner: ICustomMarker, muftTo: ICustomMarker, lineId: string, cubeId: string, oldIds: string[]) {
        const muftsLinesOwner = muftOwner.linesIds as string[];
        const muftsLinesTo = muftTo.linesIds as string[];
        const muftCubesOwner = muftOwner.cubesIds as string[];
        const muftCubesTo = muftTo.cubesIds as string[];
        const indexLine1Owner = muftsLinesOwner.findIndex(item => item === oldIds[0]);
        muftsLinesOwner.splice(indexLine1Owner, 1)
        const indexLine2Owner = muftsLinesOwner.findIndex(item => item === oldIds[1]);
        muftsLinesOwner.splice(indexLine2Owner, 1)
        const indexLine1To = muftsLinesTo.findIndex(item => item === oldIds[0]);
        muftsLinesTo.splice(indexLine1To, 1)
        const indexLine2To = muftsLinesTo.findIndex(item => item === oldIds[1]);
        muftsLinesTo.splice(indexLine2To, 1)
        muftsLinesOwner.push(lineId);
        muftsLinesTo.push(lineId);
        const indexOwner = muftCubesOwner.findIndex(item => item === cubeId);
        const indexTo = muftCubesTo.findIndex(item => item === cubeId);
        muftCubesOwner.splice(indexOwner, 1)
        muftCubesTo.splice(indexTo, 1)
        dispatch(updateMufta({ idOwner: muftOwner?.id, idTo: muftTo?.id, data: [muftTo, muftOwner] }));
    }
    static updateMuftLine(dispatch: Function, muftOwner: ICustomMarker, muftTo: ICustomMarker, line1Id: string, oldId?: string, line2Id?: string, cubeId?: string) {
        if (oldId) {
            const indexOwnerLineId = muftOwner.linesIds?.findIndex(item => item === oldId) as number;
            const indexToLineId = muftTo.linesIds?.findIndex(item => item === oldId) as number;
            muftOwner.linesIds?.splice(indexOwnerLineId, 1);
            muftTo.linesIds?.splice(indexToLineId, 1);
            muftTo?.linesIds?.push(line1Id as string, line2Id as string);
            muftOwner?.linesIds?.push(line1Id as string, line2Id as string);
            muftTo?.cubesIds?.push(cubeId as string);
            muftOwner?.cubesIds?.push(cubeId as string);
        } else {
            muftTo?.linesIds?.push(line1Id);
            muftOwner?.linesIds?.push(line1Id);
        }
        dispatch(updateMufta({ idOwner: muftOwner?.id, idTo: muftTo?.id, data: [muftTo, muftOwner] }));

    }
    static deleteMufta(mufts: ICustomMarker[], dispatch: Function) {
        dispatch(deleteMufta(mufts));
    }
}