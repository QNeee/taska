import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { Cubes, ICustomCube } from "../Cubes";
import { ICustomPolyline, Polylines } from "../Polylines";
import { setCubeMenu } from "../Redux/app/appSlice";
import { IItemInfoPoly, setContextMenuXY, setDrag, setGeneralMenu, setHideCubes, setId, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen, updateCubesDelete } from "../Redux/map/mapSlice";
import { ICustomMarker, Mufts } from "../Mufts";
export function roundLatLng(latLng: LatLng, decimalPlaces: number) {
    const lat = latLng.lat.toFixed(decimalPlaces);
    const lng = latLng.lng.toFixed(decimalPlaces);
    return L.latLng(parseFloat(lat), parseFloat(lng));
}
export class CubeInterface {
    static handleDoubleClick(e: LeafletMouseEvent, dispatch: Function, index: number, mufts: ICustomMarker[], cube: ICustomCube) {

    }
    static handleCubeOnClick(e: LeafletMouseEvent, dispatch: Function, cubesArr: ICustomCube[], mufts: ICustomMarker[], cube: ICustomCube, polyLines: ICustomPolyline[], index: number) {
        const needMufts = mufts.filter(item => item.cubesIds?.includes(cube.id as string));
        const owner = needMufts.find(item => item.id === cube.owner) as ICustomMarker;
        const to = needMufts.find(item => item.id === cube.to) as ICustomMarker;
        const ownerLines = owner.linesIds as string[];
        const toLines = to.linesIds as string[];
        const commonLines = ownerLines.filter(lineId => toLines.includes(lineId));
        const needPolys = polyLines.filter(line => commonLines.some(item => line.id === item));
        const polys = [...polyLines];
        const cubes = [...cubesArr];
        const cubIndex = cubes.findIndex(item => item.id === cube.id);
        cubes.splice(cubIndex, 1);
        const lineInfo = {
            owner: owner.id,
            to: to.id,
        }
        const oldPolys: LatLng[] = [];
        const oldIds: string[] = [];
        for (const poly of needPolys) {
            if (poly.getBounds().contains(cube.getLatLng())) {
                oldIds.push(poly.id as string);
                if (!cube.getLatLng().equals(poly.getLatLngs()[0] as LatLng)) {
                    oldPolys.push(poly.getLatLngs()[0] as LatLng);
                } else {
                    oldPolys.push(poly.getLatLngs()[1] as LatLng);
                }
            }
        }

        const line = new Polylines(L.polyline([oldPolys[0] as LatLng, oldPolys[1] as LatLng]), lineInfo as IItemInfoPoly).getLine();
        const polyIndex1 = polys.findIndex(item => item.id === oldIds[0]);
        polys.splice(polyIndex1, 1);
        const polyIndex2 = polys.findIndex(item => item.id === oldIds[1]);
        polys.splice(polyIndex2, 1);
        polys.push(line as ICustomPolyline);
        Mufts.updateMuftCube(dispatch, owner, to, line?.id as string, cube.id as string, oldIds);
        dispatch(updateCubesDelete({ cubes, polyLines: polys }));
        dispatch(setItemMenu(false));

    }
    static handleCubeDragStart(e: L.LeafletEvent, dispatch: Function, cubesArr: ICustomCube[], mufts: ICustomMarker[], cube: ICustomCube, polyLines: ICustomPolyline[]) {
        dispatch(setDrag(true));
        // if (!cube.drager) {
        //     const cubes = [...underCubes];
        //     const start = cube.getLatLng();
        //     const owner = mufts.filter(item => item.id === cube.owner);
        //     const to = mufts.filter(item => item.id === cube.to);
        //     const center = L.latLng(
        //         (start.lat + owner[0].getLatLng().lat) / 2,
        //         (start.lng + owner[0].getLatLng().lng) / 2
        //     );
        //     const center1 = L.latLng(
        //         (start.lat + to[0].getLatLng().lat) / 2,
        //         (start.lng + to[0].getLatLng().lng) / 2
        //     );
        //     const infoObj = {
        //         owner: cube.owner,
        //         to: cube.to,
        //         dragOwner: cube.id,
        //     }
        //     const newCubes = [...cubesArr];
        //     newCubes.forEach(item => {
        //         if (item.id === cube.id) {
        //             item.drager = true;
        //         }
        //     });
        //     const newPolys: ICustomPolyline[] = [];
        //     const underCube = new UnderCubes(L.marker(center), infoObj as IUnderCubeInfo, true).getCub();
        //     const underCube1 = new UnderCubes(L.marker(center1), infoObj as IUnderCubeInfo, false).getCub();
        //     cubes.push(underCube as ICustomUnderCube, underCube1 as ICustomUnderCube);
        //     const cubesForLines = [owner[0], underCube, cube, underCube1, to[0]];
        //     for (let i = 0; i < cubesForLines.length - 1; i++) {
        //         const start = cubesForLines[i]?.getLatLng() as LatLng;
        //         const end = cubesForLines[i + 1]?.getLatLng() as LatLng;
        //         const line = new Polylines(L.polyline([start, end]), infoObj as IItemInfoPoly).getLine();
        //         newPolys.push(line as ICustomPolyline);
        //     }
        //     dispatch(drawPolyline(newPolys));
        //     dispatch(setCubDragging(newCubes));
        //     dispatch(makeUnderCubes(cubes));
        //   }
    }
    static handleCubeContextMenu(e: L.LeafletMouseEvent, dispatch: Function) {
        e.originalEvent.preventDefault();
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        dispatch(setMuftaMenuOpen(false));
        dispatch(setGeneralMenu(false));
        dispatch(setPolylineMenuOpen(false));
        dispatch(setCubeMenu(true));
    }
    static handleDeleteCube(id: string) {

    }
    static handleHideCubes(dispatch: Function) {
        dispatch(setHideCubes(true));
    }
    // static handleOnClickPolyline(e: L.LeafletMouseEvent, dispatch: Function, poly: ICustomPolyline, map: L.Map, polyLines: ICustomPolyline[], cubes: ICustomCube[], mufts: ICustomCube[], index: number) {
    //     const click = { x: e.originalEvent.clientX, y: e.originalEvent.clientY };
    //     const clickLatLng = map.containerPointToLatLng(L.point(click.x, click.y));
    //     const nearestPoint = L.GeometryUtil.closest(map, poly, clickLatLng);
    //     const needMufts = mufts.filter(item => item.id === poly.owner || item.id === poly.to);
    //     const cubicsNot = [...cubes.filter(cube => !needMufts.some(muft => cube.owner === muft.id || cube.to === muft.id))]
    //     const cubics = [...cubes.filter(cube => needMufts.some(muft => cube.owner === muft.id || cube.to === muft.id))]
    //     const cubeLatLng = L.latLng((nearestPoint?.lat!), (nearestPoint?.lng!));
    //     const newPolys: ICustomPolyline[] = [];
    //     const newPolysNot = [...polyLines.filter(line => !needMufts.some(muft => line.owner === muft.id || line.to === muft.id))];
    //     const objInfo = {
    //         owner: needMufts[0].id,
    //         to: needMufts[1].id,
    //     }
    //     const cube = new Cubes(new L.Marker(cubeLatLng), objInfo).getCub();
    //     const markers: ICustomCube[] = [needMufts[0], ...cubes, cube as ICustomCube, needMufts[1]];
    //     for (let i = 0; i < markers.length - 1; i++) {
    //         const startMarker = markers[i];
    //         const endMarker = markers[i + 1];
    //         const newLine = new Polylines(L.polyline([startMarker.getLatLng(), endMarker.getLatLng()]), objInfo as IItemInfoPoly).getLine();
    //         newPolys.push(newLine as ICustomPolyline);
    //     }
    //     const resultPoly = [...newPolysNot, ...newPolys]
    //     cubics.push(cube as ICustomCube);
    //     const resultCubes = [...cubics, ...cubicsNot];
    //     dispatch(drawPolyline(resultPoly));
    //     dispatch(drawCube(resultCubes));
    // }
    static handleCubeDrag(e: L.LeafletEvent, dispatch: Function, polyLines: ICustomPolyline[], cube: ICustomCube, index: number, cubes: ICustomCube[], drag: boolean, map: L.Map, mufts: ICustomMarker[], cubic: ICustomCube) {
        if (drag) {
            const owner = mufts.find(item => item.id === cubic.owner);
            const to = mufts.find(item => item.id === cubic.to);
            const latLng = e.target.getLatLng();
            const newArr = [...polyLines];
            newArr.forEach((line, lineIndex) => {
                const startLine = line.getLatLngs()[0];
                const endLine = line.getLatLngs()[1];
                if (cubic.getLatLng().equals(startLine as LatLng)) {
                    newArr[lineIndex].setLatLngs([latLng, endLine as LatLng]);
                } else if (cubic.getLatLng().equals(endLine as LatLng)) {
                    newArr[lineIndex].setLatLngs([startLine as LatLng, latLng]);
                }
            });
            const obj = [...cubes];
            obj.forEach((item) => {
                if (item.id === cubic.id) {
                    const distanceToOwner = item.getLatLng().distanceTo(owner?.getLatLng() as LatLng);
                    const distanceToTo = item.getLatLng().distanceTo(to?.getLatLng() as LatLng);
                    item.setLatLng(latLng);
                    item.distanceToOwner = distanceToOwner;
                    item.distanceToTo = distanceToTo;
                }
            })
            Cubes.updateCube(dispatch, { index, newArr, cubes: obj });
        }
    }
    static handleCubeDragEnd(e: L.LeafletEvent, dispatch: Function, polyLines: ICustomPolyline[], item: ICustomCube, index: number) {
        dispatch(setDrag(false));
    }
    static handleCubeMouseOver(e: L.LeafletMouseEvent, dispatch: Function, id: string, drag: boolean, itemMenu: boolean) {
        if (!drag && !itemMenu) {
            dispatch(setId(id));
            dispatch(setItemMenu(true));
        }
    }
    static handleCubeMouseEnd(e: L.LeafletMouseEvent, dispatch: Function) {
        dispatch(setItemMenu(false));
    }
}