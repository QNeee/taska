import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { ICustomCube } from "../Cubes";
import { ICustomPolyline, Polylines } from "../Polylines";
import { IItemInfoPoly, setHideCubes } from "../Redux/map/mapSlice";
import { ICustomMarker, Mufts } from "../Mufts";
import { FiberOptic, IFiberOptic, IObjFiberOptic } from "../fiberOptic";
import { ICustomWardrobe } from "../Wardrobe";
export function roundLatLng(latLng: LatLng, decimalPlaces: number) {
    const lat = latLng.lat.toFixed(decimalPlaces);
    const lng = latLng.lng.toFixed(decimalPlaces);
    return L.latLng(parseFloat(lat), parseFloat(lng));
}
export class CubeInterface {
    static handleDoubleClick(e: LeafletMouseEvent, dispatch: Function, index: number, mufts: ICustomMarker[], cube: ICustomCube) {

    }
    static handleCubeOnClick(cubesArr: ICustomCube[], mufts: ICustomMarker[], cube: ICustomCube, polyLines: ICustomPolyline[], wardrobes: ICustomWardrobe[]) {
        const filteredMufts = mufts.filter(item => item.cubesIds?.includes(cube.id as string));
        const owner = filteredMufts.find(item => item.id === cube.owner) as ICustomMarker;
        let to: ICustomMarker | ICustomWardrobe;
        const muftTo = filteredMufts.find(item => item.id === cube.to) as ICustomMarker;
        if (!muftTo) {
            to = wardrobes.find(item => item.id === cube.to) as ICustomWardrobe;
            filteredMufts.push(to);
        } else {
            to = muftTo;
        }
        const polys = [...polyLines];
        const needPolys = polys.filter(item => item.owner === owner.id);
        const cubes = [...cubesArr];
        const cubIndex = cubes.findIndex(item => item.id === cube.id);
        cubes.splice(cubIndex, 1);
        const lineInfo = Polylines.getLineInfo(owner.id as string, to.id as string);
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
        const minorMufts = mufts.filter(item => !item.cubesIds?.includes(cube.id as string) && item.linesIds?.some(id => oldIds.some(id1 => id === id1)));
        const line = new Polylines(oldPolys, lineInfo as IItemInfoPoly).getLine() as ICustomPolyline;
        polys.push(line);
        const fiberOpticInfo = FiberOptic.getFiberOpticInfo(line?.getLatLngs() as LatLng[], owner.id as string, to.id as string, line?.id as string) as IObjFiberOptic
        const fiber = new FiberOptic(fiberOpticInfo).getFiberOptic() as IFiberOptic;
        for (const ids of oldIds) {
            const index = polys.findIndex(item => item.id === ids) as number;
            polys.splice(index, 1);
        }
        for (const muft of minorMufts) {
            const muftLines = muft.linesIds;
            const muftFibers = muft.fibers;
            for (const ids of oldIds) {
                const lineIndex = muftLines?.findIndex(item => item === ids) as number;
                const fiberIndex = muftFibers?.findIndex(item => item.lineId === ids) as number;
                if (lineIndex !== -1 && fiberIndex !== -1) {
                    muftLines?.splice(lineIndex, 1);
                    muftFibers?.splice(fiberIndex, 1);
                }
            }
            muftLines?.push(line.id as string);
            muftFibers?.push(fiber);
        }
        Mufts.updateMuftCube(filteredMufts, line?.id as string, cube.id as string, oldIds, fiber);
        return { type: to.type, data: { mufts, wardrobes }, cubes, polys };

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