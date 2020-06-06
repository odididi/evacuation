import React from 'react';
import styled from 'styled-components';
import floorPlan from '../floor-plan.jpg';

const Image = styled.img`
  height: 100%;
  width: 100%;
  pointer-events: none;
`;

const BuildingImage = () => (
  <Image src={floorPlan} alt="logo" />
);

export default BuildingImage;
