import { IPolyLinesArr, makeDrawCube } from "./Redux/app/appSlice";

export interface ICube {
    lat: number,
    lng: number,
    id: string,
    owner: string,
    to: string,
    type: string,
}
export class Cube {
    constructor(private cube: ICube) {
    }
    getCube() {
        return this.cube;
    }
}
export class Cubes {
    static addCube(obj: ICube, dispatch: Function, newArr: IPolyLinesArr[] | undefined) {
        dispatch(makeDrawCube({ obj, newArr }));
    }
}