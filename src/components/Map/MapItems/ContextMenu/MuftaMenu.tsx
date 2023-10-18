import { ContextMenuMuftaInterface } from '../../../../interface/ContextMenuMuftaInterface';
import { ILineStart, deleteMufta, drawPolyline, setContextMenu, setLineStart, setToggleCoordsApply, updateMufta } from '../../../../Redux/map/mapSlice';
import { setAddLine } from '../../../../Redux/app/appSlice';
import { ContextMenuInterface } from '../../../../interface/ContextMenuInterface';
import { ChangeEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../Redux/store';
import { ICustomMarker } from '../../../../Mufts';
import { ICustomPolyline } from '../../../../Polylines';
import { ICustomCube } from '../../../../Cubes';
import { ContextMenuContainer, MenuItem } from './ContextMenu.styled';

interface IMufraMenuProps {
    left: number;
    top: number;
    addLine: boolean;
    form: { lat: number, lng: number };
    handleInputChange: ChangeEventHandler<HTMLInputElement>;
    muftsArr: ICustomMarker[];
    id: string;
    lineStart: ILineStart;
    polyLinesArr: ICustomPolyline[];
    cubesArr: ICustomCube[];
    item: ICustomMarker;
}
export const MuftaMenu: React.FC<IMufraMenuProps> = ({ left, top, item, addLine, form, handleInputChange, muftsArr, id, lineStart, polyLinesArr, cubesArr }) => {
    const dispatch: AppDispatch = useDispatch();
    return (
        <ContextMenuContainer style={{ left, top }}>
            <MenuItem disabled={!addLine} onClick={() => {
                const { data, idOwner, idTo, polyLine } = ContextMenuMuftaInterface.handleAddLineTo(muftsArr, id, lineStart);
                dispatch(updateMufta({ idOwner, idTo, data }));
                dispatch(drawPolyline(polyLine));
                dispatch(setAddLine(false));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Додати лінію сюди</MenuItem>
            <MenuItem onClick={() => {
                const data = ContextMenuMuftaInterface.handleAddLineFrom(muftsArr, id)
                dispatch(setLineStart(data));
                dispatch(setAddLine(true));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Додати лінію звідси</MenuItem>
            {item?.drag && <div style={{
                width: "100%"
            }}>
                lat
                <input type="text" id="lat" value={form.lat} onChange={handleInputChange} />
                lng
                <input type="text" id="lng" value={form.lng} onChange={handleInputChange} />
            </div>}
            <MenuItem onClick={() => {
                const { index, data, polysArr } = ContextMenuMuftaInterface.handleApplyCoordinates(id, muftsArr, form, polyLinesArr);
                dispatch(setToggleCoordsApply({ index, data, polysArr }));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>
                {item?.drag ? "Застосувати координати" : "Змінити координати"}
            </MenuItem>
            <MenuItem onClick={() => {
                const { mufts, polyLines, cubes } = ContextMenuMuftaInterface.handleDeleteMufta(muftsArr, id, polyLinesArr, cubesArr)
                dispatch(deleteMufta({ mufts, polyLines, cubes }));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Видалити</MenuItem>
            <MenuItem onClick={() => {
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Закрити</MenuItem>
        </ContextMenuContainer>
    );
}