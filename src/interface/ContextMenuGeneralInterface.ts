
import { IMuftaData, Mufta } from "../Mufta";
import { setGeneralMenu } from "../Redux/app/appSlice";

export class ContextMenuGeneralInterface {
    static handleMenuClickMufta(obj: IMuftaData, dispatch: Function) {
        Mufta.add(obj, dispatch);
    }
    static handleOnCloseGeneralMenu(dispatch: Function) {
        dispatch(setGeneralMenu(false));
    }
}