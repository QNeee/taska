import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { ICustomCube } from "../Cubes";
import { ICustomPolyline, Polylines } from "../Polylines";
import { IItemInfoPoly, setHideCubes } from "../Redux/map/mapSlice";
import { ICustomMarker, Mufts } from "../Mufts";
import { FiberOptic, IFiberOptic, IObjFiberOptic } from "../fiberOptic";
import { ICustomWardrobe, Wardrobe } from "../Wardrobe";
export function roundLatLng(latLng: LatLng, decimalPlaces: number) {
    const lat = latLng.lat.toFixed(decimalPlaces);
    const lng = latLng.lng.toFixed(decimalPlaces);
    return L.latLng(parseFloat(lat), parseFloat(lng));
}
export class CubeInterface {
    static handleDoubleClick(e: LeafletMouseEvent, dispatch: Function, index: number, mufts: ICustomMarker[], cube: ICustomCube) {

    }
    static handleCubeOnClick(cubesArr: ICustomCube[], mufts: ICustomMarker[], cube: ICustomCube, polyLines: ICustomPolyline[], wardrobes: ICustomWardrobe[]) {
        const needMufts = mufts.filter(item => item.cubesIds?.includes(cube.id as string));
        const owner = needMufts.find(item => item.id === cube.owner) as ICustomMarker;
        let to: ICustomMarker | ICustomWardrobe;
        const muftTo = needMufts.find(item => item.id === cube.to) as ICustomMarker;
        if (!muftTo) {
            to = wardrobes.find(item => item.id === cube.to) as ICustomWardrobe;
        } else {
            to = muftTo;
        }
        const ownerFibers = owner.fibers;
        const toFibers = to.fibers;
        const ownerLines = owner.linesIds as string[];
        const toLines = to.linesIds as string[];
        const commonLines = ownerLines.filter(lineId => toLines.includes(lineId));
        const needPolys = polyLines.filter(line => commonLines.some(item => line.id === item));
        const polys = [...polyLines];
        const cubes = [...cubesArr];
        const cubIndex = cubes.findIndex(item => item.id === cube.id);
        cubes.splice(cubIndex, 1);
        const lineInfo = {
            owner: owner.id,
            to: to.id,
        }
        const oldPolys: LatLng[] = [];
        const oldIds: string[] = [];
        for (const poly of needPolys) {
            if (poly.getBounds().contains(cube.getLatLng())) {
                oldIds.push(poly.id as string);
                if (!cube.getLatLng().equals(poly.getLatLngs()[0] as LatLng)) {
                    oldPolys.push(poly.getLatLngs()[0] as LatLng);
                } else {
                    oldPolys.push(poly.getLatLngs()[1] as LatLng);
                }
            }
        }
        const line = new Polylines(oldPolys, lineInfo as IItemInfoPoly).getLine();
        const fiberOpticInfo = {
            latlng: [line?.getLatLngs()[0], line?.getLatLngs()[1]],
            owner: line?.owner,
            to: line?.to,
            lineId: line?.id,
        } as IObjFiberOptic
        const fiber = new FiberOptic(fiberOpticInfo).getFiberOptic();
        const polyIndex1 = polys.findIndex(item => item.id === oldIds[0]);
        const fiberOwnerIndex1 = ownerFibers?.findIndex(item => item.lineId === oldIds[0]) as number;
        const fiberToIndex1 = toFibers?.findIndex(item => item.lineId === oldIds[0]) as number;
        ownerFibers?.splice(fiberOwnerIndex1, 1);
        toFibers?.splice(fiberToIndex1, 1);
        polys.splice(polyIndex1, 1);
        const polyIndex2 = polys.findIndex(item => item.id === oldIds[1]);
        const fiberOwnerIndex2 = ownerFibers?.findIndex(item => item.lineId === oldIds[0]) as number;
        const fiberToIndex2 = toFibers?.findIndex(item => item.lineId === oldIds[1]) as number;
        ownerFibers?.splice(fiberOwnerIndex2, 1);
        toFibers?.splice(fiberToIndex2, 1);
        polys.splice(polyIndex2, 1);
        polys.push(line as ICustomPolyline);
        ownerFibers?.push(fiber as IFiberOptic);
        toFibers?.push(fiber as IFiberOptic);
        let data;
        if (to.type === 'muft') {
            data = Mufts.updateMuftCube(owner, to, line?.id as string, cube.id as string, oldIds);
        } else {
            data = Wardrobe.updateMuftCube(owner, to, line?.id as string, cube.id as string, oldIds);
        }
        return {
            idOwner: data.idOwner, idTo: data.idTo, data: data.data, polys, cubes: cubes as ICustomCube[],
            to
        };

    }

    static handleDeleteCube(id: string) {

    }
    static handleHideCubes(dispatch: Function) {
        dispatch(setHideCubes(true));
    }
    static handleCubeDrag(e: L.LeafletEvent, polyLines: ICustomPolyline[], index: number, cubes: ICustomCube[], mufts: ICustomMarker[], cubic: ICustomCube) {
        const latLng = e.target.getLatLng() as LatLng;
        const newArr = [...polyLines];
        const indexOwner = mufts.findIndex(item => item.id === cubic.owner);
        const fibers = mufts[indexOwner]?.fibers;
        newArr.forEach((line, lineIndex) => {
            const startLine = line.getLatLngs()[0];
            const endLine = line.getLatLngs()[1];
            if (cubic.getLatLng().equals(startLine as LatLng)) {
                newArr[lineIndex].setLatLngs([latLng, endLine as LatLng]);
            } else if (cubic.getLatLng().equals(endLine as LatLng)) {
                newArr[lineIndex].setLatLngs([startLine as LatLng, latLng]);
            }
        });
        if (fibers) fibers.forEach((item, indexItem) => {
            const startLine = item.getLatLngs()[0];
            const endLine = item.getLatLngs()[1];
            if (cubic.getLatLng().equals(startLine as LatLng)) {
                fibers[indexItem].setLatLngs([latLng, endLine as LatLng]);
            } else if (cubic.getLatLng().equals(endLine as LatLng)) {
                fibers[indexItem].setLatLngs([startLine as LatLng, latLng as LatLng]);
            }
        })
        const obj = [...cubes];
        obj.forEach((item) => {
            if (item.id === cubic.id) {
                item.setLatLng(latLng);
            }
        })
        const objToUpdate = {
            newArr,
            cubes: obj,
            index: indexOwner,
            muft: mufts[indexOwner]
        }
        return objToUpdate;

    }

}