import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { addPolyLines, addPolyLinesToArr, deleteCircle, makeDrawCircle, setAddLine, setGeneral } from '../../Redux/app/appSlice';
import { getAddLine, getCircleMenuOpen, getDrawArrCircles, getDrawItemLatLng, getGeneralId, getPolyLines, getTempPoly } from '../../Redux/app/appSelectors';
import { v4 as uuidv4 } from 'uuid';
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

    const handleAddLineFrom = () => {
        const obj = { ...drawItemLatLng, type: 'circle', role: 'general', id };
        const objPoly = {
            owner: id,
            start: {
                lat: drawItemLatLng.lat,
                lng: drawItemLatLng.lng,
            }
        }
        dispatch(addPolyLines(objPoly));
        dispatch(setGeneral(obj));
        dispatch(setAddLine(true));
        onClose();

    }
    const handleAddLineTo = () => {
        const objPoly = {
            ...tempPoly,
            to: id,
            end: {
                lat: drawItemLatLng.lat,
                lng: drawItemLatLng.lng
            },
        }
        dispatch(addPolyLinesToArr(objPoly));
        dispatch(setAddLine(false));
        onClose();
    }
    const handleMenuClickCircle = () => {
        const obj = { ...drawItemLatLng, type: 'circle', id: uuidv4() };
        dispatch(makeDrawCircle(obj));
        onClose();

    }
    const handleDeleteLine = () => {
        const idx = drawCircles.findIndex(item => item.id === id);
        const newArr = polyLines.filter(item => item.owner !== id && item.to !== id);
        dispatch(deleteCircle({ idx, newArr }));
        onClose();
    }
    if (circleMenuOpen) {
        return (
            <ContextMenuContainer style={{ left, top }}>
                <MenuItem disabled={!addLine} onClick={handleAddLineTo}>добавить линию сюда</MenuItem>
                <MenuItem onClick={handleAddLineFrom}>добавить линию отсюда</MenuItem>
                <MenuItem onClick={handleDeleteLine}>delete</MenuItem>
                <MenuItem onClick={() => onClose()}>закрыть</MenuItem>
            </ContextMenuContainer>
        );
    }
    return (
        <ContextMenuContainer style={{ left, top }}>
            <MenuItem onClick={handleMenuClickCircle}>Circle</MenuItem>
            <MenuItem onClick={() => onClose()}>Exit</MenuItem>
        </ContextMenuContainer>
    );
};

export default ContextMenu;