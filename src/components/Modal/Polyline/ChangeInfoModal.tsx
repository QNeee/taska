import React, { useState } from "react";
import { Button, FullWidthInput, InputContainer, ModalContent, ModalTitle, ModalWrapper, Select } from "../Modal.styled"
import { colorModule, colorOptics, moduleCounts, producers } from "./modalHelper";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../Redux/store";
import { drawMufta, setChangeLineModal } from "../../../Redux/map/mapSlice";
import { ICustomMarker, IMainLine } from "../../../Mufts";
import { ICustomPolyline } from "../../../Polylines";
interface IChangeInfoModalProps {
    prod: string;
    mC: string;
    cM: string;
    cO: string;
    ov?: number;
    mufts: ICustomMarker[];
    poly: ICustomPolyline;
}
export const ChangeInfoModal: React.FC<IChangeInfoModalProps> = ({ mufts, poly, prod, mC, cM, cO, ov }) => {
    let [fiberOptic, setFiberOptic] = useState(ov);
    const initalState = { producer: prod, moduleCounts: mC, colorModule: cM, colorOptic: cO }
    const dispatch: AppDispatch = useDispatch();
    const [form, setForm] = useState(initalState);
    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiberOptic(Number(parseInt(e.target.value) > 12 ? 12 : e.target.value));
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setForm(prev => ({
            ...prev,
            [id]: value
        }))
    }
    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const needMufts = mufts.filter(item => item.id === poly.owner || item.id === poly.to);
        const muftOwner = needMufts.find(item => item.id === poly.owner);
        const muftTo = needMufts.find(item => item.id === poly.to);
        for (const muft of needMufts) {
            const mainLine = muft.mainLines as IMainLine[];
            for (const line of mainLine) {
                if (line.owner === muftOwner?.id && line.to === muftTo?.id) {
                    line.fiberOpticsCount = fiberOptic;
                    line.colorModule = form.colorModule;
                    line.colorOptic = form.colorOptic;
                    line.colorModule = form.colorModule;
                    line.producer = form.producer;
                }
            }
        }
        dispatch(drawMufta(mufts));
        dispatch(setChangeLineModal(false));
        setForm(initalState);
    }
    return <ModalWrapper>
        <ModalContent>
            <ModalTitle>Заповніть форму</ModalTitle>
            <form onSubmit={onSubmitForm}>
                Виробник Кабелю
                <Select id="producer" onChange={handleSelectChange}>
                    {producers.map((prod, index) => (
                        <option key={index} value={prod}>
                            {prod}
                        </option>
                    ))}
                </Select>
                Кількість Модулів в кабелі
                <Select id="moduleCounts" onChange={handleSelectChange} value={form.moduleCounts}>
                    {moduleCounts.map((prod, index) => (
                        <option key={index} value={prod}>
                            {prod}
                        </option>
                    ))}
                </Select>
                {parseInt(form.moduleCounts) === 1 && <div>
                    <InputContainer>
                        Кілкість Волокон в кабелі
                        <FullWidthInput type="text" value={fiberOptic} onChange={onChangeInput} />
                    </InputContainer>
                    Колір Волокон
                    <Select id="colorOptic" onChange={handleSelectChange}>
                        {colorOptics.map((prod, index) => (
                            <option key={index} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </Select>
                </div>}
                {parseInt(form.moduleCounts) > 1 && <div>
                    Колір модулів в кабелі
                    <Select id="colorModule" onChange={handleSelectChange}>
                        {colorModule.map((prod, index) => (
                            <option key={index} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </Select>
                    <InputContainer>
                        Кілкість Волокон в модулі
                        <FullWidthInput type="number" value={fiberOptic} onChange={onChangeInput} max={12} />
                    </InputContainer>
                    Колір Волокон
                    <Select id="colorOptic" onChange={handleSelectChange}>
                        {colorOptics.map((prod, index) => (
                            <option key={index} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </Select>
                </div>}
                <Button type="submit">ok</Button>
            </form>
        </ModalContent>
    </ModalWrapper>
}
