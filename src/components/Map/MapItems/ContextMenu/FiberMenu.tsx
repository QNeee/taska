import { useDispatch } from "react-redux";
import { MenuItem, ContextMenuContainer } from "./ContextMenu.styled";
import { AppDispatch } from "../../../../Redux/store";
import { IContextMenuItem, setContextMenu, setFiberInfoModal } from "../../../../Redux/map/mapSlice";
import { ContextMenuInterface } from "../../../../interface/ContextMenuInterface";

interface IGeneralMenuProps {
    left: number;
    top: number;
    map: L.Map;
    contextMenu: IContextMenuItem
}
export const FiberMenu: React.FC<IGeneralMenuProps> = ({ left, top, map, contextMenu }) => {
    const dispatch: AppDispatch = useDispatch();
    return (
        <ContextMenuContainer style={{ left, top }}>
            <MenuItem onClick={() => {
                dispatch(setFiberInfoModal(true));
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Інформація</MenuItem>
            <MenuItem onClick={() => {
                const close = ContextMenuInterface.handleCloseMenu();
                dispatch(setContextMenu(close));
            }}>Закрити</MenuItem>
        </ContextMenuContainer>
    );
}