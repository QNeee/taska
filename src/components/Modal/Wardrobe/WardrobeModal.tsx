import { useDispatch } from "react-redux"
import { Button, Container, ModalButton, ModalContent, ModalText, ModalTitle, ModalWrapper, Select } from "../Modal.styled"
import { AppDispatch } from "../../../Redux/store";
import { drawWardrobe, setWardrobeInfoModal } from "../../../Redux/map/mapSlice";
import React, { useState } from "react";
import { IInfo } from "../../../Mufts";
import { ICustomWardrobe } from "../../../Wardrobe";
const selectInfo = [
    'Колодязь',
    'Опора',
    'Ручний ввод'
]
interface IMuftaModalProps {
    id: string;
    wardrobes: ICustomWardrobe[];
}
export const WardrobeModal: React.FC<IMuftaModalProps> = ({ id, wardrobes }) => {
    const wardrobe = wardrobes.find(item => item.id === id) as ICustomWardrobe;
    const wardrobeInfo = wardrobe?.info as IInfo;
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
    const handleOnCLick = (flag: keyof typeof wardrobeInfo, value: string) => {
        wardrobeInfo[flag] = value;
        dispatch(drawWardrobe(wardrobes));
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
                {wardrobeInfo?.adress && !toggleInfo.adr && <><ModalText>{wardrobeInfo?.adress}</ModalText>
                    <Button type="button" onClick={() => {
                        setToggleInfo({
                            adr: !toggleInfo.adr,
                            loc: false,
                            other: false,
                        })
                    }}>Змінити</Button>
                </>}
                {!wardrobeInfo?.adress && !toggleInfo.adr && <Button type="button" onClick={() =>
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
                {wardrobeInfo?.location && !toggleInfo.loc && <><ModalText>{wardrobeInfo?.location}</ModalText>
                    <Button type="button" onClick={() => {
                        setToggleInfo({
                            adr: false,
                            loc: !toggleInfo.loc,
                            other: false,
                        })
                    }}>Змінити</Button>
                </>}
                {!wardrobeInfo?.location && !toggleInfo.loc && <Button type="button" onClick={() =>
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
            <ModalButton onClick={() => dispatch(setWardrobeInfoModal(false))}>Закрити</ModalButton>
        </ModalContent>
    </ModalWrapper>
}