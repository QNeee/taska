import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { ICustomCube } from "../Cubes";
import { ICustomPolyline, Polylines } from "../Polylines";
import { setCubeMenu } from "../Redux/app/appSlice";
import { IItemInfoPoly, setContextMenuXY, setGeneralMenu, setHideCubes, setMuftaMenuOpen, setPolylineMenuOpen } from "../Redux/map/mapSlice";
import { ICustomMarker, Mufts } from "../Mufts";
export function roundLatLng(latLng: LatLng, decimalPlaces: number) {
    const lat = latLng.lat.toFixed(decimalPlaces);
    const lng = latLng.lng.toFixed(decimalPlaces);
    return L.latLng(parseFloat(lat), parseFloat(lng));
}
export class CubeInterface {
    static handleDoubleClick(e: LeafletMouseEvent, dispatch: Function, index: number, mufts: ICustomMarker[], cube: ICustomCube) {

    }
    static handleCubeOnClick(cubesArr: ICustomCube[], mufts: ICustomMarker[], cube: ICustomCube, polyLines: ICustomPolyline[]) {
        const needMufts = mufts.filter(item => item.cubesIds?.includes(cube.id as string));
        const owner = needMufts.find(item => item.id === cube.owner) as ICustomMarker;
        const to = needMufts.find(item => item.id === cube.to) as ICustomMarker;
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
        const polyIndex1 = polys.findIndex(item => item.id === oldIds[0]);
        polys.splice(polyIndex1, 1);
        const polyIndex2 = polys.findIndex(item => item.id === oldIds[1]);
        polys.splice(polyIndex2, 1);
        polys.push(line as ICustomPolyline);
        const data = Mufts.updateMuftCube(owner, to, line?.id as string, cube.id as string, oldIds);
        return {
            idOwner: data.idOwner, idTo: data.idTo, data: data.data, polys, cubes: cubes as ICustomCube[]

        };

    }

    static handleCubeContextMenu(e: L.LeafletMouseEvent, dispatch: Function) {
        e.originalEvent.preventDefault();
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        dispatch(setMuftaMenuOpen(false));
        dispatch(setGeneralMenu(false));
        dispatch(setPolylineMenuOpen(false));
        dispatch(setCubeMenu(true));
    }
    static handleDeleteCube(id: string) {

    }
    static handleHideCubes(dispatch: Function) {
        dispatch(setHideCubes(true));
    }
    static handleCubeDrag(e: L.LeafletEvent, polyLines: ICustomPolyline[], index: number, cubes: ICustomCube[], mufts: ICustomMarker[], cubic: ICustomCube) {
        const latLng = e.target.getLatLng();
        const newArr = [...polyLines];
        newArr.forEach((line, lineIndex) => {
            const startLine = line.getLatLngs()[0];
            const endLine = line.getLatLngs()[1];
            if (cubic.getLatLng().equals(startLine as LatLng)) {
                newArr[lineIndex].setLatLngs([latLng, endLine as LatLng]);
            } else if (cubic.getLatLng().equals(endLine as LatLng)) {
                newArr[lineIndex].setLatLngs([startLine as LatLng, latLng]);
            }
        });
        const obj = [...cubes];
        obj.forEach((item) => {
            if (item.id === cubic.id) {
                item.setLatLng(latLng);
            }
        })
        const objToUpdate = {
            indexCircle: index,
            newArr,
            cubes: obj
        }
        return objToUpdate;

    }

}