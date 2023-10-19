
import styled from 'styled-components';

const Svg = styled.svg<{ active: boolean }>`
fill:${props => props.active ? 'grey' : "white"};
`;
interface ISvgProps {
    active: boolean;
}
export const LeftArrow: React.FC<ISvgProps> = ({ active }) => {
    return <Svg active={active} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M15.41 7.59l-4.58 4.59 4.59 4.58L14 18.25l-6.25-6.25 6.25-6.25z" />
    </Svg>
}

export const RightArrow: React.FC<ISvgProps> = ({ active }) => {
    return <Svg active={active} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M8.59 16.34l4.58-4.59-4.59-4.58L10 5.75l6.25 6.25-6.25 6.25z" />
    </Svg>
}