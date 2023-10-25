import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInfoModal } from '../../Redux/map/mapSelectors';
import { AppDispatch } from '../../Redux/store';
import { setInfoModal, setMainLineId, setTrack, setTrackData, setTrackIndex } from '../../Redux/map/mapSlice';
import { Button, ButtonWrapper, Container, ModalButton, ModalContent, ModalText, ModalTitle, ModalWrapper } from './Modal.styled';
import React from 'react';
import { ICustomPolyline } from '../../Polylines';
import { GeometryUtil, LatLng } from 'leaflet';
import { ICustomMarker } from '../../Mufts';
import { ICustomWardrobe } from '../../Wardrobe';
import { getColors } from './colorsHelper';
import { CapacityModal } from './CapacityModal';
import { ChangeInfoModal } from './InfoModal';
import { ChangeActualLength } from './ChangeActualLength';
import { ChangeGasket } from './ChangeGasket';

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
    const [menuOpen, setMenuOpen] = useState({ capacity: false, info: false });
    const [changeMenuOpen, setChangeMenuOpen] = useState({ length: false, gasket: false });
    const [data, setData] = useState<IData[]>([]);
    const mufts = [...muftsArr];
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
        const opticColors = mainLine?.colorOptic;
        const ov = mainLine?.fiberOpticsCount;
        const length = GeometryUtil.length(poly?.getLatLngs() as LatLng[]);
        const facLength = mainLine?.length;
        const gasket = mainLine?.typeOfGasket;
        return { length: length.toFixed(2), opticColors, producer, gasket, mainLine, ownerId: owner?.id, ov, facLength };
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
            {isOpen && (
                <ModalWrapper>
                    <ModalContent>
                        <Container>
                            <ModalTitle>Проектна Довжина</ModalTitle>
                            <ModalText>{infoPoly().length} М</ModalText>
                        </Container>
                        <Container>
                            <ModalTitle>Виробник</ModalTitle>
                            <ModalText>{infoPoly().producer}</ModalText>
                        </Container>
                        <Container>
                            <ModalTitle>Тип прокладки</ModalTitle>
                            {infoPoly()?.gasket && !changeMenuOpen.gasket && <><ModalText>{infoPoly()?.gasket}</ModalText>
                                <Button type='button' onClick={() => {
                                    setChangeMenuOpen({ length: false, gasket: !changeMenuOpen.gasket })
                                }}>змінити</Button>
                            </>
                            }
                            {!infoPoly()?.gasket && !changeMenuOpen.gasket && <Button onClick={() => setChangeMenuOpen({ length: false, gasket: !changeMenuOpen.gasket })}>Встановити</Button>}
                            {changeMenuOpen.gasket && !changeMenuOpen.length && <ChangeGasket changeMenuOpen={changeMenuOpen} openChangeGasketMenu={setChangeMenuOpen} mufts={mufts} poly={poly as ICustomPolyline} />}
                        </Container>
                        <Container>
                            <ModalTitle>Фактична Довжина</ModalTitle>
                            {infoPoly()?.facLength && !changeMenuOpen.length && <><ModalText>{infoPoly()?.facLength + ' M'}</ModalText>
                                <Button type='button' onClick={() => {
                                    setChangeMenuOpen({ length: !changeMenuOpen.length, gasket: false })
                                }}>змінити</Button>
                            </>
                            }
                            {!infoPoly()?.facLength && !changeMenuOpen.length && <Button onClick={() => setChangeMenuOpen({ length: !changeMenuOpen.length, gasket: false })}>Встановити</Button>}
                            {changeMenuOpen.length && !changeMenuOpen.gasket && <ChangeActualLength changeMenuOpen={changeMenuOpen} openActualLengthMenu={setChangeMenuOpen} mufts={mufts} poly={poly as ICustomPolyline} />}
                        </Container>
                        <ButtonWrapper>
                            <ModalButton onClick={() => setMenuOpen({ capacity: !menuOpen.capacity, info: false })}>Ємність {infoPoly().ov !== 0 && `(${infoPoly().ov}    ОВ)`}</ModalButton>
                            {menuOpen.capacity ? <CapacityModal data={data} onClickTrack={onClickTrack} infoPoly={infoPoly} /> : null}
                            <ModalButton onClick={() => setMenuOpen({ capacity: false, info: !menuOpen.info })}>Змінити Інформацію</ModalButton>
                            {menuOpen.info ? <ChangeInfoModal data={data} onClickTrack={onClickTrack} infoPoly={infoPoly} /> : null}
                            <ModalButton onClick={() => dispatch(setInfoModal(false))}>Закрити</ModalButton>
                        </ButtonWrapper>
                    </ModalContent>
                </ModalWrapper >
            )}
        </>
    );
};

export default Modal;