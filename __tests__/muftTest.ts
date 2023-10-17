import { LatLng } from "leaflet"
import { ICustomMarker, Mufts } from '../src/Mufts'
import L from "leaflet"
import { store } from '../src/Redux/store';
import { deleteMufta, drawMufta } from "../src/Redux/map/mapSlice";
import { ContextMenuMuftaInterface } from "../src/interface/ContextMenuMuftaInterface";
function generateRandomLatLng(): LatLng {
    const minLat = -90;
    const maxLat = 90;
    const minLng = -180;
    const maxLng = 180;

    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lng = Math.random() * (maxLng - minLng) + minLng;

    return { lat, lng } as LatLng;
}
describe('one muft operations Test', () => {
    const latLng = {
        lat: 21.123123213133,
        lng: 90.213122131313,
    } as LatLng
    const muft = new Mufts(latLng).getMuft();
    it('make Muft and check latLng', () => {
        expect(muft?.getLatLng()).toStrictEqual(latLng);
    })
    it('check instance of Muft', () => {
        expect(muft).toBeInstanceOf(L.Marker);
    })
    it('add Muft to State', () => {
        store.dispatch(drawMufta(muft));
        const state = store.getState();
        const muftsArr = state.map.mufts;
        const muftExists = muftsArr.some((item) => item.id === muft?.id);
        expect(muftExists).toBe(true);
    })
    it('delete Muft from state', () => {
        let state = store.getState();
        let muftsArr = state.map.mufts;
        const polysArr = state.map.polyLines;
        const cubesArr = state.map.cubes;
        const { mufts, polyLines, cubes } = ContextMenuMuftaInterface.handleDeleteMufta(muftsArr, muft?.id as string, polysArr, cubesArr)
        store.dispatch(deleteMufta({ mufts, polyLines, cubes }));
        state = store.getState();
        muftsArr = state.map.mufts;
        const isMuftDeleted = muftsArr.findIndex(item => item.id === muft?.id);
        expect(isMuftDeleted).toBe(-1);
    })
})
describe('fives mufts operations Test', () => {
    const muftsArr: ICustomMarker[] = []
    it('make 5 mufts', () => {
        for (let i = 0; i < 5; i++) {
            const mufta = new Mufts(generateRandomLatLng()).getMuft() as ICustomMarker;
            muftsArr.push(mufta);
        }
        expect(muftsArr.length).toBe(5);
    })
    it('check instances of 5 Mufts', () => {
        const allMuftsAreMarkers = muftsArr.every(muft => muft instanceof L.Marker);
        expect(allMuftsAreMarkers).toBe(true);
    })
    it('add 5 mufts to State', () => {
        for (let i = 0; i < muftsArr.length; i++) {
            store.dispatch(drawMufta(muftsArr[i]));
        }
        const state = store.getState();
        expect(state.map.mufts.length).toBe(5);
    })
    it('delete 5 mufts from State', () => {
        let state = store.getState();
        let muftsArr = state.map.mufts;
        const polysArr = state.map.polyLines;
        const cubesArr = state.map.cubes;
        let count = 0;
        while (muftsArr.length > 0) {
            count++;
            const muft = muftsArr[0];
            const { mufts, polyLines, cubes } = ContextMenuMuftaInterface.handleDeleteMufta(muftsArr, muft?.id as string, polysArr, cubesArr);
            store.dispatch(deleteMufta({ mufts, polyLines, cubes }));
            state = store.getState();
            muftsArr = state.map.mufts;
        }
        expect(muftsArr.length + count).toBe(5);
    })
})