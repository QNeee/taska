import L, { LatLng } from "leaflet";
import { ICustomPolyline, Polylines } from "../Polylines";
import { IItemInfoPoly, drawCube, drawPolyline, setContextMenuXY, setCountOwner, setCountTo, setGeneralMenu, setHideCubes, setItemMenu, setMuftaMenuOpen, setPolylineMenuOpen } from "../Redux/map/mapSlice";
import { Cubes, ICustomCube } from "../Cubes";
import 'leaflet-geometryutil';
import { ICustomMarker, Mufts } from "../Mufts";

export class PolylineInterface {
    static handleDbClick(e: L.LeafletMouseEvent) {
        e.originalEvent.preventDefault();
    }
    static handleOnClickPolyline(e: L.LeafletMouseEvent, dispatch: Function, poly: ICustomPolyline, map: L.Map, polyLines: ICustomPolyline[], cubes: ICustomCube[], index: number, mufts: ICustomMarker[], hideCubes: boolean) {
        if (hideCubes) {
            return dispatch(setHideCubes(false));
        }
        const needMufts = mufts.filter(item => item.linesIds?.includes(poly?.id as string));
        const owner = needMufts.find(item => item.id === poly.owner) as ICustomMarker;
        const to = needMufts.find(item => item.id === poly.to) as ICustomMarker;
        const polys = [...polyLines];
        const ownerCubes = cubes.filter(cube => cube.owner === owner?.id);
        const click = { x: e.originalEvent.clientX, y: e.originalEvent.clientY };
        const clickLatLng = map.containerPointToLatLng(L.point(click.x, click.y));
        const nearestPoint = L.GeometryUtil.closest(map, poly, clickLatLng);
        const cubeLatLng = L.latLng((nearestPoint?.lat!), (nearestPoint?.lng!));
        const nearestLatLng = {
            lat: nearestPoint?.lat!,
            lng: nearestPoint?.lng!
        }
        const distanceToOwner = owner.getLatLng().distanceTo(nearestLatLng);
        const distanceToTo = to.getLatLng().distanceTo(nearestLatLng);
        const lineInfo = {
            owner: owner.id,
            to: to.id,
        }
        if (ownerCubes.length === 0) {
            polys.splice(index, 1);
            const line1 = new Polylines(L.polyline([owner.getLatLng(), nearestLatLng as LatLng]), lineInfo as IItemInfoPoly, true).getLine();
            const line2 = new Polylines(L.polyline([to.getLatLng(), nearestLatLng as LatLng]), lineInfo as IItemInfoPoly, true).getLine();

            const cubeInfo = {
                owner: owner.id,
                to: to.id,
                distanceToOwner,
                distanceToTo,
            }
            const cube = new Cubes(new L.Marker(cubeLatLng), cubeInfo).getCub();
            polys.push(line1 as ICustomPolyline, line2 as ICustomPolyline);
            distanceToOwner < distanceToTo ? dispatch(setCountOwner('')) : dispatch(setCountTo(''))
            const newCubes = [...cubes, cube as ICustomCube];
            Mufts.updateMuftLine(dispatch, owner, to, line1?.id as string, poly.id, line2?.id as string, cube?.id as string);
            dispatch(drawPolyline(polys));
            dispatch(drawCube(newCubes));
            Polylines.changePolyLineWeight(dispatch, owner, to, polys, 4);
        } else {
            const cubeInfo = {
                owner: owner.id,
                to: to.id,
                distanceToOwner,
                distanceToTo,
            }
            const cube = new Cubes(new L.Marker(cubeLatLng), cubeInfo).getCub();
            const needMarkers: ICustomCube[] = [];
            const start = poly.getLatLngs()[0] as LatLng;
            const end = poly.getLatLngs()[1] as LatLng;
            const allMarker = [...cubes, ...needMufts];
            for (const muft of allMarker) {
                if (muft.getLatLng().equals(start) || muft.getLatLng().equals(end)) {
                    needMarkers.push(muft);
                }
            }
            needMarkers.splice(1, 0, cube as ICustomCube);
            polys.splice(index, 1);
            const linesId: string[] = [];
            for (let i = 0; i < needMarkers.length - 1; i++) {
                const startMarker = needMarkers[i].getLatLng() as LatLng;
                const endMarker = needMarkers[i + 1].getLatLng() as LatLng;
                const line = new Polylines(L.polyline([startMarker, endMarker], { weight: 12 }), lineInfo as IItemInfoPoly).getLine()
                polys.push(line as ICustomPolyline);
                linesId.push(line?.id as string);

            }
            const newCubes = [...cubes, cube];
            Mufts.updateMuftLine(dispatch, owner, to, linesId[0], poly.id, linesId[1], cube?.id as string);
            dispatch(drawPolyline(polys));
            dispatch(drawCube(newCubes));
            Polylines.changePolyLineWeight(dispatch, owner, to, polys, 4);
        }


    }
    // static handleOnClickPolyline(e: L.LeafletMouseEvent, dispatch: Function, poly: ICustomPolyline, map: L.Map, polyLines: ICustomPolyline[], cubes: ICustomCube[], mufts: ICustomCube[], index: number) {
    //     const needMufts = mufts.filter(item => item.id === poly.owner || item.id === poly.to);
    //     const cubics = [...cubes.filter(cube => needMufts.some(muft => cube.owner === muft.id || cube.to === muft.id))];
    //     if (cubics.length === 1) return;
    //     const polyLatlng = poly.getLatLngs() as LatLng[];
    //     const centerLatLng = L.latLng(
    //         (polyLatlng[0].lat + polyLatlng[1].lat) / 2,
    //         (polyLatlng[0].lng + polyLatlng[1].lng) / 2
    //     );
    //     const objInfo = {
    //         owner: needMufts[0].id,
    //         to: needMufts[1].id,
    //     };
    //     const cubicsNot = [...cubes.filter(cube => !needMufts.some(muft => cube.owner === muft.id || cube.to === muft.id))];
    //     const cube = new Cubes(new L.Marker(centerLatLng), objInfo).getCub();
    //     cubics.push(cube as ICustomCube);
    //     const resultCubes = [...cubicsNot, ...cubics];
    //     dispatch(drawCube(resultCubes));
    // }

    static handleContextMenuPolyline(e: L.LeafletMouseEvent, dispatch: Function) {
        e.originalEvent.preventDefault();
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        dispatch(setMuftaMenuOpen(false));
        dispatch(setGeneralMenu(false));
        dispatch(setPolylineMenuOpen(true));
    }
    static handleMouseOverPolyline(e: L.LeafletMouseEvent, dispatch: Function, item: ICustomPolyline, drag: boolean, index: number, polylines: ICustomPolyline[], mufts: ICustomMarker[], itemMenu: boolean) {
        if (!drag && !itemMenu) {
            dispatch(setItemMenu(true));
            const owner = mufts.filter(muft => muft.id === item.owner);
            const to = mufts.filter(muft => muft.id === item.to);
            Polylines.changePolyLineWeight(dispatch, owner[0], to[0], polylines, 12);
        }
    }
    static handleMouseOutPolyline(e: L.LeafletMouseEvent, dispatch: Function, item: ICustomPolyline, index: number, polylines: ICustomPolyline[], mufts: ICustomMarker[]) {
        const owner = mufts.filter(muft => muft.id === item.owner);
        const to = mufts.filter(muft => muft.id === item.to);
        Polylines.changePolyLineWeight(dispatch, owner[0], to[0], polylines, 4);
        dispatch(setItemMenu(false));
    }
}
