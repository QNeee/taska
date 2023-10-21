import { LatLng } from "leaflet";
import { ILineStart } from "../Redux/map/mapSlice";
import { ICustomPolyline, Polylines } from "../Polylines";
import { ICustomMarker, IMainLine, IStatsMainLine, MainLine, Mufts } from "../Mufts";
import { ICustomCube } from "../Cubes";
import { ICoords } from "../components/Map/ContextMenu";
import { FiberOptic, IFiberOptic, IObjFiberOptic } from "../fiberOptic";
import { ICustomWardrobe } from "../Wardrobe";

export interface IDrawItemLatLng {
    lat: number,
    lng: number
}


export class ContextMenuMuftaInterface {
    static OpenMenu() {
        return {
            muft: true,
            cube: false,
            poly: false,
            wardrobes: false,
            general: false
        }
    }
    static handleAddLineFrom(mufts: ICustomMarker[], id: string) {
        const mufta = mufts.find(item => item.id === id);
        const muftaLatLnt = mufta?.getLatLng();
        const aditInfo = {
            id: mufta?.id,
            latlng: new LatLng(muftaLatLnt?.lat as number, muftaLatLnt?.lng as number)
        }
        return aditInfo;
    }
    static handleDeleteMufta(muftsArr: ICustomMarker[], id: string, polyLines: ICustomPolyline[], cubes: ICustomCube[], wardrobes: ICustomWardrobe[]) {
        const mufts = [...muftsArr];
        const wardrobesArr = [...wardrobes];
        const index = muftsArr.findIndex(item => item.id === id);
        const mufta = mufts[index];
        const muftLinesIds = mufta.linesIds;
        const muftCubesIds = mufta.cubesIds;
        mufts.splice(index, 1);
        const items = [...mufts, ...wardrobesArr];
        const to = items.filter(muft => muftLinesIds?.some(line => muft.linesIds?.includes(line)) || muftCubesIds?.some(cube => muft.cubesIds?.includes(cube)));
        const polysIds = polyLines.filter(line => mufta.linesIds?.includes(line.id as string));
        const cubesIds = cubes.filter(cube => mufta.cubesIds?.includes(cube.id as string));
        const polys = [...polyLines];
        const cubics = [...cubes];
        for (const items of to) {
            const index = items.mainLines?.findIndex(t => mufta.mainLines?.some(o => t.id === o.id)) as number;
            if (index !== -1) items.mainLines?.splice(index, 1);
            for (const poly of polysIds) {
                if (items.linesIds?.includes(poly.id as string)) {
                    const indexPoly = items.linesIds.findIndex(item => item === poly.id);
                    if (indexPoly !== -1) {
                        items.linesIds.splice(indexPoly, 1);
                    }

                    const index = polys.findIndex(item => item.id === poly.id);
                    polys.splice(index, 1);
                }
            }
            for (const cube of cubesIds) {
                if (items.cubesIds?.includes(cube.id as string)) {
                    const indexCube = items.cubesIds.findIndex(item => item === cube.id);
                    if (indexCube !== -1) {
                        items.cubesIds.splice(indexCube, 1);
                    }

                    const index = cubics.findIndex(item => item.id === cube.id);
                    cubics.splice(index, 1);
                }
            }
        }
        return { mufts, polyLines: polys, cubes: cubics, wardrobes };
    }
    static handleApplyCoordinates(id: string, mufts: ICustomMarker[], form: ICoords, polyLines?: ICustomPolyline[]) {
        const index = mufts.findIndex(item => item.id === id);
        const data = mufts[index];
        data.drag = !data.drag;
        data.setLatLng({ lat: form.lat, lng: form.lng });
        return { index, data };
    }
    static handleAddLineTo(mufts: ICustomMarker[], id: string, lineStart: ILineStart | null, fiberCounts: number, form: IStatsMainLine) {
        const muftaTo = mufts.find(item => item.id === id);
        const muftaOwner = mufts.find(item => item.id === lineStart?.id);
        const muftaLatLng = muftaTo?.getLatLng() as LatLng;
        const ownerLatLng = lineStart?.latlng as LatLng;
        const additionalInfo = {
            owner: lineStart?.id as string,
            to: muftaTo?.id as string,
        }
        const polyLine = new Polylines([muftaLatLng, ownerLatLng], additionalInfo).getLine();
        const mainLineObj = {
            owner: lineStart?.id as string,
            to: muftaTo?.id as string,
            producer: form.producer,
            standart: form.standart,
            fiberOpticsCount: fiberCounts,
        }
        const mainLine = new MainLine(mainLineObj).getMainLine() as IMainLine;
        const fiberOpticInfo = {
            latlng: [muftaLatLng, ownerLatLng],
            owner: lineStart?.id,
            to: muftaTo?.id,
            lineId: polyLine?.id,
        } as IObjFiberOptic
        const fiberOptic = new FiberOptic(fiberOpticInfo).getFiberOptic() as IFiberOptic;
        if (muftaOwner && muftaTo) {
            muftaOwner.fibers?.push(fiberOptic);
            muftaTo?.fibers?.push(fiberOptic);
            muftaOwner.mainLines?.push(mainLine);
            muftaTo?.mainLines?.push(mainLine);
        }
        const { data, idOwner, idTo } = Mufts.updateMuftLine(muftaOwner as ICustomMarker, muftaTo as ICustomMarker, polyLine?.id as string);
        return { data, idOwner, idTo, polyLine };
    }
}