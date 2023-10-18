import { useDispatch } from "react-redux";
import { ContextMenuGeneralInterface } from "../../../../interface/ContextMenuGeneralInterface";
import { MenuItem, ContextMenuContainer } from "./ContextMenu.styled";
import { AppDispatch } from "../../../../Redux/store";
import { IContextMenuItem, drawMufta, drawWardrobe, setContextMenu } from "../../../../Redux/map/mapSlice";
import { ContextMenuInterface } from "../../../../interface/ContextMenuInterface";

interface IGeneralMenuProps {
    left: number;
    top: number;
    map: L.Map;
    contextMenu: IContextMenuItem
}
export const GeneralMenu: React.FC<IGeneralMenuProps> = ({ left, top, map, contextMenu }) => {
    const dispatch: AppDispatch = useDispatch();
    return (
        <ContextMenuContainer style={{ left, top }}>
            <MenuItem onClick={() => {
                const data = ContextMenuGeneralInterface.handleMenuClickMufta({ x: left, y: top }, map);
                dispatch(drawMufta(data));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Муфта</MenuItem>
            <MenuItem onClick={() => {
                const data = ContextMenuGeneralInterface.handleMenuClickWardrobe({ x: left, y: top }, map);
                dispatch(drawWardrobe(data));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Шкаф</MenuItem>
            <MenuItem onClick={() => dispatch(setContextMenu({
                ...contextMenu,
                general: false,
            }))}>Закрити</MenuItem>
        </ContextMenuContainer>
    );
}