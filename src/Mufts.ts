import { v4 as uuidv4 } from 'uuid';
import L, { LatLng } from 'leaflet';
import { IFiberOptic } from './fiberOptic';
export interface IStatsMainLine {
    producer: string,
    standart: string
}
export interface IMainLine {
    id?: string,
    owner: string,
    to: string,
    fiberOpticsCount?: number,
    producer: string,
    standart: string;
}

const iconUrl =
    'https://c0.klipartz.com/pngpicture/720/285/gratis-png-punto-rojo-redondo-bandera-de-japon-bandera-de-japon-s-thumbnail.png';
export interface ICustomMarker extends L.Marker {
    id?: string;
    linesIds?: string[];
    cubesIds?: string[];
    drag?: boolean;
    type?: string;
    fibers?: IFiberOptic[];
    mainLines?: IMainLine[];
}
export class MainLine {
    mainLine: IMainLine | null = null;
    constructor(private obj: IMainLine) {
        this.mainLine = {
            id: uuidv4(),
            owner: obj.owner,
            to: obj.to,
            fiberOpticsCount: obj.fiberOpticsCount,
            producer: obj.producer,
            standart: obj.standart,
        }
    }
    getMainLine() {
        return this.mainLine;
    }
}
export class Mufts {
    muft: ICustomMarker | null = null;
    constructor(private latLng: LatLng) {
        this.muft = new L.Marker(latLng, { icon: L.icon({ iconUrl: iconUrl, iconSize: [30, 30] }) })
        this.muft.id = uuidv4();
        this.muft.linesIds = [];
        this.muft.cubesIds = [];
        this.muft.drag = true;
        this.muft.type = 'muft'
        this.muft.fibers = [];
        this.muft.mainLines = [];
    }
    getMuft() {
        return this.muft;
    }
    static updateMuftCube(muftOwner: ICustomMarker, muftTo: ICustomMarker, lineId: string, cubeId: string, oldIds: string[]) {
        const updateMuftLines = (muftsLines: string[], oldIds: string[]) => {
            for (const oldId of oldIds) {
                const index = muftsLines.findIndex((item) => item === oldId);
                if (index !== -1) {
                    muftsLines.splice(index, 1);
                }
            }
            muftsLines.push(lineId);
        }

        const updateMuftCubes = (muftCubes: string[], cubeId: string) => {
            const index = muftCubes.findIndex((item) => item === cubeId);
            if (index !== -1) {
                muftCubes.splice(index, 1);
            }
        }

        const muftsLinesOwner = muftOwner.linesIds as string[];
        const muftsLinesTo = muftTo.linesIds as string[];
        const muftCubesOwner = muftOwner.cubesIds as string[];
        const muftCubesTo = muftTo.cubesIds as string[];
        updateMuftLines(muftsLinesOwner, oldIds);
        updateMuftLines(muftsLinesTo, oldIds);
        updateMuftCubes(muftCubesOwner, cubeId);
        updateMuftCubes(muftCubesTo, cubeId);
        return { idOwner: muftOwner?.id as string, idTo: muftTo?.id as string, data: [muftTo, muftOwner] };
    }
    static updateMuftLine(muftOwner: ICustomMarker, muftTo: ICustomMarker, line1Id: string, oldId?: string, line2Id?: string, cubeId?: string) {
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
        return { idOwner: muftOwner?.id as string, idTo: muftTo?.id as string, data: [muftTo, muftOwner] as ICustomMarker[] };
    }
}