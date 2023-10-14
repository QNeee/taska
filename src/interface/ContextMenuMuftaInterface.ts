import L, { LatLng } from "leaflet";
import { setAddLine } from "../Redux/app/appSlice";
import { ILineStart, deleteMufta, drawPolyline, setLineStart, setMuftaMenuOpen } from "../Redux/map/mapSlice";
import { ICustomPolyline, Polylines } from "../Polylines";
import { ICustomMarker, Mufts } from "../Mufts";
import { ICustomCube } from "../Cubes";

export interface IDrawItemLatLng {
    lat: number,
    lng: number
}


export class ContextMenuMuftaInterface {
    static handleOnCloseMuftaMenu(dispatch: Function) {
        dispatch(setMuftaMenuOpen(false));
    }
    static handleAddLineFrom(mufts: ICustomMarker[], dispatch: Function, id: string) {
        const mufta = mufts.find(item => item.id === id);
        const muftaLatLnt = mufta?.getLatLng();
        const aditInfo = {
            id: mufta?.id,
            latlng: new LatLng(muftaLatLnt?.lat as number, muftaLatLnt?.lng as number)
        }
        dispatch(setLineStart(aditInfo));
        dispatch(setAddLine(true));
    }
    static handleDeleteMufta(muftsArr: ICustomMarker[], id: string, dispatch: Function, polyLines: ICustomPolyline[], cubes: ICustomCube[]) {
        const mufts = [...muftsArr];
        const index = muftsArr.findIndex(item => item.id === id);
        const mufta = mufts[index];
        const to = mufts.filter(muft => mufta.cubesIds?.some(item => muft.cubesIds?.includes(item)));
        to.splice(index, 1);
        const polysIds = polyLines.filter(line => mufta.linesIds?.includes(line.id as string));
        const cubesIds = cubes.filter(cube => mufta.cubesIds?.includes(cube.id as string));
        const polys = [...polyLines];
        const cubics = [...cubes];
        const indexLinesToDelete: number[] = [];
        const indexCubesToDelete: number[] = [];
        for (const muft of to) {
            for (const poly of polysIds) {
                if (muft.linesIds?.includes(poly.id as string)) {
                    const index = polyLines.findIndex(item => item.id === poly.id);
                    indexLinesToDelete.push(index);
                }
            }
            for (const cube of cubesIds) {
                if (muft.cubesIds?.includes(cube.id as string)) {
                    const index = cubes.findIndex(item => item.id === cube.id);
                    indexCubesToDelete.push(index);
                }
            }
        }
        indexLinesToDelete.sort((a, b) => b - a);
        indexCubesToDelete.sort((a, b) => b - a);
        for (let i = 0; i < indexLinesToDelete.length; i++) {
            polys.splice(indexLinesToDelete[i], 1);
        }
        for (let i = 0; i < indexCubesToDelete.length; i++) {
            cubics.splice(indexCubesToDelete[i], 1);
        }
        mufts.splice(index, 1);
        dispatch(deleteMufta({ mufts, polyLines: polys, cubes: cubics }))
        // Mufts.deleteMufta(mufts, dispatch);
    }
    static handleAddLineTo(mufts: ICustomMarker[], id: string, dispatch: Function, lineStart: ILineStart | null, map: L.Map) {
        const muftaTo = mufts.find(item => item.id === id);
        const muftaOwner = mufts.find(item => item.id === lineStart?.id);
        const muftaLatLng = muftaTo?.getLatLng() as LatLng;
        const ownerLatLng = lineStart?.latlng as LatLng;
        const additionalInfo = {
            owner: lineStart?.id as string,
            to: muftaTo?.id as string
        }
        const polyLine = new Polylines([muftaLatLng, ownerLatLng], additionalInfo).getLine();
        Mufts.updateMuftLine(dispatch, muftaOwner as ICustomMarker, muftaTo as ICustomMarker, polyLine?.id as string);
        dispatch(drawPolyline(polyLine));
        dispatch(setAddLine(false));
    }
}