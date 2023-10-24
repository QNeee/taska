import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInfoModal, getOpticsColors } from '../../Redux/map/mapSelectors';
import { AppDispatch } from '../../Redux/store';
import { setInfoModal, setMainLineId, setTrack, setTrackData, setTrackIndex } from '../../Redux/map/mapSlice';
import { Container, ModalButton, ModalContent, ModalText, ModalTitle, ModalWrapper } from './Modal.styled';
import React from 'react';
import { ICustomPolyline } from '../../Polylines';
import { GeometryUtil, LatLng } from 'leaflet';
import { ICustomMarker } from '../../Mufts';
import { ICustomWardrobe } from '../../Wardrobe';

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
const Modal: React.FC<IModalProps> = ({ id, polyLines, muftsArr, wardrobesArr }) => {
    const dispatch: AppDispatch = useDispatch();
    const isOpen = useSelector(getInfoModal);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const colors = useSelector(getOpticsColors);
    const [data, setData] = useState<IData[]>([]);
    const poly = polyLines.find(item => item.id === id);
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
        const standart = mainLine?.standart;
        const ov = mainLine?.fiberOpticsCount;
        const length = GeometryUtil.length(poly?.getLatLngs() as LatLng[]);
        return { length: length.toFixed(2), producer, standart, mainLine, ownerId: owner?.id, ov };
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
    }, [colors, infoPoly, dispatch])
    return (
        <>
            {isOpen && (
                <ModalWrapper>
                    <ModalContent>
                        <Container>
                            <ModalTitle>Довжина</ModalTitle>
                            <ModalText>{infoPoly().length} М</ModalText>
                        </Container>
                        <Container>
                            <ModalTitle>Виробник</ModalTitle>
                            <ModalText>{infoPoly().producer}</ModalText>
                        </Container>
                        <Container>
                            <ModalTitle>Стандарт</ModalTitle>
                            <ModalText>{infoPoly().standart}</ModalText>
                        </Container>
                        <ModalButton onClick={() => setIsMenuOpen(!isMenuOpen)}>Ємність {infoPoly().ov !== 0 && `(${infoPoly().ov}    ОВ)`}</ModalButton>
                        {isMenuOpen ? <Container style={{ display: 'block', maxHeight: "200px", overflowY: 'auto', backgroundColor: 'grey' }}>
                            {data.length > 0 && data.map((item, index) => <div key={index}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <ModalText>{index + 1}<span style={{ color: item.color }}>{item.color}</span>{item.riska ? <span style={{ color: "white" }}>||</span> : null}</ModalText>
                                    <button onClick={(e) => onClickTrack(item.color, infoPoly().ownerId as string, index)} type='button'>відстежити</button>
                                </div >
                            </div>)}
                        </Container> : null}
                        <ModalButton onClick={() => dispatch(setInfoModal(false))}>Close</ModalButton>
                    </ModalContent>
                </ModalWrapper>
            )}
        </>
    );
};

export default Modal;