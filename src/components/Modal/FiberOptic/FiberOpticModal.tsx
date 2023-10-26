import { useDispatch } from "react-redux"
import { Button, Container, ModalContent, ModalText, ModalTitle, ModalWrapper, Select } from "../Modal.styled"
import { drawMufta, setFiberInfoModal } from "../../../Redux/map/mapSlice";
import { ICustomMarker, IOptic } from "../../../Mufts";
import React, { useState } from "react";
import { ICustomPolyline } from "../../../Polylines";
interface IFiberInfoModalProps {
    mufts: ICustomMarker[];
    id: string;
    mainLineId: string;
    polyLines: ICustomPolyline[];
}
const signalSelect = [
    'Eth',
    'ПК',
    'PON',
    'МАЛЬТИКАСТ',
    'Ручний ввод'
]
export const FiberOpticModal: React.FC<IFiberInfoModalProps> = ({ mainLineId, mufts, id, polyLines }) => {
    const poly = polyLines.find(item => item.id === mainLineId) as ICustomPolyline;
    const muft = mufts.find(item => item.id === poly.owner);
    const mainLine = muft?.mainLines;
    const opticInfo = mainLine?.flatMap(item => item.optics) as IOptic[];
    const needInfo = opticInfo.find(item => item.id === id) as IOptic;
    const [signalInfo, setSignalInfo] = useState(false);
    const [otherInfo, setOtherInfo] = useState(false);
    const [select, setSelect] = useState(signalSelect[0]);
    const [signalValue, setSignalValue] = useState('');
    const [otherValue, setOtherValue] = useState('');
    const dispatch = useDispatch();
    const handleOnCLick = (flag: keyof typeof needInfo, value: string) => {
        needInfo[flag] = value;
        dispatch(drawMufta(mufts));
        setSignalInfo(false);
        setOtherInfo(false);
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setSelect(value);
    }
    return <ModalWrapper>
        <ModalContent>
            <Container>
                <ModalTitle>Сигнал</ModalTitle>
                {needInfo?.signal && !signalInfo && <><ModalText>{needInfo?.signal}</ModalText>
                    <Button type="button" onClick={() => {
                        setSignalInfo(!signalInfo);
                    }}>Змінити</Button>
                </>}
                {!needInfo?.signal && !signalInfo && <Button type="button" onClick={() =>
                    setSignalInfo(!signalInfo)
                }>Встановити</Button>}
                {signalInfo && <div style={{ display: 'block' }}>
                    <Select style={{ width: "100%", height: '50px' }} onChange={handleSelectChange} value={select}>
                        {signalSelect.map((prod, index) => (
                            <option key={index} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </Select>
                    {select === signalSelect[signalSelect.length - 1] && <input type="text" id="loc" onChange={(e) => setSignalValue(e.target.value)} value={signalValue} />}
                    <Button onClick={() => handleOnCLick('signal', select === signalSelect[signalSelect.length - 1] ? signalValue : select)}>встановити</Button>
                </div>}
            </Container>
            <Container>
                <ModalTitle>Додаткова інформація</ModalTitle>
                {needInfo?.other && !otherInfo && <><ModalText>{needInfo?.other}</ModalText>
                    <Button type="button" onClick={() => {
                        setOtherInfo(!otherInfo);
                    }}>Змінити</Button>
                </>}
                {!needInfo?.other && !otherInfo && <Button type="button" onClick={() =>
                    setOtherInfo(!otherInfo)
                }>Встановити</Button>}
                {otherInfo && <div style={{ display: 'block' }}>
                    <input type="text" value={otherValue} onChange={(e) => setOtherValue(e.target.value)} />
                    <Button onClick={() => handleOnCLick('other', otherValue)}>встановити</Button>
                </div>}
            </Container>
            <Button onClick={() => dispatch(setFiberInfoModal(false))}>Закрити</Button>
        </ModalContent>
    </ModalWrapper >
}