import { useDispatch } from "react-redux";
import { Button, FullWidthInput, InputContainer, ModalContent, ModalTitle, ModalWrapper, Select } from "./Modal.styled"
import React, { useState } from 'react';
import { AppDispatch } from "../../Redux/store";
import { ILineStart, drawPolyline, updateMufta, updateWardrobe } from "../../Redux/map/mapSlice";
import { ContextMenuMuftaInterface } from "../../interface/ContextMenuMuftaInterface";
import { setAddLine } from "../../Redux/app/appSlice";
import { ICustomMarker, IStatsMainLine } from "../../Mufts";
import { ICustomWardrobe } from "../../Wardrobe";
import { colorModule, colorOptics, moduleCounts, producers } from "./modalHelper";
interface IModalOpticsProps {
    muftsArr: ICustomMarker[],
    item: ICustomMarker | ICustomWardrobe | undefined;
    lineStart: ILineStart;
    onClose: () => void;
    wardrobesArr: ICustomWardrobe[];
}

export const MakeLineModal: React.FC<IModalOpticsProps> = ({ onClose, muftsArr, wardrobesArr, item, lineStart }) => {
    const [fiberOptic, setFiberOptic] = useState(0);
    const dispatch: AppDispatch = useDispatch();
    const formInitial: IStatsMainLine = { producer: producers[0], moduleCounts: moduleCounts[0], colorModule: colorModule[0], colorOptic: colorOptics[0] }
    const [form, setForm] = useState<IStatsMainLine>(formInitial);
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
        if (!fiberOptic) return;
        const { type, data, polyLine } = ContextMenuMuftaInterface.handleAddLineTo(muftsArr, item?.id as string, lineStart, fiberOptic, form, wardrobesArr);
        if (type === 'muft') {
            dispatch(updateMufta(data.mufts));
        } else {
            dispatch(updateWardrobe(data));
        }
        dispatch(drawPolyline(polyLine));
        dispatch(setAddLine(false));
        onClose();
        setForm(formInitial);
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
                <Select id="moduleCounts" onChange={handleSelectChange}>
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