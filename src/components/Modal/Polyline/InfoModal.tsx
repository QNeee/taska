import React from "react"
import { Button, ButtonWrapper, Container, ModalButton, ModalContent, ModalText, ModalTitle, ModalWrapper } from "../Modal.styled"
import { ChangeGasket } from "./ChangeGasket";
import { ICustomMarker } from "../../../Mufts";
import { ICustomPolyline } from "../../../Polylines";
import { ChangeActualLength } from "./ChangeActualLength";
import { IChangeMenuOpen, IData, IMenuOpen } from "./PolylineModal";
import { CapacityModal } from "./CapacityModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../Redux/store";
import { setChangeLineModal } from "../../../Redux/map/mapSlice";

interface IInfoModalProps {
    infoPoly: Function;
    changeMenuOpen: IChangeMenuOpen;
    setChangeMenuOpen: Function;
    mufts: ICustomMarker[];
    poly: ICustomPolyline;
    menuOpen: IMenuOpen;
    setMenuOpen: Function;
    data: IData[];
    onClickTrack: Function;
    setInfoModal: Function;
}

export const InfoModal: React.FC<IInfoModalProps> = ({ setInfoModal, onClickTrack, data, setMenuOpen, menuOpen, mufts, poly, infoPoly, changeMenuOpen, setChangeMenuOpen }) => {
    const dispatch: AppDispatch = useDispatch();
    return <ModalWrapper>
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
                <ModalButton onClick={() => {
                    dispatch(setChangeLineModal(true));
                    dispatch(setInfoModal(false));
                }}>Змінити Інформацію</ModalButton>
                <ModalButton onClick={() => dispatch(setInfoModal(false))}>Закрити</ModalButton>
            </ButtonWrapper>
        </ModalContent>
    </ModalWrapper >
}