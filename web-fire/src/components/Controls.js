import React from 'react';
import styled from 'styled-components';
import StepButton from './StepButton';

const ControlsContainer = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  display: flex;
  flex-direction: column;
`;

const StepNumber = ({stepNumber}) => (
  <h5 style={{color: 'black', fontSize: '16px'}}>{`Steps: ${stepNumber}`}</h5>
)

const Controls = ({onNext, onPrev, stepNumber}) => (
  <ControlsContainer>
    <StepNumber stepNumber={stepNumber} />
    <StepButton onClick={onPrev} text="Previous Step" />
    <StepButton onClick={onNext} text="Next Step" />
  </ControlsContainer>
);

export default Controls;
