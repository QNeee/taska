import { LatLng } from "leaflet";
import { ILineStart } from "../Redux/map/mapSlice";
import { ICustomPolyline, Polylines } from "../Polylines";
import { ICustomMarker, IMainLine, IStatsMainLine, MainLine } from "../Mufts";
import { ICustomCube } from "../Cubes";
import { ICoords } from "../components/Map/ContextMenu";
import { FiberOptic, IFiberOptic } from "../fiberOptic";
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
    static handleAddLineTo(mufts: ICustomMarker[], id: string, lineStart: ILineStart | null, fiberCounts: number, form: IStatsMainLine, wardrobes: ICustomWardrobe[]) {
        let to: ICustomMarker | ICustomWardrobe;
        const muftaTo = mufts.find(item => item.id === id);
        if (!muftaTo) {
            to = wardrobes.find(item => item.id === id) as ICustomWardrobe;
        } else {
            to = muftaTo;
        }
        const muftaOwner = mufts.find(item => item.id === lineStart?.id);
        const muftaLatLng = to?.getLatLng() as LatLng;
        const ownerLatLng = lineStart?.latlng as LatLng;
        const lineInfo = Polylines.getLineInfo(muftaOwner?.id as string, to?.id as string);
        const polyLine = new Polylines([muftaLatLng, ownerLatLng], lineInfo).getLine();
        const mainLineObj = {
            owner: lineStart?.id as string,
            to: to?.id as string,
            producer: form.producer,
            standart: form.standart,
            fiberOpticsCount: fiberCounts,
        }
        const mainLine = new MainLine(mainLineObj).getMainLine() as IMainLine;
        const fiberOpticInfo = FiberOptic.getFiberOpticInfo([muftaLatLng, ownerLatLng], muftaOwner?.id as string, to?.id as string, polyLine?.id as string);
        const fiberOptic = new FiberOptic(fiberOpticInfo).getFiberOptic() as IFiberOptic;
        const needMufts = [muftaOwner, to];
        for (const muft of needMufts) {
            muft?.fibers?.push(fiberOptic);
            muft?.mainLines?.push(mainLine);
            muft?.linesIds?.push(polyLine?.id as string);
        }
        return { type: to.type, data: { mufts, wardrobes }, polyLine };
    }
}