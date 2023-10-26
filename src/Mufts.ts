import { v4 as uuidv4 } from 'uuid';
import L, { LatLng } from 'leaflet';
import { IFiberOptic } from './fiberOptic';
export interface IStatsMainLine {
    producer: string,
    moduleCounts: string;
    opticCount?: number;
    colorModule: string;
    colorOptic: string;
}
export interface IInfo {
    adress?: string,
    location?: string,
}
export interface IOptic {
    id?: string,
    signal?: string,
    other?: string,
    mainLine: string,
}
export interface IMainLine {
    id?: string,
    owner: string,
    to: string,
    fiberOpticsCount?: number,
    producer: string,
    colorModule?: string,
    colorOptic?: string,
    moduleCounts?: string,
    length?: number;
    typeOfGasket?: string;
    optics?: IOptic[];
}
const icon = 'https://img.icons8.com/?size=256&id=FkQHNSmqWQWH&format=png';
export interface ICustomMarker extends L.Marker {
    id?: string;
    linesIds?: string[];
    cubesIds?: string[];
    drag?: boolean;
    type?: string;
    fibers?: IFiberOptic[];
    mainLines?: IMainLine[];
    info?: IInfo;
}
export class Optic {
    optic: IOptic | null = null;
    constructor(private obj: IOptic) {
        this.optic = {
            id: uuidv4(),
            mainLine: obj.mainLine
        }
    }
    getOptic() {
        return this.optic;
    }
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
            colorModule: obj.colorModule,
            colorOptic: obj.colorOptic,
            moduleCounts: obj.moduleCounts,
            optics: [],
        }
    }
    getMainLine() {
        return this.mainLine;
    }
}
export class Mufts {
    muft: ICustomMarker | null = null;
    constructor(private latLng: LatLng) {
        this.muft = new L.Marker(latLng, { icon: L.icon({ iconUrl: icon, iconSize: [50, 50] }) })
        this.muft.id = uuidv4();
        this.muft.linesIds = [];
        this.muft.cubesIds = [];
        this.muft.drag = true;
        this.muft.type = 'muft'
        this.muft.fibers = [];
        this.muft.mainLines = [];
        this.muft.info = {};
    }
    getMuft() {
        return this.muft;
    }
    static updateMuftCube(mufts: ICustomMarker[], lineId: string, cubeId: string, oldIds: string[], fiber: IFiberOptic) {
        for (const muft of mufts) {
            const muftLines = muft.linesIds;
            const muftCubes = muft.cubesIds;
            const muftFibers = muft.fibers;
            for (const ids of oldIds) {
                const indexLine = muftLines?.findIndex(item => item === ids) as number;
                muftLines?.splice(indexLine, 1);
                const indexFibr = muftFibers?.findIndex(item => item.lineId === ids) as number;
                muftFibers?.splice(indexFibr, 1);
            }
            muftLines?.push(lineId);
            muftFibers?.push(fiber);
            const cubeIndex = muftCubes?.findIndex(item => item === cubeId) as number;
            if (cubeIndex !== -1) muftCubes?.splice(cubeIndex, 1);
        }
    }
    static updateMuftLine(mufts: ICustomMarker[], ids: string[], fibers: IFiberOptic[], oldId: string, cubeId: string) {
        for (const muft of mufts) {
            const indexFiber = muft.fibers?.findIndex(item => item.lineId === oldId) as number;
            muft.fibers?.splice(indexFiber, 1);
            const indexLine = muft.linesIds?.findIndex(item => item === oldId) as number;
            muft.linesIds?.splice(indexLine, 1);
            for (const id of ids) {
                muft?.linesIds?.push(id);
            }
            for (const fiber of fibers) {
                muft?.fibers?.push(fiber);
            }
            muft.cubesIds?.push(cubeId);
        }
    }
}