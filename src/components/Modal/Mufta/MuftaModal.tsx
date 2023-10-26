import { useDispatch } from "react-redux"
import { Button, Container, ModalContent, ModalText, ModalTitle, ModalWrapper, Select } from "../Modal.styled"
import { AppDispatch } from "../../../Redux/store";
import { drawMufta, setMuftaInfoModal } from "../../../Redux/map/mapSlice";
import React, { useState } from "react";
import { ICustomMarker, IInfo } from "../../../Mufts";
const selectInfo = [
    'Колодязь',
    'Опора',
    'Ручний ввод'
]
interface IMuftaModalProps {
    id: string;
    mufts: ICustomMarker[];
}
export const MuftaModal: React.FC<IMuftaModalProps> = ({ id, mufts }) => {
    const mufta = mufts.find(item => item.id === id) as ICustomMarker;
    const muftaInfo = mufta?.info as IInfo;
    const dispatch: AppDispatch = useDispatch();
    const [adr, setAdr] = useState('');
    const [loc, setLoc] = useState('');
    const [select, setSelect] = useState(selectInfo[0]);
    const [toggleInfo, setToggleInfo] = useState({ adr: false, loc: false, other: false });
    const handleChangeAdr = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdr(e.target.value);
    }
    const handleChangeLoc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoc(e.target.value);
    }
    const handleOnCLick = (flag: keyof typeof muftaInfo, value: string) => {
        muftaInfo[flag] = value;
        dispatch(drawMufta(mufts));
        setToggleInfo({
            adr: false,
            loc: false,
            other: false,
        })
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setSelect(value);
    }
    return <ModalWrapper>
        <ModalContent>
            <Container>
                <ModalTitle>Адреса</ModalTitle>
                {muftaInfo?.adress && !toggleInfo.adr && <><ModalText>{muftaInfo?.adress}</ModalText>
                    <Button type="button" onClick={() => {
                        setToggleInfo({
                            adr: !toggleInfo.adr,
                            loc: false,
                            other: false,
                        })
                    }}>Змінити</Button>
                </>}
                {!muftaInfo?.adress && !toggleInfo.adr && <Button type="button" onClick={() =>
                    setToggleInfo({
                        adr: !toggleInfo.adr,
                        loc: false,
                        other: false,
                    })
                }>Встановити</Button>}
                {toggleInfo.adr && <><input type="text" id="adr" onChange={handleChangeAdr} value={adr} />
                    <Button onClick={() => handleOnCLick('adress', adr)}>встановити</Button>
                </>}
            </Container>
            <Container>
                <ModalTitle>Місце розташування</ModalTitle>
                {muftaInfo?.location && !toggleInfo.loc && <><ModalText>{muftaInfo?.location}</ModalText>
                    <Button type="button" onClick={() => {
                        setToggleInfo({
                            adr: false,
                            loc: !toggleInfo.loc,
                            other: false,
                        })
                    }}>Змінити</Button>
                </>}
                {!muftaInfo?.location && !toggleInfo.loc && <Button type="button" onClick={() =>
                    setToggleInfo({
                        adr: false,
                        loc: !toggleInfo.loc,
                        other: false,
                    })
                }>Встановити</Button>}
                {toggleInfo.loc && <div style={{ display: 'block' }}>
                    <Select style={{ width: "100%", height: '50px' }} onChange={handleSelectChange} value={select}>
                        {selectInfo.map((prod, index) => (
                            <option key={index} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </Select>
                    {select === selectInfo[selectInfo.length - 1] && <input type="text" id="loc" onChange={handleChangeLoc} value={loc} />}
                    <Button onClick={() => handleOnCLick('location', select === selectInfo[selectInfo.length - 1] ? loc : select)}>встановити</Button>
                </div>}
            </Container>
            <Container>
                <ModalTitle>Інше</ModalTitle>
                <ModalText>Інше</ModalText>
            </Container>
            <Button onClick={() => dispatch(setMuftaInfoModal(false))}>Закрити</Button>
        </ModalContent>
    </ModalWrapper>
}