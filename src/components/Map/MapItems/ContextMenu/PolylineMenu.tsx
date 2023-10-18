import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../Redux/store";
import { ContextMenuContainer, MenuItem } from "./ContextMenu.styled";
import { ContextMenuInterface } from "../../../../interface/ContextMenuInterface";
import { setContextMenu } from "../../../../Redux/map/mapSlice";
import { MouseEventHandler } from "react";
interface IPylileMenuProps {
    left: number;
    top: number;
    isChangeHovered: boolean;
    handleMouseEnterChange: MouseEventHandler<HTMLDivElement>;
    handleMouseLeaveChange: MouseEventHandler<HTMLDivElement>;
}
export const PolylineMenu: React.FC<IPylileMenuProps> = ({ isChangeHovered, left, top, handleMouseEnterChange, handleMouseLeaveChange }) => {
    const dispatch: AppDispatch = useDispatch();

    return <ContextMenuContainer style={{ left, top }}>
        <div onMouseEnter={handleMouseEnterChange}
            onMouseLeave={handleMouseLeaveChange}>
            <MenuItem >Змінити</MenuItem>
            {isChangeHovered && (
                <div>

                    <button onClick={() => {
                        // ContextMenuPolylineInterface.handleMenuClickChangeLineNewFromThis(drawItemLatLng, dispatch, polyLinesArr, id)
                        const close = ContextMenuInterface.handleCloseMenu();
                        dispatch(setContextMenu(close));
                    }}>Нова лінія звідси</button>
                    <button onClick={() => {
                        // ContextMenuPolylineInterface.handleMenuClickChangeLineFromThis(drawItemLatLng, dispatch, polyLinesArr, muftsArr, id, cubesArr)
                        const close = ContextMenuInterface.handleCloseMenu();
                        dispatch(setContextMenu(close));
                    }}>Додати Куб</button>
                </div>
            )}
        </div>
        <MenuItem onClick={() => {
            // ContextMenuPolylineInterface.handleMenuClickInfo(drawItemLatLng, dispatch)
            const close = ContextMenuInterface.handleCloseMenu();
            dispatch(setContextMenu(close));
        }}>Інофрмація</MenuItem>
        <MenuItem onClick={() => {
            const close = ContextMenuInterface.handleCloseMenu();
            dispatch(setContextMenu(close));
        }}>Закрити</MenuItem>
    </ContextMenuContainer>
}   