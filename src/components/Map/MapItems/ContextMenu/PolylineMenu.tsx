import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../Redux/store";
import { ContextMenuContainer, MenuItem } from "./ContextMenu.styled";
import { ContextMenuInterface } from "../../../../interface/ContextMenuInterface";
import { setContextMenu, setPolylineInfoModal } from "../../../../Redux/map/mapSlice";

interface IPylileMenuProps {
    left: number;
    top: number;

}
export const PolylineMenu: React.FC<IPylileMenuProps> = ({ left, top }) => {
    const dispatch: AppDispatch = useDispatch();
    return <ContextMenuContainer style={{ left, top }}>
        <MenuItem onClick={() => {
            const close = ContextMenuInterface.handleCloseMenu();
            dispatch(setPolylineInfoModal(true));
            dispatch(setContextMenu(close));
        }}>Інофрмація</MenuItem>
        <MenuItem onClick={() => {
            const close = ContextMenuInterface.handleCloseMenu();
            dispatch(setContextMenu(close));
        }}>Закрити</MenuItem>
    </ContextMenuContainer>
}   