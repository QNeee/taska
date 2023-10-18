import { useDispatch } from "react-redux";
import { ContextMenuContainer, MenuItem } from "./ContextMenu.styled";
import { AppDispatch } from "../../../../Redux/store";
import { IContextMenuItem, setContextMenu, setHideCubes } from "../../../../Redux/map/mapSlice";
import { ContextMenuInterface } from "../../../../interface/ContextMenuInterface";

interface ICubeMenuProps {
    left: number;
    top: number;
    contextMenu: IContextMenuItem
}

export const CubeMenu: React.FC<ICubeMenuProps> = ({ left, top, contextMenu }) => {
    const dispatch: AppDispatch = useDispatch();
    return <ContextMenuContainer style={{ left, top }}>
        <MenuItem onClick={() => {
            dispatch(setHideCubes(true));
            const close = ContextMenuInterface.handleCloseMenu();
            dispatch(setContextMenu(close));
        }}>Сховати Куби</MenuItem>
        <MenuItem onClick={() => dispatch(setContextMenu({
            ...contextMenu,
            cube: false,
        }))}>Закрити</MenuItem>
    </ContextMenuContainer>
}