import React, { useState } from "react";
import { Button, Container, Select } from "../Modal.styled"
import { ICustomMarker, IMainLine } from "../../../Mufts";
import { ICustomPolyline } from "../../../Polylines";
import { drawMufta } from "../../../Redux/map/mapSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../Redux/store";
const gaskets = [
    'Повітряне',
    'Земляне',
    'По дахах'
];
interface IChangeGasketProps {
    changeMenuOpen: { length: boolean, gasket: boolean };
    openChangeGasketMenu: Function;
    mufts: ICustomMarker[];
    poly: ICustomPolyline
}
export const ChangeGasket: React.FC<IChangeGasketProps> = ({ mufts, poly, openChangeGasketMenu, changeMenuOpen }) => {
    const dispatch: AppDispatch = useDispatch();
    const [value, setValue] = useState(gaskets[0]);
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
    };
    const changeGasket = () => {
        const muft = mufts.find(item => item.id === poly?.owner) as ICustomMarker;
        const mainLine = muft?.mainLines?.find(item => item.owner === muft.id) as IMainLine;
        if (mainLine) mainLine.typeOfGasket = value;
        dispatch(drawMufta(mufts));
        openChangeGasketMenu({ length: false, gasket: !changeMenuOpen.gasket });
    }
    return <Container>
        <Select onChange={handleSelectChange}>
            {gaskets.map((prod, index) => (
                <option key={index} value={prod}>
                    {prod}
                </option>
            ))}
        </Select>
        <Button type="button" onClick={changeGasket}>Встановити</Button>
    </Container>
}