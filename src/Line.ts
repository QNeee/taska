import { Cube, Cubes, ICube } from "./Cube";
import { IDrawArr, IPolyLinesArr, dragLine, setDrawLine } from "./Redux/app/appSlice";
import { iconUrl1 } from "./components/Map/Map";
import { IDrawItemLatLng } from "./interface/ContextMenuInterface";
import { v4 as uuidv4 } from 'uuid';
interface IUpdatePolyObj {
    indexCircle: number;
    newArr: IPolyLinesArr[] | undefined;
    indexAllDataCircle?: number | null;
    obj: IDrawArr
}
interface LatLng {
    lat: number;
    lng: number;
}

export function calculateDistance(latlng1: LatLng, latlng2: LatLng): number {
    const R = 6371;
    const lat1 = (Math.PI / 180) * latlng1.lat;
    const lat2 = (Math.PI / 180) * latlng2.lat;
    const lon1 = (Math.PI / 180) * latlng1.lng;
    const lon2 = (Math.PI / 180) * latlng2.lng;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Відстань в кілометрах

    return distance;
}
export class Line {
    private line: IPolyLinesArr | null = null;

    constructor(private lineToAdd: IPolyLinesArr) {
        this.line = {
            ...this.lineToAdd,
            color: 'red',
            owner: lineToAdd.owner,
            weight: null,
            id: uuidv4(),
            to: lineToAdd.to,
        };
    }

    getLine() {
        return this.line;
    }
}
export class Lines {
    static drawFreeLine(latlng: IDrawItemLatLng, dispatch: Function, polylines: IPolyLinesArr[], id: string) {
        dispatch(setDrawLine(true));
        this.makeTempPoly(latlng, dispatch, id);
    }
    static makeTempPoly(latlng: IDrawItemLatLng, dispatch: Function, id: string) {
        // const objPoly = {
        //     owner: id,
        //     start: {
        //         lat: latlng.lat,
        //         lng: latlng.lng,
        //     }
        // }
        // dispatch(addPolyLines(objPoly));
    }
    static makePoly(tempPoly: IPolyLinesArr, latlng: IDrawItemLatLng, dispatch: Function, id?: string) {
        // const objPoly = {
        //     ...tempPoly,
        //     to: id || null,
        //     id: uuidv4(),
        //     end: {
        //         lat: latlng.lat,
        //         lng: latlng.lng
        //     }
        // }

        // dispatch(addPolyLinesToArr(objPoly));
    }
    static updatePoly(dispatch: Function, obj: IUpdatePolyObj) {
        // const objToUpdate = {
        //     indexCircle: obj.indexCircle,
        //     newArr: obj.newArr,
        //     obj: obj.obj
        // }
        // dispatch(updatePoly(objToUpdate));
    }
    static dragLine(dispatch: Function, obj: IUpdatePolyObj) {
        dispatch(dragLine(obj));
    }
    static changeLine(latlng: IDrawItemLatLng, dispatch: Function, polylines: IPolyLinesArr[], drawCircles: IDrawArr[], id: string, cubes: ICube[]) {
        const index = polylines.findIndex(item => item.id === id);
        const itemOwner = drawCircles.find(item => item.id === polylines[index].owner);
        const itemTo = drawCircles.find(item => item.id === polylines[index].to);
        const matchedCubes = cubes.filter(cube => polylines.some(line => line.id === cube.owner));
        const newCubeLatLng = { lat: latlng.lat, lng: latlng.lng };
        const ownerLatLng = { lat: itemOwner?.lat as number, lng: itemOwner?.lng as number };
        const toLatLng = { lat: itemTo?.lat as number, lng: itemTo?.lng as number }
        const distanceFromNewCubeToTo = calculateDistance(newCubeLatLng, toLatLng);
        const distanceFromNewCubeToOwner = calculateDistance(newCubeLatLng, ownerLatLng);
        const newArr = [...polylines];
        if (matchedCubes.length > 0) {
            const newLineOwner = new Line({
                ...polylines[index],
                start: {
                    lat: newCubeLatLng.lat,
                    lng: newCubeLatLng.lng
                },
                cubeId: uuidv4()
            }).getLine();
            const newLineTo = new Line({
                ...polylines[index],
                start: {
                    lat: latlng.lat,
                    lng: latlng.lng,
                },
                end: {
                    lat: polylines[index].start?.lat as number,
                    lng: polylines[index].start?.lng as number
                },
                cubeId: newLineOwner?.cubeId
            }).getLine();
            const newCube = {
                lat: latlng.lat,
                lng: latlng.lng,
                id: newLineOwner?.cubeId as string,
                owner: newLineOwner?.id as string,
                to: newLineTo?.id as string,
                icon: iconUrl1,
                type: 'cube',
                distanceFromCubeToOwner: distanceFromNewCubeToOwner,
                distanceFromCubeToTo: distanceFromNewCubeToTo
            }
            newArr.splice(index, 1);
            newArr.push(newLineOwner as IPolyLinesArr, newLineTo as IPolyLinesArr);
            const cube = new Cube(newCube).getCube();
            Cubes.addCube(cube, dispatch, newArr);
        } else {
            const newLineOwner = new Line({
                ...polylines[index],
                end: {
                    lat: latlng.lat,
                    lng: latlng.lng,
                },
                cubeId: uuidv4()
            }).getLine();
            const newLineTo = new Line({
                ...polylines[index],
                start: {
                    lat: latlng.lat,
                    lng: latlng.lng,

                },
                cubeId: newLineOwner?.cubeId
            }).getLine();
            const newCube = {
                lat: latlng.lat,
                lng: latlng.lng,
                id: newLineOwner?.cubeId as string,
                owner: newLineOwner?.id as string,
                to: newLineTo?.id as string,
                icon: iconUrl1,
                type: 'cube',
                distanceFromCubeToOwner: distanceFromNewCubeToOwner,
                distanceFromCubeToTo: distanceFromNewCubeToTo
            }
            newArr.splice(index, 1);
            newArr.push(newLineOwner as IPolyLinesArr, newLineTo as IPolyLinesArr);
            const cube = new Cube(newCube).getCube();
            Cubes.addCube(cube, dispatch, newArr);
        }
    }

}