
import { ICustomCube } from "../Cubes";
import { setCubeMenu } from "../Redux/app/appSlice";
import { setHideCubes } from "../Redux/map/mapSlice";

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