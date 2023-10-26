import styled from 'styled-components';
export const InputContainer = styled.div`
  width: 100%;
`;

export const FullWidthInput = styled.input`
  width: 100%;
  box-sizing: border-box; 
  padding: 5px; 
`;
export const ModalWrapper = styled.div`
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  text-align: center;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
`;

export const ModalText = styled.p`
  font-size: 16px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  
  & > * {
    margin: 10px; 
  }
`;
export const Container = styled.div`
display: flex;
justify-content: space-between;
outline: solid 1px tomato;
`;
export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
    transition: background-color 0.3s; 

  &:hover {
    background-color: #0056b3; 
    color:yellow
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;