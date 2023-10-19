import { LatLng } from "leaflet";
import { Color, ILineStart } from "../Redux/map/mapSlice";
import { ICustomPolyline, Polylines } from "../Polylines";
import { ICustomMarker, IMainLine, IStatsMainLine, MainLine, Mufts } from "../Mufts";
import { ICustomCube } from "../Cubes";
import { ICoords } from "../components/Map/ContextMenu";
import { FiberOptic, IFiberOptic, IObjFiberOptic } from "../fiberOptic";

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
    static handleDeleteMufta(muftsArr: ICustomMarker[], id: string, polyLines: ICustomPolyline[], cubes: ICustomCube[]) {
        const mufts = [...muftsArr];
        const index = muftsArr.findIndex(item => item.id === id);
        const mufta = mufts[index];
        const muftLinesIds = mufta.linesIds;
        const muftCubesIds = mufta.cubesIds;
        mufts.splice(index, 1);
        const to = mufts.filter(muft => muftLinesIds?.some(line => muft.linesIds?.includes(line)) || muftCubesIds?.some(cube => muft.cubesIds?.includes(cube)));
        const polysIds = polyLines.filter(line => mufta.linesIds?.includes(line.id as string));
        const cubesIds = cubes.filter(cube => mufta.cubesIds?.includes(cube.id as string));
        const polys = [...polyLines];
        const cubics = [...cubes];
        for (const muft of to) {
            const index = muft.mainLines?.findIndex(t => mufta.mainLines?.some(o => t.id === o.id)) as number;
            if (index !== -1) muft.mainLines?.splice(index, 1);
            for (const poly of polysIds) {
                if (muft.linesIds?.includes(poly.id as string)) {
                    const indexPoly = muft.linesIds.findIndex(item => item === poly.id);
                    if (indexPoly !== -1) {
                        muft.linesIds.splice(indexPoly, 1);
                    }

                    const index = polys.findIndex(item => item.id === poly.id);
                    polys.splice(index, 1);
                }
            }
            for (const cube of cubesIds) {
                if (muft.cubesIds?.includes(cube.id as string)) {
                    const indexCube = muft.cubesIds.findIndex(item => item === cube.id);
                    if (indexCube !== -1) {
                        muft.cubesIds.splice(indexCube, 1);
                    }

                    const index = cubics.findIndex(item => item.id === cube.id);
                    cubics.splice(index, 1);
                }
            }
        }
        return { mufts, polyLines: polys, cubes: cubics };
    }
    static handleApplyCoordinates(id: string, mufts: ICustomMarker[], form: ICoords, polyLines?: ICustomPolyline[]) {
        const index = mufts.findIndex(item => item.id === id);
        const data = mufts[index];
        data.drag = !data.drag;
        let polysArr;
        if (polyLines) {
            const polys = [...polyLines];
            if (polys.length > 0) {
                for (const poly of polys) {
                    if (data.getLatLng().equals(poly.getLatLngs()[0] as LatLng)) {
                        poly.setLatLngs([{ lat: form.lat, lng: form.lng }, poly.getLatLngs()[1] as LatLng]);
                    } else if (data.getLatLng().equals(poly.getLatLngs()[1] as LatLng)) {
                        poly.setLatLngs([poly.getLatLngs()[0] as LatLng, { lat: form.lat, lng: form.lng }]);
                    }
                }
            }
            polysArr = polys;
        }
        data.setLatLng({ lat: form.lat, lng: form.lng });
        return { index, data, polysArr };
    }
    static handleAddLineTo(mufts: ICustomMarker[], id: string, lineStart: ILineStart | null, fiberCounts: number, colors: Color[], form: IStatsMainLine) {
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