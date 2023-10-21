import { useDispatch, useSelector } from "react-redux";
import { getMainLine, getMufts, getTrackData, getTrackIndex, getWardrobes } from "../../../../Redux/map/mapSelectors";
import { Polyline } from "react-leaflet";
import { LatLng } from "leaflet";
import { TrackerHelper } from "./TrackerHelper";
import { setContextMenu, setContextMenuXY, setId } from "../../../../Redux/map/mapSlice";
import { ContextMenuFiberInterface } from "../../../../interface/ContextMenuFiberIntrface";
import { ICustomMarker } from "../../../../Mufts";
import { ICustomWardrobe } from "../../../../Wardrobe";

interface IFiberOpticsProps {
    idOnwer: string;
    color: string;
    index: number;
}

export const FiberOptics: React.FC<IFiberOpticsProps> = ({ idOnwer }) => {
    const muftsArr = useSelector(getMufts);
    const data = useSelector(getTrackData);
    const trackIndex = useSelector(getTrackIndex);
    const mainLineId = useSelector(getMainLine);
    const wardrobes = useSelector(getWardrobes);
    const dispatch = useDispatch();
    const makeFibers = () => {
        let to: ICustomMarker | ICustomWardrobe;
        const needMufts = muftsArr.filter(item => item.linesIds?.includes(mainLineId));
        const first = needMufts[0];
        const second = needMufts[1];
        if (!second) {
            to = wardrobes.filter(item => item.linesIds?.includes(mainLineId))[0];
        } else {
            to = second;
        }
        return first?.fibers?.filter(fib => to.fibers?.some(fib1 => fib.id === fib1.id));
    }
    const fibers = makeFibers();
    return (
        <>
            <TrackerHelper />
            {fibers && fibers.length > 0 ? fibers.map((item) => {
                const latLng = item.getLatLngs() as LatLng[];
                return <Polyline
                    positions={latLng.map((cord) => cord)}
                    key={item.id}
                    pathOptions={{ color: data[trackIndex]?.color, weight: item.options.weight }}
                    eventHandlers={{
                        contextmenu: (e) => {
                            e.originalEvent.preventDefault();
                            dispatch(setId(item.id));
                            dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
                            const menu = ContextMenuFiberInterface.OpenMenu();
                            dispatch(setContextMenu(menu));
                        }
                    }}
                />

            }) : null}
        </>
    );
}