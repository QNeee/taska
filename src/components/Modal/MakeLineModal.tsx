import { useDispatch } from "react-redux";
import { Button, FullWidthInput, InputContainer, ModalContent, ModalTitle, ModalWrapper, Select } from "./Modal.styled"
import React, { useState } from 'react';
import { AppDispatch } from "../../Redux/store";
import { ILineStart, drawPolyline, updateMufta, updateWardrobe } from "../../Redux/map/mapSlice";
import { ContextMenuMuftaInterface } from "../../interface/ContextMenuMuftaInterface";
import { setAddLine } from "../../Redux/app/appSlice";
import { ICustomMarker, IStatsMainLine } from "../../Mufts";
import { ICustomWardrobe } from "../../Wardrobe";
import { ContextMenuWardrobe } from "../../interface/ContextMenuWardrobe";
interface IModalOpticsProps {
    muftsArr: ICustomMarker[],
    item: ICustomMarker | ICustomWardrobe | undefined;
    lineStart: ILineStart;
    onClose: () => void;
    wardrobesArr: ICustomWardrobe[];
}
const producers = [
    'nissan', 'barabn', 'taranaas'
];
const standard = [
    'АМЕРИКА',
    'ЮЖКАБЕЛЬ',
];
export const MakeLineModal: React.FC<IModalOpticsProps> = ({ onClose, muftsArr, wardrobesArr, item, lineStart }) => {
    const [fiberOptic, setFiberOptic] = useState(0);
    const dispatch: AppDispatch = useDispatch();
    const formInitial: IStatsMainLine = { producer: producers[0], standart: standard[0] }
    const [form, setForm] = useState<IStatsMainLine>(formInitial);
    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiberOptic(Number(e.target.value));
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
        if (item?.type === 'muft') {
            const { data, idOwner, idTo, polyLine } = ContextMenuMuftaInterface.handleAddLineTo(muftsArr, item?.id as string, lineStart, fiberOptic, form);
            dispatch(updateMufta({ idOwner, idTo, data }));
            dispatch(drawPolyline(polyLine));
        } else {
            const { data, idOwner, idTo, polyLine } = ContextMenuWardrobe.handleAddLineTo(muftsArr, wardrobesArr, item?.id as string, lineStart, fiberOptic, form);
            dispatch(updateWardrobe({ idOwner, idTo, data }));
            dispatch(drawPolyline(polyLine));
        }
        dispatch(setAddLine(false));
        onClose();
        setForm(formInitial);
    }
    return <ModalWrapper>
        <ModalContent>
            <ModalTitle>Заповніть форму</ModalTitle>
            <form onSubmit={onSubmitForm}>
                <InputContainer>
                    Кілкість ОВ
                    <FullWidthInput type="number" value={fiberOptic} onChange={onChangeInput} />
                    Виробник
                    <Select id="producer" onChange={handleSelectChange}>
                        {producers.map((prod, index) => (
                            <option key={index} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </Select>
                    Стандарт
                    <Select id="standart" onChange={handleSelectChange}>
                        {standard.map((prod, index) => (
                            <option key={index} value={prod}>
                                {prod}
                            </option>
                        ))}
                    </Select>
                    <Button type="submit">ok</Button>
                </InputContainer>
            </form>
        </ModalContent>
    </ModalWrapper>
}