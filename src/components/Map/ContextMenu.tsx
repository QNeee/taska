import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { getAddLine, getDrawItemLatLng, getCubeMenu } from '../../Redux/app/appSelectors';
import { ContextMenuMuftaInterface } from '../../interface/ContextMenuMuftaInterface';
import { ContextMenuGeneralInterface } from '../../interface/ContextMenuGeneralInterface';
import { ContextMenuPolylineInterface } from '../../interface/ContextMenuPolylineIntrface';
import React, { useState } from 'react';
import { ContextMenuCubeInterface } from '../../interface/ContextMenuCubeInterface';
import { getCubes, getGeneralMenu, getId, getLineStart, getMuftaMenuOpen, getMufts, getPolyLines, getPolylineMenuOpen } from '../../Redux/map/mapSelectors';
import { useMap } from 'react-leaflet';

interface Iprops {
    left: number,
    top: number,
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
    const drawItemLatLng = useSelector(getDrawItemLatLng);
    const muftaMenuOpen = useSelector(getMuftaMenuOpen);
    const polylineMenuOpen = useSelector(getPolylineMenuOpen);
    const generalMenuOpen = useSelector(getGeneralMenu);
    const polyLines = useSelector(getPolyLines);
    const id = useSelector(getId);
    const addLine = useSelector(getAddLine);
    const cubes = useSelector(getCubes);
    const cubeMenu = useSelector(getCubeMenu);
    const lineStart = useSelector(getLineStart);
    const mufts = useSelector(getMufts);
    const [isChangeHovered, setIsChangeHovered] = useState(false);
    const handleMouseEnterChange = () => {
        setIsChangeHovered(true);
    };
    const handleMouseLeaveChange = () => {
        setIsChangeHovered(false);
    };
    console.log(id);
    const obj = {
        x: left,
        y: top
    }

    if (muftaMenuOpen) {
        return (
            <ContextMenuContainer style={{ left, top }}>
                <MenuItem disabled={!addLine} onClick={() => {
                    ContextMenuMuftaInterface.handleAddLineTo(mufts, id, dispatch, lineStart)
                    ContextMenuMuftaInterface.handleOnCloseMuftaMenu(dispatch);
                }}>добавить линию сюда</MenuItem>
                <MenuItem onClick={() => {
                    ContextMenuMuftaInterface.handleAddLineFrom(mufts, dispatch, id)
                    ContextMenuMuftaInterface.handleOnCloseMuftaMenu(dispatch);
                }}>добавить линию отсюда</MenuItem>
                <MenuItem onClick={() => {
                    ContextMenuMuftaInterface.handleDeleteMufta(mufts, id, dispatch)
                    ContextMenuMuftaInterface.handleOnCloseMuftaMenu(dispatch);
                }}>delete</MenuItem>
                <MenuItem onClick={() => ContextMenuMuftaInterface.handleOnCloseMuftaMenu(dispatch)}>закрыть</MenuItem>
            </ContextMenuContainer>
        );
    } else if (generalMenuOpen) {
        return (
            <ContextMenuContainer style={{ left, top }}>
                <MenuItem onClick={() => {
                    ContextMenuGeneralInterface.handleMenuClickMufta(obj, dispatch, map)
                    ContextMenuGeneralInterface.handleOnCloseGeneralMenu(dispatch)
                }}>Circle</MenuItem>
                <MenuItem onClick={() => ContextMenuGeneralInterface.handleOnCloseGeneralMenu(dispatch)}>Exit</MenuItem>
            </ContextMenuContainer>
        );
    } else if (polylineMenuOpen) {
        return <ContextMenuContainer style={{ left, top }}>
            <div onMouseEnter={handleMouseEnterChange}
                onMouseLeave={handleMouseLeaveChange}>
                <MenuItem >change</MenuItem>
                {isChangeHovered && (
                    <div>

                        <button onClick={() => {
                            ContextMenuPolylineInterface.handleMenuClickChangeLineNewFromThis(drawItemLatLng, dispatch, polyLines, id)
                            ContextMenuPolylineInterface.handleMenuClose(dispatch)
                        }}>new Line from this</button>
                        <button onClick={() => {
                            ContextMenuPolylineInterface.handleMenuClickChangeLineFromThis(drawItemLatLng, dispatch, polyLines, mufts, id, cubes)
                            ContextMenuPolylineInterface.handleMenuClose(dispatch)
                        }}>ADD CUBE</button>
                    </div>
                )}
            </div>
            <MenuItem onClick={() => {
                ContextMenuPolylineInterface.handleMenuClickInfo(drawItemLatLng, dispatch)
                ContextMenuPolylineInterface.handleMenuClose(dispatch)
            }}>info</MenuItem>
            <MenuItem onClick={() => ContextMenuPolylineInterface.handleMenuClose(dispatch)}>close</MenuItem>
        </ContextMenuContainer>
    } else if (cubeMenu) {
        return <ContextMenuContainer style={{ left, top }}>
            <MenuItem onClick={() => {
                ContextMenuCubeInterface.handleClickDelete(drawItemLatLng, dispatch, polyLines, id, cubes)
                ContextMenuCubeInterface.handleClickClose(dispatch)
            }}>Delete</MenuItem>
            <MenuItem onClick={() => ContextMenuCubeInterface.handleClickClose(dispatch)}>Exit</MenuItem>
        </ContextMenuContainer>
    }
    return null;
};

export default ContextMenu;