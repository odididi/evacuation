import React from 'react';
import styled from 'styled-components';

const TitleContainer = styled.div`
  height: 48px;
  color: black;
  width: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  position: absolute;
  top: 32px;
  left: 100px;
`;

const BuildingContainer = styled.b`
  margin-right: 8px;
  font-size: 22px;
`;

const Title = () => (
  <TitleContainer>
    <BuildingContainer>De Rotterdam</BuildingContainer>
    Evacuation process
  </TitleContainer>
);

export default Title;
