import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChangeLineModal, getInfoModal } from '../../Redux/map/mapSelectors';
import { AppDispatch } from '../../Redux/store';
import { setInfoModal, setMainLineId, setTrack, setTrackData, setTrackIndex } from '../../Redux/map/mapSlice';
import React from 'react';
import { ICustomPolyline } from '../../Polylines';
import { GeometryUtil, LatLng } from 'leaflet';
import { ICustomMarker } from '../../Mufts';
import { ICustomWardrobe } from '../../Wardrobe';
import { getColors } from './colorsHelper';
import { InfoModal } from './InfoModal';
import { ChangeInfoModal } from './ChangeInfoModal';

interface IModalProps {
    id: string,
    polyLines: ICustomPolyline[],
    muftsArr: ICustomMarker[],
    wardrobesArr: ICustomWardrobe[],
}
export interface IData {
    color: string,
    riska?: number,
}
export interface IMenuOpen {
    capacity: boolean;
    info: boolean;
}
export interface IChangeMenuOpen {
    gasket: boolean;
    length: boolean;
}
const Modal: React.FC<IModalProps> = ({ id, polyLines, muftsArr, wardrobesArr }) => {
    const dispatch: AppDispatch = useDispatch();
    const isOpen = useSelector(getInfoModal);
    const changeLineModal = useSelector(getChangeLineModal);
    const [menuOpen, setMenuOpen] = useState({ capacity: false, info: false });
    const [changeMenuOpen, setChangeMenuOpen] = useState({ length: false, gasket: false });
    const [data, setData] = useState<IData[]>([]);
    const mufts = [...muftsArr];
    const poly = polyLines.find(item => item.id === id) as ICustomPolyline;
    const needMufts = muftsArr.filter(item => item.linesIds?.includes(poly?.id as string));
    let to: ICustomMarker | ICustomWardrobe;
    const owner = needMufts.find(item => item.id === poly?.owner);
    const toMuft = needMufts.find(item => item.id === poly?.to);
    if (!toMuft) {
        to = wardrobesArr.find(item => item.id === poly?.to) as ICustomWardrobe;
    } else {
        to = toMuft;
    }
    const infoPoly = useCallback(() => {
        const mainLine = owner?.mainLines?.find(o => to.mainLines?.some(t => o.id === t.id));
        const producer = mainLine?.producer;
        const opticColors = mainLine?.colorOptic;
        const ov = mainLine?.fiberOpticsCount;
        const length = GeometryUtil.length(poly?.getLatLngs() as LatLng[]);
        const facLength = mainLine?.length;
        const gasket = mainLine?.typeOfGasket;
        const moduleCount = mainLine?.moduleCounts;
        const colorModule = mainLine?.colorModule;
        return { length: length.toFixed(2), opticColors, colorModule, moduleCount, producer, gasket, mainLine, ownerId: owner?.id, ov, facLength };
    }, [owner?.id, owner?.mainLines, poly, to])
    const onClickTrack = (color: string, idOwner: string, index: number) => {
        const obj = {
            color,
            idOwner,
            index,
            track: true,
        }
        dispatch(setTrack(obj));
        dispatch(setTrackIndex(index));
        dispatch(setInfoModal(false));
        dispatch(setMainLineId(id));
    }
    useEffect(() => {
        const size = infoPoly().ov as number;
        const colors = getColors(infoPoly()?.opticColors as string) as string[];
        const newArr: IData[] = [];
        for (let i = 0; i < size; i++) {
            const colorIndex = i % colors.length;
            newArr.push({ color: colors[colorIndex] });
        }
        for (let i = 0; i < newArr.length; i++) {
            for (let j = i + 1; j < newArr.length; j++) {
                if (newArr[i].color === newArr[j].color) {
                    newArr[j].riska = 1;
                }
            }
        }
        setData(newArr);
        dispatch(setTrackData(newArr));
    }, [infoPoly, dispatch])

    return (
        <>
            {isOpen && !changeLineModal && (
                <InfoModal infoPoly={infoPoly} changeMenuOpen={changeMenuOpen}
                    setChangeMenuOpen={setChangeMenuOpen} mufts={mufts} poly={poly}
                    menuOpen={menuOpen} setMenuOpen={setMenuOpen} data={data}
                    onClickTrack={onClickTrack} setInfoModal={setInfoModal} />
            )}
            {!isOpen && changeLineModal && (
                <ChangeInfoModal prod={infoPoly()?.producer as string} mC={infoPoly()?.moduleCount as string}
                    cM={infoPoly()?.colorModule as string} cO={infoPoly().opticColors as string} ov={infoPoly()?.ov} mufts={mufts} poly={poly} />
            )}
        </>
    );
};

export default Modal;