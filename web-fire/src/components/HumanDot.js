import React from 'react';
import { Spring, animated } from 'react-spring/renderprops-konva';

const HumanDot = ({ X, Y, prevX, prevY }) => {
  return (
    <Spring
      native
      from={{ x: prevX, y: prevY }}
      to={{
        x: X,
        y: Y,
        fill: 'red',
        width: 6
      }}
    >
      {props => <animated.Circle {...props} />}
    </Spring>
  );
};

export default HumanDot;
