import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Select } from '../../../Modal/Modal.styled';
import { LeftArrow, RightArrow } from './Arrows';
import { useDispatch, useSelector } from 'react-redux';
import { getTrack, getTrackData, getTrackIndex } from '../../../../Redux/map/mapSelectors';
import { setTrack, setTrackIndex } from '../../../../Redux/map/mapSlice';
const CenteredDiv = styled.div`
  position: fixed;
  z-index: 2500;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: #333;
  color: #fff;
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
`;
const StyledOption = styled.option`
  color: ${(props) => props.color};
`;

export const TrackerHelper = () => {
    const track = useSelector(getTrack);
    const trackIndex = useSelector(getTrackIndex);
    const trackData = useSelector(getTrackData);
    const [leftArrowActive, setLeftArrowActive] = useState(false);
    const [rightArrowActive, setRightArrowActive] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && trackIndex > 0) {
                dispatch(setTrackIndex(trackIndex - 1));
                setLeftArrowActive(true);
            } else if (e.key === 'ArrowRight' && trackIndex < trackData.length - 1) {
                dispatch(setTrackIndex(trackIndex + 1));
                setRightArrowActive(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setLeftArrowActive(false);
            } else if (e.key === 'ArrowRight') {
                setRightArrowActive(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [dispatch, trackIndex, trackData]);

    const onClickRightArrow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (trackIndex < trackData.length - 1) {
            dispatch(setTrackIndex(trackIndex + 1));
            setRightArrowActive(false);
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = parseInt(e.target.value, 10);
        dispatch(setTrackIndex(selectedIndex));
    };

    const onClickLeftArrow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (trackIndex !== 0) {
            dispatch(setTrackIndex(trackIndex - 1));
            setLeftArrowActive(true);
        }
    };

    const onClickStopTrack = () => {
        dispatch(
            setTrack({
                ...track,
                track: false,
            })
        );
    };

    return (
        <CenteredDiv>
            <ButtonWrapper>
                <Button onClick={(e) => onClickLeftArrow(e)}>
                    <LeftArrow active={leftArrowActive} />
                </Button>
                <Button onClick={(e) => onClickRightArrow(e)}>
                    <RightArrow active={rightArrowActive} />
                </Button>
                <Button onClick={(e) => onClickStopTrack()}>Припинити відстежувати</Button>
                <Select onChange={handleSelectChange} value={trackIndex}>
                    {trackData.map((prod, index) => (
                        <StyledOption key={index} color={prod.color} value={index}>
                            {index + 1} {prod.color === '#228b22' ? 'nature' : prod.color} {prod.riska ? ' ||' : null}
                        </StyledOption>
                    ))}
                </Select>
            </ButtonWrapper>
        </CenteredDiv>
    );
};
