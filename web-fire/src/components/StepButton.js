import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  height: 32px;
  background: rgb(240, 40, 50);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
  &:hover {
    background: #FFA500;
  }
  cursor: pointer;
  border: none;
  outline:none;
`

const StepButton = ({onClick, text}) => (
  <Button onClick={onClick}>{text}</Button>
);

export default StepButton;
