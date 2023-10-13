
import { setCubeMenu } from "../Redux/app/appSlice";
import { setHideCubes } from "../Redux/map/mapSlice";

export class ContextMenuCubeInterface {

    static handleHieCubes(dispatch: Function) {
        dispatch(setHideCubes(true));
    }
    static handleClickClose(dispatch: Function) {
        dispatch(setCubeMenu(false));
    }
}