import { useDispatch } from "react-redux";
import { ContextMenuContainer, MenuItem, Paragraph } from "./ContextMenu.styled";
import { AppDispatch } from "../../../../Redux/store";
import { IContextMenuItem, drawCube, drawMufta, drawWardrobe, setContextMenu, setHideCubes } from "../../../../Redux/map/mapSlice";
import { ContextMenuInterface } from "../../../../interface/ContextMenuInterface";
import { ContextMenuCubeInterface } from "../../../../interface/ContextMenuCubeInterface";
import { ICustomCube } from "../../../../Cubes";
import { ICustomMarker } from "../../../../Mufts";
import { ICustomPolyline } from "../../../../Polylines";
import { ICustomWardrobe } from "../../../../Wardrobe";


interface ICubeMenuProps {
    left: number;
    top: number;
    contextMenu: IContextMenuItem;
    id: string;
    cubesArr: ICustomCube[];
    muftsArr: ICustomMarker[];
    polyLinesArr: ICustomPolyline[];
    wardrobesArr: ICustomWardrobe[];

}

export const CubeMenu: React.FC<ICubeMenuProps> = ({ wardrobesArr, muftsArr, polyLinesArr, left, top, contextMenu, id, cubesArr }) => {
    const dispatch: AppDispatch = useDispatch();
    const latlngCube = ContextMenuCubeInterface.getCoords(id, cubesArr);
    return <ContextMenuContainer style={{ left, top }}>
        <Paragraph>
            lat:{latlngCube?.lat}
        </Paragraph>
        <Paragraph>
            lng:{latlngCube?.lng}
        </Paragraph>
        <MenuItem onClick={() => {
            dispatch(setHideCubes(true));
            const close = ContextMenuInterface.handleCloseMenu();
            dispatch(setContextMenu(close));
        }}>Сховати Куби</MenuItem>
        <MenuItem onClick={() => {
            const { muftas, cubics, wardrobes } = ContextMenuCubeInterface.changeToMufta(id, muftsArr, cubesArr, polyLinesArr, wardrobesArr);
            dispatch(drawMufta(muftas));
            dispatch(drawWardrobe(wardrobes));
            dispatch(drawCube(cubics));
            const close = ContextMenuInterface.handleCloseMenu();
            dispatch(setContextMenu(close));
        }}>Зробити муфтою</MenuItem>
        <MenuItem onClick={() => dispatch(setContextMenu({
            ...contextMenu,
            cube: false,
        }))}>Закрити</MenuItem>
    </ContextMenuContainer>
}