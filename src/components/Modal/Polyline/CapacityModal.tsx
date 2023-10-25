import React from "react";
import { IData } from "./PolylineModal"
import { Container, ModalText } from "../Modal.styled";
interface ICapacityModalProps {
    data: IData[];
    onClickTrack: Function;
    infoPoly: Function;
}

export const CapacityModal: React.FC<ICapacityModalProps> = ({ data, onClickTrack, infoPoly }) => {
    return <Container style={{ display: 'block', maxHeight: "200px", overflowY: 'auto', backgroundColor: 'grey' }}>
        {data.map((item, index) => <div key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ModalText>{index + 1}<span style={{ color: item.color }}>{item.color === '#228b22' ? 'nature' : item.color}</span>{item.riska ? <span style={{ color: "white" }}>||</span> : null}</ModalText>
                <button onClick={(e) => onClickTrack(item.color, infoPoly().ownerId as string, index)} type='button'>відстежити</button>
            </div >
        </div>)}
    </Container>
}