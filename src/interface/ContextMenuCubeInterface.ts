import { ICustomCube } from "../Cubes";
import { ICustomPolyline } from "../Polylines";
import { setCubeMenu } from "../Redux/app/appSlice";
import { IDrawItemLatLng } from "./ContextMenuInterface";

export class ContextMenuCubeInterface {

    static handleClickDelete(latlng: IDrawItemLatLng, dispatch: Function, polyLines: ICustomPolyline[], id: string, cubes: ICustomCube[]) {
        // const item = cubes.find(item => item.id === id);
        // // const index = polyLines.findIndex(line => line.start?.lat === item?.lat);
        // const newArr = [...polyLines];
        // console.log(item);
        // newArr.forEach((line, index) => {
        //     if (line.start?.lat === item?.lat) {
        //         console.log(newArr[index]);
        //     }
        // })
    }
    static handleClickClose(dispatch: Function) {
        dispatch(setCubeMenu(false));
    }
}