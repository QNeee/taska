import { LatLng, LeafletMouseEvent } from "leaflet";
import { ICustomMarker, Mufts } from "../src/Mufts";
import { generateRandomLatLng } from "../src/testHelper";
import { IItemInfoPoly, drawCube, drawMufta, drawPolyline, updateCubesDelete, updateMufta } from "../src/Redux/map/mapSlice";
import { store } from "../src/Redux/store";
import { ICustomPolyline, Polylines } from "../src/Polylines";
import { IClickData, PolylineInterface } from '../src/interface/PolylineInterface';
import L from "leaflet";
import { Cubes, ICustomCube } from "../src/Cubes";
import { CubeInterface } from "../src/interface/CubeInterface"
describe('cube operation Test', () => {
    let map: L.Map;

    beforeEach(() => {
        const mapContainer = document.createElement('div');
        document.body.appendChild(mapContainer);
        map = L.map(mapContainer).setView([51.505, -0.09], 13);
    });

    afterEach(() => {
        map.remove();
    });
    const owner = new Mufts(generateRandomLatLng()).getMuft() as ICustomMarker;
    const to = new Mufts(generateRandomLatLng()).getMuft() as ICustomMarker;
    const ownerLatlng = owner?.getLatLng() as LatLng;
    const toLatLng = to?.getLatLng() as LatLng;
    const lineInfo = {
        owner: owner?.id,
        to: to?.id
    } as IItemInfoPoly;
    const cubInfo = {
        owner: owner?.id,
        to: to?.id
    }
    const line = new Polylines([ownerLatlng, toLatLng], lineInfo).getLine() as ICustomPolyline;
    store.dispatch(drawMufta(owner));
    store.dispatch(drawMufta(to));
    const { data, idOwner, idTo } = Mufts.updateMuftLine(owner, to, line?.id as string);
    store.dispatch(updateMufta({ idOwner, idTo, data }));
    store.dispatch(drawPolyline(line));
    it('make Cube and check bounds', () => {
        const lineStart = line.getLatLngs()[0] as LatLng;
        const lineEnd = line.getLatLngs()[1] as LatLng;
        const centerLatLng = {
            lat: (lineStart.lat + lineEnd.lat) / 2,
            lng: (lineStart.lng + lineEnd.lng) / 2
        } as LatLng;
        const cube = new Cubes(centerLatLng, cubInfo).getCub() as ICustomCube;
        expect(line.getBounds().contains(cube.getLatLng())).toBe(true);
    });
    it('check Instance of Cube', () => {
        const cube = new Cubes(generateRandomLatLng(), cubInfo).getCub() as ICustomCube;
        expect(cube).toBeInstanceOf(L.Marker);
    })
    it('add Cube to State and check Mufts cubesIds', () => {
        let state = store.getState();
        const polyLines = state.map.polyLines;
        const cubesArr = state.map.cubes;
        let mufts = state.map.mufts;
        const index = polyLines.findIndex(item => item.id === line.id);
        const lineStart = line.getLatLngs()[0] as LatLng;
        const lineEnd = line.getLatLngs()[1] as LatLng;
        const centerLat = (lineStart.lat + lineEnd.lat) / 2;
        const centerLng = (lineStart.lng + lineEnd.lng) / 2;
        const origEvent = map.latLngToContainerPoint({ lat: centerLat, lng: centerLng });
        const e = {
            latlng: L.latLng(centerLat, centerLng),
            originalEvent: { clientX: origEvent.x, clientY: origEvent.y }
        } as LeafletMouseEvent;
        const { data, idOwner, idTo, polys, cubes }: IClickData = PolylineInterface.handleOnClickPolyline(e, polyLines[index], map, polyLines, cubesArr, index, mufts);
        store.dispatch(updateMufta({ idOwner, idTo, data }));
        store.dispatch(drawPolyline(polys));
        store.dispatch(drawCube(cubes));
        state = store.getState();
        mufts = state.map.mufts;
        const checkArr = mufts.filter(muft => cubes.some(cube => muft.cubesIds?.includes(cube.id as string)))
        expect(checkArr.length).toBe(2);
    })
    it('delete Cube and check Mufts cubesIds', () => {
        let state = store.getState();
        const cubesArr = state.map.cubes;
        let muftsArr = state.map.mufts;
        const polyLinesArr = state.map.polyLines;
        const cubeId = cubesArr[0].id as string;
        const { data, idOwner, idTo, cubes, polys }: IClickData = CubeInterface.handleCubeOnClick(cubesArr, muftsArr, cubesArr[0], polyLinesArr)
        store.dispatch(updateMufta({ idOwner, idTo, data }));
        store.dispatch(updateCubesDelete({ cubes, polyLines: polys }));
        state = store.getState();
        muftsArr = state.map.mufts;
        const checkArr = muftsArr.filter(item => item.cubesIds?.includes(cubeId));
        expect(checkArr.length).toBe(0);
    })
});