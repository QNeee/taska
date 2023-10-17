import { LatLng } from "leaflet";
import { ICustomMarker, Mufts } from "../src/Mufts"
import { ICustomPolyline, Polylines } from "../src/Polylines";
import { generateRandomLatLng } from "../src/testHelper"
import { IItemInfoPoly, drawMufta, drawPolyline, updateMufta } from "../src/Redux/map/mapSlice";
import L from "leaflet";
import { store } from "../src/Redux/store";

describe('polyline operation Test', () => {
    const owner = new Mufts(generateRandomLatLng()).getMuft() as ICustomMarker;
    const to = new Mufts(generateRandomLatLng()).getMuft() as ICustomMarker;
    const ownerLatlng = owner?.getLatLng() as LatLng;
    const toLatLng = to?.getLatLng() as LatLng;
    const lineInfo = {
        owner: owner?.id,
        to: to?.id
    } as IItemInfoPoly
    let line: ICustomPolyline;
    store.dispatch(drawMufta(owner));
    store.dispatch(drawMufta(to));
    it('make poly and check Latlng', () => {
        line = new Polylines([ownerLatlng, toLatLng], lineInfo).getLine() as ICustomPolyline;
        const polyLatLng = line?.getLatLngs() as LatLng[];
        const checkArr: number[] = [];
        for (let i = 0; i < polyLatLng.length; i++) {
            if (polyLatLng[0].equals(ownerLatlng) || polyLatLng[1].equals(toLatLng)) {
                checkArr.push(0);
            }
        }
        expect(checkArr.length).toBe(polyLatLng.length);
    })
    it('check poly Instase of L.polyline', () => {
        line = new Polylines([ownerLatlng, toLatLng], lineInfo).getLine() as ICustomPolyline;
        expect(line).toBeInstanceOf(L.Polyline);
    })
    it('add Polyline to state and check Mufts linesIds includes Polyline id', () => {
        line = new Polylines([ownerLatlng, toLatLng], lineInfo).getLine() as ICustomPolyline;
        const { data, idOwner, idTo } = Mufts.updateMuftLine(owner, to, line?.id as string);
        store.dispatch(updateMufta({ idOwner, idTo, data }));
        store.dispatch(drawPolyline(line));
        const state = store.getState();
        const polysArr = state.map.polyLines;
        const muftsArr = state.map.mufts;
        const filteredMufts = muftsArr.filter(item => item.linesIds?.includes(line.id as string));
        const check = [...polysArr, ...filteredMufts];
        expect(check.length).toBe(3);
    })
})