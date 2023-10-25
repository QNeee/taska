import L from "leaflet";
import { LatLng } from "leaflet";
import { v4 as uuidv4 } from 'uuid';
import { IFiberOptic } from "./fiberOptic";
import { ICustomMarker, IInfo, IMainLine } from "./Mufts";
export interface ICustomWardrobe extends L.Marker {
    id?: string,
    drag?: boolean;
    type?: string;
    linesIds?: string[];
    cubesIds?: string[];
    fibers?: IFiberOptic[];
    mainLines?: IMainLine[];
    info?: IInfo;
}

const iconUrl = 'https://feshmebel.com.ua/image/cache/wp/gj/Doros/Shaf%20raspashnoj/Promo%203/shkaf-dlya-odezhdy-promo-3-1-1000x1000.webp';
export class Wardrobe {
    wardrobe: ICustomWardrobe | null = null;
    constructor(private latLng: LatLng) {
        this.wardrobe = new L.Marker(latLng, { icon: L.icon({ iconUrl: iconUrl, iconSize: [50, 50] }) })
        this.wardrobe.id = uuidv4();
        this.wardrobe.drag = true;
        this.wardrobe.type = 'wardrobe';
        this.wardrobe.linesIds = [];
        this.wardrobe.cubesIds = [];
        this.wardrobe.fibers = [];
        this.wardrobe.mainLines = [];
        this.wardrobe.info = {};
    }
    getWardrobe() {
        return this.wardrobe;
    }
    static updateMuftCube(muftOwner: ICustomMarker, wardrobe: ICustomMarker | ICustomWardrobe, lineId: string, cubeId: string, oldIds: string[]) {
        const updateWardrobeLines = (muftsLines: string[], oldIds: string[]) => {
            for (const oldId of oldIds) {
                const index = muftsLines.findIndex((item) => item === oldId);
                if (index !== -1) {
                    muftsLines.splice(index, 1);
                }
            }
            muftsLines.push(lineId);
        }

        const updateWardrobeCubes = (muftCubes: string[], cubeId: string) => {
            const index = muftCubes.findIndex((item) => item === cubeId);
            if (index !== -1) {
                muftCubes.splice(index, 1);
            }
        }

        const muftsLinesOwner = muftOwner.linesIds as string[];
        const muftsLinesTo = wardrobe.linesIds as string[];
        const muftCubesOwner = muftOwner.cubesIds as string[];
        const muftCubesTo = wardrobe.cubesIds as string[];
        updateWardrobeLines(muftsLinesOwner, oldIds);
        updateWardrobeLines(muftsLinesTo, oldIds);
        updateWardrobeCubes(muftCubesOwner, cubeId);
        updateWardrobeCubes(muftCubesTo, cubeId);
        return { idOwner: muftOwner?.id as string, idTo: wardrobe?.id as string, data: [wardrobe, muftOwner] };
    }
    static updateWardrobeLine(muftOwner: ICustomMarker, wardrobe: ICustomWardrobe, line1Id: string, oldId?: string, line2Id?: string, cubeId?: string) {
        if (oldId) {
            const indexOwnerLineId = muftOwner.linesIds?.findIndex(item => item === oldId) as number;
            const indexToLineId = wardrobe.linesIds?.findIndex(item => item === oldId) as number;
            muftOwner.linesIds?.splice(indexOwnerLineId, 1);
            wardrobe.linesIds?.splice(indexToLineId, 1);
            wardrobe?.linesIds?.push(line1Id as string, line2Id as string);
            muftOwner?.linesIds?.push(line1Id as string, line2Id as string);
            wardrobe?.cubesIds?.push(cubeId as string);
            muftOwner?.cubesIds?.push(cubeId as string);
        } else {
            wardrobe?.linesIds?.push(line1Id);
            muftOwner?.linesIds?.push(line1Id);
        }
        return { idOwner: muftOwner?.id as string, idTo: wardrobe?.id as string, data: [wardrobe, muftOwner] as ICustomMarker[] };

    }
}