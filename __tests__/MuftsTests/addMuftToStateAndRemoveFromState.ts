import { ICustomMarker } from "../../src/Mufts";
import { TestsHelper } from "../../src/tests/TestsHelper"
import { store } from '../../src/Redux/store';
import { deleteMufta, drawMufta } from "../../src/Redux/map/mapSlice";
import { ContextMenuMuftaInterface } from '../../src/interface/ContextMenuMuftaInterface'
describe('add Muft To State And Remove From State', () => {
    const muft = TestsHelper.generateMuft() as ICustomMarker;
    it('add Muft To State', () => {
        store.dispatch(drawMufta(muft));
        const state = store.getState();
        const muftsArr = state.map.mufts;
        const muftExists = muftsArr.some((item) => item.id === muft?.id);
        expect(muftExists).toBe(true);
    })
    it('remove Mufta From State', () => {
        let state = store.getState();
        let muftsArr = state.map.mufts;
        const polyLinesArr = state.map.polyLines;
        const cubesArr = state.map.cubes;
        const wardrobesArr = state.map.wardrobes;
        const { mufts, polyLines, cubes, wardrobes } = ContextMenuMuftaInterface.handleDeleteMufta(muftsArr, muft.id as string, polyLinesArr, cubesArr, wardrobesArr)
        store.dispatch(deleteMufta({ mufts, polyLines, cubes, wardrobes }));
        state = store.getState();
        muftsArr = state.map.mufts;
        const isMuftDeleted = muftsArr.findIndex(item => item.id === muft?.id);
        expect(isMuftDeleted).toBe(-1);
    })
})
