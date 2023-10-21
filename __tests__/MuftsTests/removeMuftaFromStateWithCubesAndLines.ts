import { LatLng, LeafletMouseEvent } from "leaflet";
import { ILineStart, deleteMufta, drawCube, drawMufta, drawPolyline, updateMufta } from "../../src/Redux/map/mapSlice";
import { store } from "../../src/Redux/store";
import { TestsHelper } from "../../src/tests/TestsHelper";
import L from "leaflet";
import { ContextMenuMuftaInterface } from "../../src/interface/ContextMenuMuftaInterface";
import { IClickData, PolylineInterface } from '../../src/interface/PolylineInterface'
describe('remove Mufta From State With Cubes And Lines', () => {
    let state = store.getState();
    let muftsArr = state.map.mufts;
    let polyLinesArr = state.map.polyLines;
    let cubesArr = state.map.cubes;
    const wardrobesArr = state.map.wardrobes
    it('add Mufts to State', () => {
        const owner = TestsHelper.generateMuft();
        const to = TestsHelper.generateMuft();
        store.dispatch(drawMufta(owner));
        store.dispatch(drawMufta(to));
        const state = store.getState();
        const muftsArr = state.map.mufts;
        expect(muftsArr.length).toBe(2);
    })
    it('add Polyline to State and check mufta LinesIds', () => {
        state = store.getState();
        muftsArr = state.map.mufts;
        const owner = muftsArr[0];
        const to = muftsArr[1];
        const ownerLatlng = owner?.getLatLng();
        const lineStart = {
            id: owner?.id,
            latlng: new LatLng(ownerLatlng?.lat as number, ownerLatlng?.lng as number)
        } as ILineStart
        const fiberOptic = 125;
        const form = { producer: 'nissan', standart: 'America' }
        const { data, idOwner, idTo, polyLine } = ContextMenuMuftaInterface.handleAddLineTo(muftsArr, to?.id as string, lineStart, fiberOptic, form);
        store.dispatch(updateMufta({ idOwner, idTo, data }));
        store.dispatch(drawPolyline(polyLine));
        state = store.getState();
        polyLinesArr = state.map.polyLines;
        muftsArr = state.map.mufts;
        const filteredMufts = muftsArr.filter(item => item.linesIds?.includes(polyLine?.id as string));
        const checkArr = [...polyLinesArr, ...filteredMufts];
        expect(checkArr.length).toBe(3);
    })
    it('add Cube To State and check Mufta CubesIds', () => {
        state = store.getState();
        polyLinesArr = state.map.polyLines;
        const line = polyLinesArr[0];
        const mapContainer = document.createElement('div');
        document.body.appendChild(mapContainer);
        const map = L.map(mapContainer).setView([51.505, -0.09], 13);
        const lineStart = line?.getLatLngs()[0] as LatLng;
        const lineEnd = line?.getLatLngs()[1] as LatLng;
        const centerLat = (lineStart.lat + lineEnd.lat) / 2;
        const centerLng = (lineStart.lng + lineEnd.lng) / 2;
        const origEvent = map.latLngToContainerPoint({ lat: centerLat, lng: centerLng });
        const e = {
            latlng: L.latLng(centerLat, centerLng),
            originalEvent: { clientX: origEvent.x, clientY: origEvent.y }
        } as LeafletMouseEvent;
        const { data, idOwner, idTo, polys, cubes }: IClickData = PolylineInterface.handleOnClickPolyline(e, line, map, polyLinesArr, cubesArr, 0, muftsArr, wardrobesArr);
        store.dispatch(updateMufta({ idOwner, idTo, data }));
        store.dispatch(drawPolyline(polys));
        store.dispatch(drawCube(cubes));
        state = store.getState();
        muftsArr = state.map.mufts;
        cubesArr = state.map.cubes;
        const filteredMufts = muftsArr.filter(item => item.cubesIds?.includes(cubes[0]?.id as string));
        const checkArr = [...polyLinesArr, ...filteredMufts];
        expect(checkArr.length).toBe(3);
    })
    it('check another Mufts LinesIds and CubesIds after Delete Muft', () => {
        state = store.getState();
        muftsArr = state.map.mufts;
        cubesArr = state.map.cubes;
        polyLinesArr = state.map.polyLines;
        const idToDelete = muftsArr[0].id;
        const { mufts, polyLines, cubes, wardrobes } = ContextMenuMuftaInterface.handleDeleteMufta(muftsArr, idToDelete as string, polyLinesArr, cubesArr, wardrobesArr)
        store.dispatch(deleteMufta({ mufts, polyLines, cubes, wardrobes }));
        state = store.getState();
        muftsArr = state.map.mufts;
        expect(muftsArr[0].linesIds?.length! + muftsArr[0].cubesIds?.length!).toBe(0);
    })
})