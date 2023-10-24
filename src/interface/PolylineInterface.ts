import L, { LatLng } from "leaflet";
import { ICustomPolyline, Polylines } from "../Polylines";
import { IItemInfoPoly } from "../Redux/map/mapSlice";
import { Cubes, ICustomCube } from "../Cubes";
import 'leaflet-geometryutil';
import { ICustomMarker, Mufts } from "../Mufts";
import { FiberOptic, IFiberOptic } from "../fiberOptic";
import { ICustomWardrobe } from "../Wardrobe";
export interface IClickData {
    idOwner: string,
    idTo: string,
    data: ICustomMarker[],
    polys: ICustomPolyline[],
    cubes: ICustomCube[],
    to: ICustomMarker | ICustomWardrobe,
}
export class PolylineInterface {
    static handleDbClick(e: L.LeafletMouseEvent) {
        e.originalEvent.preventDefault();
    }
    static handleOnClickPolyline(e: L.LeafletMouseEvent, poly: ICustomPolyline, map: L.Map, polyLines: ICustomPolyline[], cubes: ICustomCube[], index: number, mufts: ICustomMarker[], wardrobes: ICustomWardrobe[]) {
        const filteredMufts = mufts.filter(item => item.id === poly.owner || item.id === poly.to);
        const owner = mufts.find(item => item.id === poly.owner);
        let to: ICustomMarker | ICustomWardrobe;
        const muftTo = mufts.find(item => item.id === poly.to);
        if (!muftTo) {
            to = wardrobes.find(item => item.id === poly.to) as ICustomWardrobe;
            filteredMufts.push(to);
        } else {
            to = muftTo;
        }
        const cubics = cubes.filter(item => item.owner === poly.owner && item.to === poly.to);
        const items = [...cubics, ...mufts, ...wardrobes].filter(item => poly.getBounds().contains(item.getLatLng())) as ICustomMarker[];
        const minorMuft = items.filter(item => item.mainLines?.length === 0);
        const polys = [...polyLines];
        const click = { x: e.originalEvent.clientX, y: e.originalEvent.clientY };
        const clickLatLng = map.containerPointToLatLng(L.point(click.x, click.y));
        const nearestPoint = L.GeometryUtil.closest(map, poly, clickLatLng);
        const cubeLatLng = L.latLng((nearestPoint?.lat!), (nearestPoint?.lng!));
        const lineInfo = Polylines.getLineInfo(poly.owner as string, poly.to as string);
        const cubeInfo = Cubes.getCubeInfo(poly.owner as string, poly.to as string);
        const cube = new Cubes(cubeLatLng, cubeInfo).getCub();
        const needMarkers: ICustomCube[] = [];
        const allMarker = [...items];
        const start = poly.getLatLngs()[0] as LatLng;
        const end = poly.getLatLngs()[1] as LatLng;
        for (const muft of allMarker) {
            if (muft.getLatLng().equals(start) || muft.getLatLng().equals(end)) {
                needMarkers.push(muft);
            }
        }
        needMarkers.splice(1, 0, cube as ICustomCube);
        polys.splice(index, 1);
        const linesId: string[] = [];
        const fibers: IFiberOptic[] = [];
        for (let i = 0; i < needMarkers.length - 1; i++) {
            const startMarker = needMarkers[i].getLatLng() as LatLng;
            const endMarker = needMarkers[i + 1].getLatLng() as LatLng;
            const line = new Polylines([startMarker, endMarker], lineInfo as IItemInfoPoly).getLine()
            const fiberOpticInfo = FiberOptic.getFiberOpticInfo([startMarker, endMarker], poly.owner as string, poly.to as string, line?.id as string)
            const fiber = new FiberOptic(fiberOpticInfo).getFiberOptic() as IFiberOptic;
            polys.push(line as ICustomPolyline);
            linesId.push(line?.id as string);
            fibers.push(fiber);
        }
        if (minorMuft.length > 0) {
            for (const muft of minorMuft) {
                const needPolys = polys.filter(item => item.getBounds().contains(muft.getLatLng()));
                const polyline = needPolys.find(item => item.getBounds().contains(cube?.getLatLng() as LatLng) &&
                    item.getBounds().contains(muft.getLatLng() as LatLng));
                const muftFibers = muft.fibers;
                const muftLines = muft.linesIds;
                const indexLine = muftLines?.findIndex(item => item === poly.id) as number;
                if (indexLine !== -1) muftLines?.splice(indexLine, 1);
                const indexFiber = muftFibers?.findIndex(item => item.lineId === poly.id) as number;
                console.log(indexFiber);
                if (indexFiber !== -1) muftFibers?.splice(indexFiber, 1);
                for (const ids of linesId) {
                    if (ids === polyline?.id) muft.linesIds?.push(ids);
                }
                for (const fibs of fibers) {
                    if (fibs.lineId === polyline?.id) muft.fibers?.push(fibs);
                }
            }
        }

        const newCubes = [...cubes, cube];
        Mufts.updateMuftLine(filteredMufts as ICustomMarker[], linesId, fibers, poly?.id as string, cube?.id as string);
        const newPolys = Polylines.changePolyLineWeight(owner as ICustomMarker, to as ICustomMarker, polys, 4);
        return { type: to.type, data: { mufts, wardrobes }, polys: newPolys as ICustomPolyline[], cubes: newCubes as ICustomCube[] };
    }


    static handleMouseOverPolyline(e: L.LeafletMouseEvent, item: ICustomPolyline, drag: boolean, polylines: ICustomPolyline[], mufts: ICustomMarker[], wardrobes: ICustomWardrobe[]) {
        const owner = mufts.filter(muft => muft.id === item.owner);
        let to;
        const muftTo = mufts.filter(muft => muft.id === item.to);
        if (muftTo.length > 0) {
            to = muftTo;
        } else {
            to = wardrobes.filter(wardrobe => wardrobe.id === item.to);
        }
        const data = Polylines.changePolyLineWeight(owner[0], to[0], polylines, 12);
        return data;
    }
    static handleMouseOutPolyline(e: L.LeafletMouseEvent, item: ICustomPolyline, polylines: ICustomPolyline[], mufts: ICustomMarker[], wardrobes: ICustomWardrobe[]) {
        const owner = mufts.filter(muft => muft.id === item.owner);
        let to;
        const muftTo = mufts.filter(muft => muft.id === item.to);
        if (muftTo.length > 0) {
            to = muftTo;
        } else {
            to = wardrobes.filter(wardrobe => wardrobe.id === item.to);
        }
        const data = Polylines.changePolyLineWeight(owner[0], to[0], polylines, 4);
        return data;
    }
}
