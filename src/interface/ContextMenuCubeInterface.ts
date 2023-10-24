
import { LatLng } from "leaflet";
import { ICustomCube } from "../Cubes";
import { ICustomMarker, Mufts } from "../Mufts";
import { setCubeMenu } from "../Redux/app/appSlice";
import { setHideCubes } from "../Redux/map/mapSlice";
import { ICustomPolyline } from "../Polylines";
import { IFiberOptic } from "../fiberOptic";
import { ICustomWardrobe } from "../Wardrobe";

export class ContextMenuCubeInterface {
    static OpenMenu() {
        return {
            muft: false,
            cube: true,
            poly: false,
            wardrobes: false,
            general: false
        }
    }
    static changeToMufta(id: string, mufts: ICustomMarker[], cubes: ICustomCube[], polyLines: ICustomPolyline[], wardrobes: ICustomWardrobe[]) {
        const cubics = [...cubes];
        const muftas = [...mufts];
        const cubeIndex = cubes.findIndex(item => item.id === id) as number;
        const polys = polyLines.filter(item => item.getBounds().contains(cubics[cubeIndex]?.getLatLng() as LatLng));
        const mufta = new Mufts(cubics[cubeIndex]?.getLatLng() as LatLng).getMuft() as ICustomMarker;
        const owner = muftas.find(item => item.id === polys[0].owner);
        let to: ICustomMarker | ICustomWardrobe;
        const muftTo = muftas.find(item => item.id === polys[0].to);
        if (!muftTo) {
            to = wardrobes.find(item => item.id === polys[0].to) as ICustomWardrobe;
        } else {
            to = muftTo;
        }
        owner?.cubesIds?.splice(cubeIndex, 1);
        to?.cubesIds?.splice(cubeIndex, 1);
        for (const poly of polys) {
            mufta.linesIds?.push(poly.id as string);
            const fiber = owner?.fibers?.find(item => item.lineId === poly.id) as IFiberOptic;
            mufta.fibers?.push(fiber);
        }
        muftas.push(mufta);
        cubics.splice(cubeIndex, 1);
        return { muftas, wardrobes, cubics };
    }
    static getCoords(id: string, cubes: ICustomCube[]) {
        const cube = cubes.find(item => item.id === id);
        return cube?.getLatLng();
    }
    static handleHieCubes(dispatch: Function) {
        dispatch(setHideCubes(true));
    }
    static handleClickClose(dispatch: Function) {
        dispatch(setCubeMenu(false));
    }
}