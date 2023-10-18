import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { getAddLine } from '../../Redux/app/appSelectors';
import { ContextMenuMuftaInterface } from '../../interface/ContextMenuMuftaInterface';
import { ContextMenuGeneralInterface } from '../../interface/ContextMenuGeneralInterface';
import React, { useEffect, useState } from 'react';
import { getContextMenu, getCubes, getId, getLineStart, getMufts, getPolyLines, getWardrobes } from '../../Redux/map/mapSelectors';
import { useMap } from 'react-leaflet';
import { deleteMufta, drawMufta, drawPolyline, setToggleCoordsApply, setHideCubes, setLineStart, updateMufta, drawWardrobe, setContextMenu } from '../../Redux/map/mapSlice';
import { setAddLine } from '../../Redux/app/appSlice';
import { ContextMenuInterface } from '../../interface/ContextMenuInterface';

interface Iprops {
    left: number,
    top: number,
}
export interface Coords {
    lat: number,
    lng: number,
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
const ContextMenu = ({ left, top }: Iprops) => {
    const dispatch: AppDispatch = useDispatch();
    const map = useMap();
    const polyLinesArr = useSelector(getPolyLines);
    const id = useSelector(getId);
    const addLine = useSelector(getAddLine);
    const cubesArr = useSelector(getCubes);
    const lineStart = useSelector(getLineStart);
    const muftsArr = useSelector(getMufts);
    const [isChangeHovered, setIsChangeHovered] = useState(false);
    const wardrobes = useSelector(getWardrobes);
    const contextMenu = useSelector(getContextMenu);
    const item = muftsArr.find(item => item.id === id) || wardrobes.find(item => item.id === id);
    const [form, setForm] = useState({ lat: 0, lng: 0 });
    const handleMouseEnterChange = () => {
        setIsChangeHovered(true);
    };
    useEffect(() => {
        setForm({ lat: item?.getLatLng().lat as number, lng: item?.getLatLng().lng as number })
    }, [id, item])
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setForm(prev => ({
            ...prev,
            [id]: value
        }))
    }
    const handleMouseLeaveChange = () => {
        setIsChangeHovered(false);
    };
    const obj = {
        x: left,
        y: top
    }

    if (contextMenu.muft || contextMenu.wardrobes) {
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
                    const { index, data } = ContextMenuMuftaInterface.handleApplyCoordinates(id, muftsArr, wardrobes, form);
                    dispatch(setToggleCoordsApply({ index, data }));
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
    } else if (contextMenu.general) {
        return (
            <ContextMenuContainer style={{ left, top }}>
                <MenuItem onClick={() => {
                    const data = ContextMenuGeneralInterface.handleMenuClickMufta(obj, map);
                    dispatch(drawMufta(data));
                    const close = ContextMenuInterface.handleCloseMenu();
                    dispatch(setContextMenu(close));
                }}>Муфта</MenuItem>
                <MenuItem onClick={() => {
                    const data = ContextMenuGeneralInterface.handleMenuClickWardrobe(obj, map);
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
    } else if (contextMenu.poly) {
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
    } else if (contextMenu.cube) {
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
    return null;
};

export default ContextMenu;