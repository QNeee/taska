import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { getAddLine, getCircleMenuOpen, getDrawArrCircles, getDrawItemLatLng, getGeneralId, getPolyLines, getTempPoly } from '../../Redux/app/appSelectors';

import { ContextMenuInterface } from '../../interface/ContextMenuInterface';
interface Iprops {
    left: number,
    top: number,
    onClose: Function
}
const ContextMenuContainer = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 1000;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuItem = styled.button`
  margin: 5px 0;
  padding: 8px 15px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;
const ContextMenu = ({ left, top, onClose }: Iprops) => {
    const dispatch: AppDispatch = useDispatch();
    const drawItemLatLng = useSelector(getDrawItemLatLng);
    const circleMenuOpen = useSelector(getCircleMenuOpen);
    const polyLines = useSelector(getPolyLines);
    const drawCircles = useSelector(getDrawArrCircles);
    const tempPoly = useSelector(getTempPoly);
    const id = useSelector(getGeneralId);
    const addLine = useSelector(getAddLine);
    if (circleMenuOpen) {
        return (
            <ContextMenuContainer style={{ left, top }}>
                <MenuItem disabled={!addLine} onClick={() => {
                    ContextMenuInterface.handleAddLineTo(tempPoly, drawItemLatLng, id, dispatch)
                    onClose();
                }}>добавить линию сюда</MenuItem>
                <MenuItem onClick={() => {
                    ContextMenuInterface.handleAddLineFrom(drawItemLatLng, dispatch, id)
                    onClose();
                }}>добавить линию отсюда</MenuItem>
                <MenuItem onClick={() => {
                    ContextMenuInterface.handleDeleteMufta(drawCircles, polyLines, id, dispatch)
                    onClose();
                }}>delete</MenuItem>
                <MenuItem onClick={() => onClose()}>закрыть</MenuItem>
            </ContextMenuContainer>
        );
    }
    return (
        <ContextMenuContainer style={{ left, top }}>
            <MenuItem onClick={() => {
                ContextMenuInterface.handleMenuClickMufta(drawItemLatLng, dispatch)
                onClose()
            }}>Circle</MenuItem>
            <MenuItem onClick={() => onClose()}>Exit</MenuItem>
        </ContextMenuContainer>
    );
};

export default ContextMenu;