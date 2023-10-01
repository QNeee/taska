
import React, { ReactNode } from 'react';
import styled from 'styled-components';
const CircleContainer = styled.div`
  width: 100px;
  height: 100px; 
  background-color: #f0f0f0;
  border-radius: 50%; 
  display: flex;
  align-items: center;
  justify-content: center;
`;
interface CircleProps {
    children: ReactNode;
}
export const Circle: React.FC<CircleProps> = ({ children }) => {
    return <CircleContainer>{children}</CircleContainer>;
};