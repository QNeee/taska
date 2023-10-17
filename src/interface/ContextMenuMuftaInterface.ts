import { LatLng } from "leaflet";
import { ILineStart, setMuftaMenuOpen } from "../Redux/map/mapSlice";
import { ICustomPolyline, Polylines } from "../Polylines";
import { ICustomMarker, Mufts } from "../Mufts";
import { ICustomCube } from "../Cubes";
import { Coords } from "../components/Map/ContextMenu";
import { ICustomWardrobe } from "../Wardrobe";

export interface IDrawItemLatLng {
    lat: number,
    lng: number
}


export class ContextMenuMuftaInterface {
    static handleOnCloseMuftaMenu(dispatch: Function) {
        dispatch(setMuftaMenuOpen(false));
    }
    static handleAddLineFrom(mufts: ICustomMarker[], id: string) {
        const mufta = mufts.find(item => item.id === id);
        const muftaLatLnt = mufta?.getLatLng();
        const aditInfo = {
            id: mufta?.id,
            latlng: new LatLng(muftaLatLnt?.lat as number, muftaLatLnt?.lng as number)
        }
        return aditInfo;
    }
    static handleDeleteMufta(muftsArr: ICustomMarker[], id: string, polyLines: ICustomPolyline[], cubes: ICustomCube[]) {
        const mufts = [...muftsArr];
        const index = muftsArr.findIndex(item => item.id === id);
        const mufta = mufts[index];
        const muftLinesIds = mufta.linesIds;
        const muftCubesIds = mufta.cubesIds;
        mufts.splice(index, 1);
        const to = mufts.filter(muft => muftLinesIds?.some(line => muft.linesIds?.includes(line)) || muftCubesIds?.some(cube => muft.cubesIds?.includes(cube)));
        const polysIds = polyLines.filter(line => mufta.linesIds?.includes(line.id as string));
        const cubesIds = cubes.filter(cube => mufta.cubesIds?.includes(cube.id as string));
        const polys = [...polyLines];
        const cubics = [...cubes];
        for (const muft of to) {
            for (const poly of polysIds) {
                if (muft.linesIds?.includes(poly.id as string)) {
                    const indexPoly = muft.linesIds.findIndex(item => item === poly.id);
                    if (indexPoly !== -1) {
                        muft.linesIds.splice(indexPoly, 1);
                    }

                    const index = polys.findIndex(item => item.id === poly.id);
                    polys.splice(index, 1);
                }
            }
            for (const cube of cubesIds) {
                if (muft.cubesIds?.includes(cube.id as string)) {
                    const indexCube = muft.cubesIds.findIndex(item => item === cube.id);
                    if (indexCube !== -1) {
                        muft.cubesIds.splice(indexCube, 1);
                    }

                    const index = cubics.findIndex(item => item.id === cube.id);
                    cubics.splice(index, 1);
                }
            }
        }
        return { mufts, polyLines: polys, cubes: cubics };
    }
    static handleApplyCoordinates(id: string, mufts: ICustomMarker[], wardrobes: ICustomWardrobe[], form: Coords) {
        let index = mufts.findIndex(item => item.id === id);
        let data: ICustomMarker | ICustomWardrobe;
        if (index !== -1) {
            const muft = mufts[index];
            muft.drag = !muft.drag;
            muft.setLatLng({ lat: form.lat, lng: form.lng });
            data = muft;
        } else {
            index = wardrobes.findIndex(item => item.id === id);
            const wardrobe = wardrobes[index];
            wardrobe.drag = !wardrobe.drag;
            wardrobe.setLatLng({ lat: form.lat, lng: form.lng });
            data = wardrobe;
        }
        return { index, data };

    }
    static handleAddLineTo(mufts: ICustomMarker[], id: string, lineStart: ILineStart | null) {
        const muftaTo = mufts.find(item => item.id === id);
        const muftaOwner = mufts.find(item => item.id === lineStart?.id);
        const muftaLatLng = muftaTo?.getLatLng() as LatLng;
        const ownerLatLng = lineStart?.latlng as LatLng;
        const additionalInfo = {
            owner: lineStart?.id as string,
            to: muftaTo?.id as string
        }
        const polyLine = new Polylines([muftaLatLng, ownerLatLng], additionalInfo).getLine();
        const { data, idOwner, idTo } = Mufts.updateMuftLine(muftaOwner as ICustomMarker, muftaTo as ICustomMarker, polyLine?.id as string);
        return { data, idOwner, idTo, polyLine };
    }
}