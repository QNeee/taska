import L from "leaflet"
import { store } from '../src/Redux/store';
import { deleteMufta, drawMufta } from "../src/Redux/map/mapSlice";
import { ContextMenuMuftaInterface } from "../src/interface/ContextMenuMuftaInterface";
import { Mufts } from "../src/Mufts";
import { generateRandomLatLng } from '../src/testHelper';
describe('muft operations Test', () => {
    const latLng = generateRandomLatLng();
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