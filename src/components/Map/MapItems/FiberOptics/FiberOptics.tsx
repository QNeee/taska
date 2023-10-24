import { useDispatch, useSelector } from "react-redux";
import { getMainLine, getMufts, getPolyLines, getTrackData, getTrackIndex, getWardrobes } from "../../../../Redux/map/mapSelectors";
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
    const polyLines = useSelector(getPolyLines);
    const mainLineId = useSelector(getMainLine);
    const wardrobes = useSelector(getWardrobes);
    const dispatch = useDispatch();
    const makeFibers = () => {
        const poly = polyLines.find(item => item.id === mainLineId);
        const owner = muftsArr.find(item => item.id === poly?.owner);
        const mufTto = muftsArr.find(item => item.id === poly?.to);
        let to: ICustomMarker | ICustomWardrobe;
        if (!mufTto) {
            to = wardrobes.find(item => item.id === poly?.to) as ICustomWardrobe;
        } else {
            to = mufTto;
        }
        return owner?.fibers?.filter(fib => to?.fibers?.some(fib1 => fib.id === fib1.id));
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