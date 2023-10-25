import React, { useState } from "react";
import { Button, Container, InputContainer } from "./Modal.styled";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { drawMufta } from "../../Redux/map/mapSlice";
import { ICustomMarker, IMainLine } from "../../Mufts";
import { ICustomPolyline } from "../../Polylines";
interface IActuialLengthProps {
    changeMenuOpen: { length: boolean, gasket: boolean };
    openActualLengthMenu: Function;
    mufts: ICustomMarker[];
    poly: ICustomPolyline
}
export const ChangeActualLength: React.FC<IActuialLengthProps> = ({ mufts, poly, openActualLengthMenu, changeMenuOpen }) => {
    const [inputValue, setInputValue] = useState('');
    const dispatch: AppDispatch = useDispatch();
    const changeLength = () => {
        const muft = mufts.find(item => item.id === poly?.owner) as ICustomMarker;
        const mainLine = muft?.mainLines?.find(item => item.owner === muft.id) as IMainLine;
        if (mainLine) mainLine.length = parseInt(inputValue);
        dispatch(drawMufta(mufts));
        openActualLengthMenu({ length: !changeMenuOpen.length, gasket: false });
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setInputValue(value);
    }
    return <Container>
        <InputContainer>
            <input type="text" id='inputValue' value={inputValue} onChange={handleInputChange} />
            <Button type='button' onClick={() => changeLength()}>встановити</Button>
        </InputContainer>
    </Container>
}