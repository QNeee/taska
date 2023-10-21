import L, { LatLng, LeafletMouseEvent } from "leaflet"
import { store } from '../src/Redux/store';
import { IItemInfoPoly, deleteMufta, drawCube, drawMufta, drawPolyline, setToggleCoordsApply, updateMufta } from "../src/Redux/map/mapSlice";
import { ContextMenuMuftaInterface } from "../src/interface/ContextMenuMuftaInterface";
import { ICustomMarker, Mufts } from "../src/Mufts";
import { generateRandomLatLng } from '../src/testHelper';
import { Polylines } from "../src/Polylines";
import { ICoords } from "../src/components/Map/ContextMenu";
import { IClickData, PolylineInterface } from "../src/interface/PolylineInterface";
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
    it('Mufta applyCoords', () => {
        store.dispatch(drawMufta(muft));
        const id = muft?.id as string;
        const form = { lat: muft?.getLatLng().lat as number, lng: muft?.getLatLng().lng as number };
        let state = store.getState();
        let muftsArr = state.map.mufts;
        const { index, data } = ContextMenuMuftaInterface.handleApplyCoordinates(id, muftsArr, form);
        store.dispatch(setToggleCoordsApply({ index, data }));
        state = store.getState();
        muftsArr = state.map.mufts;
        const checkArr = muftsArr.filter(item => item.getLatLng().equals(form) && !item.drag);
        expect(checkArr.length).toBe(1);
    })
    // it('Mufta applyCoords with Polyline', () => {
    //     const muft1 = new Mufts(generateRandomLatLng()).getMuft();
    //     store.dispatch(drawMufta(muft1));
    //     const lineInfo = {
    //         owner: muft?.id,
    //         to: muft1?.id
    //     } as IItemInfoPoly
    //     const line = new Polylines([muft?.getLatLng() as LatLng, muft1?.getLatLng() as LatLng], lineInfo).getLine();
    //     const hideVariable = 'hide';
    //     if (hideVariable) {
    //         const { data, idOwner, idTo } = Mufts.updateMuftLine(muft as ICustomMarker, muft1 as ICustomMarker, line?.id as string);
    //         store.dispatch(updateMufta({ idOwner, idTo, data }));
    //     }
    //     store.dispatch(drawPolyline(line));
    //     let state = store.getState();
    //     let muftsArr = state.map.mufts;
    //     let polyLinesArr = state.map.polyLines;
    //     const form = muft?.getLatLng() as ICoords;
    //     const { index, data, polysArr } = ContextMenuMuftaInterface.handleApplyCoordinates(muft?.id as string, muftsArr, form, polyLinesArr);
    //     store.dispatch(setToggleCoordsApply({ index, data, polysArr }));
    //     state = store.getState();
    //     polyLinesArr = state.map.polyLines;
    //     const checkArr = polyLinesArr.filter(item => L.latLng(form.lat, form.lng).equals(item.getLatLngs()[0] as LatLng));
    //     expect(checkArr.length).toBe(1);
    // })
    it('delete Mufta with Cube and Polyline and Check Mufta linesIds and cubesIds', () => {
        let state = store.getState();
        let muftsArr = state.map.mufts;
        const polyLinesArr = state.map.polyLines;
        let cubesArr = state.map.cubes;
        const poly = polyLinesArr[0];
        const mapContainer = document.createElement('div');
        document.body.appendChild(mapContainer);
        const map = L.map(mapContainer).setView([51.505, -0.09], 13);
        const lineStart = poly.getLatLngs()[0] as LatLng;
        const lineEnd = poly.getLatLngs()[1] as LatLng;
        const centerLat = (lineStart.lat + lineEnd.lat) / 2;
        const centerLng = (lineStart.lng + lineEnd.lng) / 2;
        const origEvent = map.latLngToContainerPoint({ lat: centerLat, lng: centerLng });
        const e = {
            latlng: L.latLng(centerLat, centerLng),
            originalEvent: { clientX: origEvent.x, clientY: origEvent.y }
        } as LeafletMouseEvent;
        const { data, idOwner, idTo, polys, cubes }: IClickData = PolylineInterface.handleOnClickPolyline(e, polyLinesArr[0], map, polyLinesArr, cubesArr, 0, muftsArr);
        store.dispatch(updateMufta({ idOwner, idTo, data }));
        store.dispatch(drawPolyline(polys));
        store.dispatch(drawCube(cubes));
        state = store.getState();
        cubesArr = state.map.cubes;
        const cubeId = cubesArr[0].id as string;
        const hideVariable = 'hide';
        if (hideVariable) {
            const { mufts, polyLines, cubes } = ContextMenuMuftaInterface.handleDeleteMufta(muftsArr, muft?.id as string, polyLinesArr, cubesArr)
            store.dispatch(deleteMufta({ mufts, polyLines, cubes }));
        }
        state = store.getState();
        muftsArr = state.map.mufts;
        const checkArr = muftsArr.filter(item => item.linesIds?.includes(poly.id as string) && item.cubesIds?.includes(cubeId));
        expect(checkArr.length).toBe(0);
    })
})