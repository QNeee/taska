import L, { LatLng } from "leaflet";
import { ICustomPolyline, Polylines } from "../Polylines";
import { IItemInfoPoly } from "../Redux/map/mapSlice";
import { Cubes, ICustomCube } from "../Cubes";
import 'leaflet-geometryutil';
import { ICustomMarker, Mufts } from "../Mufts";
export interface IClickData {
    idOwner: string,
    idTo: string,
    data: ICustomMarker[],
    polys: ICustomPolyline[],
    cubes: ICustomCube[],
}
export class PolylineInterface {
    static handleDbClick(e: L.LeafletMouseEvent) {
        e.originalEvent.preventDefault();
    }
    static handleOnClickPolyline(e: L.LeafletMouseEvent, poly: ICustomPolyline, map: L.Map, polyLines: ICustomPolyline[], cubes: ICustomCube[], index: number, mufts: ICustomMarker[]) {
        const needMufts = mufts.filter(item => item.linesIds?.includes(poly?.id as string));
        const owner = needMufts.find(item => item.id === poly.owner) as ICustomMarker;
        const to = needMufts.find(item => item.id === poly.to) as ICustomMarker;
        const polys = [...polyLines];
        const ownerCubes = cubes.filter(cube => cube.owner === owner?.id);
        const click = { x: e.originalEvent.clientX, y: e.originalEvent.clientY };
        const clickLatLng = map.containerPointToLatLng(L.point(click.x, click.y));
        const nearestPoint = L.GeometryUtil.closest(map, poly, clickLatLng);
        const cubeLatLng = L.latLng((nearestPoint?.lat!), (nearestPoint?.lng!));
        const nearestLatLng = {
            lat: nearestPoint?.lat!,
            lng: nearestPoint?.lng!
        }
        const lineInfo = {
            owner: owner.id,
            to: to.id,
        }
        if (ownerCubes.length === 0) {
            const ownerLatLng: LatLng[] = [owner.getLatLng(), nearestLatLng as LatLng];
            const toLatLng: LatLng[] = [to.getLatLng(), nearestLatLng as LatLng];
            polys.splice(index, 1);
            const line1 = new Polylines(ownerLatLng, lineInfo as IItemInfoPoly, true).getLine();
            const line2 = new Polylines(toLatLng, lineInfo as IItemInfoPoly, true).getLine();

            const cubeInfo = {
                owner: owner.id,
                to: to.id,
            }
            const cube = new Cubes(cubeLatLng, cubeInfo).getCub();
            polys.push(line1 as ICustomPolyline, line2 as ICustomPolyline);
            const newCubes = [...cubes, cube as ICustomCube];
            const data = Mufts.updateMuftLine(owner, to, line1?.id as string, poly.id, line2?.id as string, cube?.id as string);
            const newPolys = Polylines.changePolyLineWeight(owner, to, polys, 4);
            return {
                idOwner: data.idOwner, idTo: data.idTo, data: data.data, polys: newPolys as ICustomPolyline[], cubes: newCubes as ICustomCube[]
            }
        } else {
            const cubeInfo = {
                owner: owner.id,
                to: to.id,
            }
            const cube = new Cubes(cubeLatLng, cubeInfo).getCub();
            const needMarkers: ICustomCube[] = [];
            const start = poly.getLatLngs()[0] as LatLng;
            const end = poly.getLatLngs()[1] as LatLng;
            const allMarker = [...cubes, ...needMufts];
            for (const muft of allMarker) {
                if (muft.getLatLng().equals(start) || muft.getLatLng().equals(end)) {
                    needMarkers.push(muft);
                }
            }
            needMarkers.splice(1, 0, cube as ICustomCube);
            polys.splice(index, 1);
            const linesId: string[] = [];
            for (let i = 0; i < needMarkers.length - 1; i++) {
                const startMarker = needMarkers[i].getLatLng() as LatLng;
                const endMarker = needMarkers[i + 1].getLatLng() as LatLng;
                const line = new Polylines([startMarker, endMarker], lineInfo as IItemInfoPoly).getLine()
                polys.push(line as ICustomPolyline);
                linesId.push(line?.id as string);

            }
            const newCubes = [...cubes, cube];
            const data = Mufts.updateMuftLine(owner, to, linesId[0], poly.id, linesId[1], cube?.id as string);
            const newPolys = Polylines.changePolyLineWeight(owner, to, polys, 4);
            return { idOwner: data.idOwner, idTo: data.idTo, data: data.data, polys: newPolys as ICustomPolyline[], cubes: newCubes as ICustomCube[] };
        }


    }


    static handleMouseOverPolyline(e: L.LeafletMouseEvent, item: ICustomPolyline, drag: boolean, polylines: ICustomPolyline[], mufts: ICustomMarker[]) {
        const owner = mufts.filter(muft => muft.id === item.owner);
        const to = mufts.filter(muft => muft.id === item.to);
        const data = Polylines.changePolyLineWeight(owner[0], to[0], polylines, 12);
        return data;
    }
    static handleMouseOutPolyline(e: L.LeafletMouseEvent, item: ICustomPolyline, polylines: ICustomPolyline[], mufts: ICustomMarker[]) {
        const owner = mufts.filter(muft => muft.id === item.owner);
        const to = mufts.filter(muft => muft.id === item.to);
        const data = Polylines.changePolyLineWeight(owner[0], to[0], polylines, 4);
        return data;
    }
}
