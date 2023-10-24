import { LatLng } from "leaflet";
import { ICustomMarker, IMainLine, IStatsMainLine, MainLine } from "../Mufts";
import { ILineStart } from "../Redux/map/mapSlice";
import { ICustomWardrobe, Wardrobe } from "../Wardrobe";
import { ICustomPolyline, Polylines } from "../Polylines";
import { FiberOptic, IFiberOptic, IObjFiberOptic } from "../fiberOptic";
import { ICoords } from "../components/Map/ContextMenu";
import { ICustomCube } from "../Cubes";


export class ContextMenuWardrobe {
    static OpenMenu() {
        return {
            muft: false,
            cube: false,
            poly: false,
            wardrobes: true,
            general: false,
            item: false,
        }
    }
    static handleDeleteWardrobe(muftsArr: ICustomMarker[], id: string, polyLines: ICustomPolyline[], cubes: ICustomCube[], wardrobes: ICustomWardrobe[]) {
        const mufts = [...muftsArr];
        const wardrobesArr = [...wardrobes];
        const index = wardrobesArr.findIndex(item => item.id === id);
        const wardrobe = wardrobesArr[index];
        const muftLinesIds = wardrobe.linesIds;
        const muftCubesIds = wardrobe.cubesIds;
        wardrobesArr.splice(index, 1);
        const items = [...mufts, ...wardrobesArr];
        const to = items.filter(muft => muftLinesIds?.some(line => muft.linesIds?.includes(line)) || muftCubesIds?.some(cube => muft.cubesIds?.includes(cube)));
        const polysIds = polyLines.filter(line => wardrobe.linesIds?.includes(line.id as string));
        const cubesIds = cubes.filter(cube => wardrobe.cubesIds?.includes(cube.id as string));
        const polys = [...polyLines];
        const cubics = [...cubes];
        for (const items of to) {
            const index = items.mainLines?.findIndex(t => wardrobe.mainLines?.some(o => t.id === o.id)) as number;
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
        return { mufts, polyLines: polys, cubes: cubics, wardrobes: wardrobesArr };
    }
    static handleAddLineTo(muftsArr: ICustomMarker[], wardrobesArr: ICustomWardrobe[], id: string, lineStart: ILineStart | null, fiberCounts: number, form: IStatsMainLine) {
        const wardrobe = wardrobesArr.find(item => item.id === id);
        const muftaOwner = muftsArr.find(item => item.id === lineStart?.id);
        const muftaLatLng = wardrobe?.getLatLng() as LatLng;
        const ownerLatLng = lineStart?.latlng as LatLng;
        const additionalInfo = {
            owner: lineStart?.id as string,
            to: wardrobe?.id as string,
        }
        const polyLine = new Polylines([muftaLatLng, ownerLatLng], additionalInfo).getLine();
        const mainLineObj = {
            owner: lineStart?.id as string,
            to: wardrobe?.id as string,
            producer: form.producer,
            // standart: form.standart,
            fiberOpticsCount: fiberCounts,
        }
        const mainLine = new MainLine(mainLineObj).getMainLine() as IMainLine;
        const fiberOpticInfo = {
            latlng: [muftaLatLng, ownerLatLng],
            owner: lineStart?.id,
            to: wardrobe?.id,
            lineId: polyLine?.id,
        } as IObjFiberOptic
        const fiberOptic = new FiberOptic(fiberOpticInfo).getFiberOptic() as IFiberOptic;
        if (muftaOwner && wardrobe) {
            muftaOwner.fibers?.push(fiberOptic);
            wardrobe?.fibers?.push(fiberOptic);
            muftaOwner.mainLines?.push(mainLine);
            wardrobe?.mainLines?.push(mainLine);
        }
        const { data, idOwner, idTo } = Wardrobe.updateWardrobeLine(muftaOwner as ICustomMarker, wardrobe as ICustomMarker, polyLine?.id as string);
        return { data, idOwner, idTo, polyLine };
    }
    static handleApplyCoordinates(id: string, wardrobes: ICustomWardrobe[], form: ICoords, polyLines?: ICustomPolyline[]) {
        const index = wardrobes.findIndex(item => item.id === id);
        const data = wardrobes[index];
        data.drag = !data.drag;
        data.setLatLng({ lat: form.lat, lng: form.lng });
        return { index, data };
    }
}