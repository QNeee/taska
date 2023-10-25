import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../Redux/store";
import { ContextMenuContainer, MenuItem } from "./ContextMenu.styled";
import { ContextMenuInterface } from "../../../../interface/ContextMenuInterface";
import { deleteWardrobe, setContextMenu, setToggleCoordsApply, setWardrobeInfoModal } from "../../../../Redux/map/mapSlice";
import { ChangeEventHandler } from "react";
import { ICustomWardrobe } from "../../../../Wardrobe";
import { ContextMenuWardrobe } from "../../../../interface/ContextMenuWardrobe";
import { ICustomCube } from "../../../../Cubes";
import { ICustomPolyline } from "../../../../Polylines";
import { ICustomMarker } from "../../../../Mufts";

interface IWardrobeMenuProps {
    left: number;
    top: number;
    addLine: boolean;
    form: { lat: number, lng: number };
    handleInputChange: ChangeEventHandler<HTMLInputElement>;
    id: string;
    item: ICustomWardrobe;
    polyLinesArr: ICustomPolyline[];
    muftsArr: ICustomMarker[];
    cubesArr: ICustomCube[];
    wardrobesArr: ICustomWardrobe[];
    setFiberOpticsMenu: Function
}
export const WardrobeMenu: React.FC<IWardrobeMenuProps> = ({ setFiberOpticsMenu, left, top, item, addLine, form, handleInputChange, id, wardrobesArr, muftsArr, polyLinesArr, cubesArr }) => {
    const dispatch: AppDispatch = useDispatch();
    return (
        <ContextMenuContainer style={{ left, top }}>
            <MenuItem disabled={!addLine} onClick={() => {
                dispatch(setFiberOpticsMenu(true));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Додати лінію сюди</MenuItem>
            {item?.drag && <div style={{
                width: "100%"
            }}>
                lat
                <input type="text" id="lat" value={form.lat} onChange={handleInputChange} />
                lng
                <input type="text" id="lng" value={form.lng} onChange={handleInputChange} />
            </div>}
            <MenuItem onClick={() => {
                const { index, data } = ContextMenuWardrobe.handleApplyCoordinates(id, wardrobesArr, form);
                dispatch(setToggleCoordsApply({ index, data }));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>
                {item?.drag ? "Застосувати координати" : "Змінити координати"}
            </MenuItem>
            <MenuItem onClick={() => {
                dispatch(setWardrobeInfoModal(true));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Інформація</MenuItem>
            <MenuItem onClick={() => {
                const { mufts, polyLines, cubes, wardrobes } = ContextMenuWardrobe.handleDeleteWardrobe(muftsArr, id, polyLinesArr, cubesArr, wardrobesArr)
                dispatch(deleteWardrobe({ mufts, polyLines, cubes, wardrobes }));
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