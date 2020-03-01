/* eslint-disable */
import React from 'react';
// import {remote} from 'electron';
// const path = remote.require('path');
import './App.css';
import styled from 'styled-components';
import { reduce, addIndex, append, flatten } from 'ramda';
import { Stage, Layer, Text, Circle } from 'react-konva';
import { usePrevious } from 'react-use';
import { Spring, animated } from 'react-spring/renderprops-konva';
import floorPlan from './floor-plan.jpg';
import humans from './revitNew.json';

const testingHumans = humans;
// function usePrevious(value) {
//   // The ref object is a generic container whose current property is mutable ...
//   // ... and can hold any value, similar to an instance property on a class
//   const ref = useRef();

//   // Store current value in ref
//   useEffect(() => {
//     ref.current = value;
//   }, [value]); // Only re-run if value changes

//   // Return previous value (happens before update in useEffect above)
//   return ref.current;
// }

// const reduceIndexed = addIndex(reduce);

// const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const imageHeight = 765;
const imageWidth = 874;
const leftPadding = 0.121  * imageWidth;
const topPadding = 0.044 * imageHeight;

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
`;

const pairsOfArray = array =>
  array.reduce(
    (acc, val, i1) => [
      ...acc,
      ...new Array(array.length - 1 - i1).fill(0).map((v, i2) => ({
        first: array[i1],
        second: array[i1 + 1 + i2],
        indexes: [i1, i1 + 1 + i2]
      }))
    ],
    []
  );

const ColoredRect = ({ X, Y, prevX, prevY }) => {
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

const collisionBoundary = 300;

const detectCollision = (newPositions, goneBack) => {
  const newCoords = newPositions.map((p, i) => ({
    x: testingHumans[i][p].x,
    y: testingHumans[i][p].y
  }));
  // console.log(newCoords[128], newCoords[118])
  let collisionDetected = false;
  let newIndex = 10000000;
  const combinations = pairsOfArray(newCoords);
  const comboLength = combinations.length;
  for (let i = 0; i < comboLength; i++) {
    const { first, second, indexes } = combinations[i];
    if (
      Math.abs(first.x - second.x) < collisionBoundary &&
      Math.abs(first.y - second.y) < collisionBoundary
    ) {
      if (
        newPositions[indexes[0]] === testingHumans[indexes[0]].length - 1 ||
        newPositions[indexes[1]] === testingHumans[indexes[1]].length - 1
      ) {
        continue;
      }
      // console.log(`collision between ${indexes[0]} and ${indexes[1]}`);
      if (goneBack.includes(indexes[0])) {
        // console.log(`${indexes[1]} went back`)
        newIndex = indexes[1];
      } else {
        // console.log(`${indexes[0]} went back`)
        newIndex = indexes[0];
      }
      collisionDetected = true;
      break;
    }
  }
  return {
    collisionDetected,
    goneBack: newIndex !== 10000000 ? [...goneBack, newIndex] : goneBack
  };
};

const detectCollisions = humans => {
  let collisionDetected = false;
  const combinations = pairsOfArray(humans);
  const comboLength = combinations.length;
  for (let i = 0; i < comboLength; i++) {
    const first = combinations[i][0];
    const second = combinations[i][1];
    if (
      Math.abs(first.x - second.x) < collisionBoundary &&
      Math.abs(first.y - second.y) < collisionBoundary
    ) {
      first.goBack();
      collisionDetected = true;
      break;
    }
  }
  return collisionDetected;
};
// const appPath = remote.app.getAppPath();

// export const refImage = relPath => {
//   console.log(appPath);
//   const p = path.join(appPath, relPath)
//   console.log('teliko', p);
//   return `file://${p}`;
// };

const Image = styled.img`
  height: 100%;
  width: 100%;
  pointer-events: none;
  /* position: absolute; */
  /* top: 10px; */
  /* left: calc(50% - (1.143 * 100vh - 20px)/2); */
`;
const Container = styled.div`
  /* position: relative; */
  /* background-size: contain; */
  min-height: 100vh;
  overflow: auto;
  padding: 20px 0;
  background: white;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`;

const App = () => {
  const [humanPositions, setHumanPosition] = React.useState(
    Array(testingHumans.length).fill(0)
  );
  const [waited, setWaited] = React.useState([]);
  const prevPositions =
    usePrevious(humanPositions) || Array(testingHumans.length).fill(0);
  const [stepNumber, setStepNumber] = React.useState(0);
  const goBack = () => {
    if (stepNumber === 0) return;
    const newPositions = humanPositions.map(p => Math.max(0, p - 1));
    setStepNumber(stepNumber - 1);
    setHumanPosition(newPositions);
  };
  const goForward = () => {
    const newPositions = humanPositions.map((p, i) =>
      Math.min(testingHumans[i].length - 1, p + 1)
    );
    setStepNumber(stepNumber + 1);
    let updatedNewPositions = newPositions;
    const { collisionDetected, goneBack } = detectCollision(
      updatedNewPositions,
      []
    );
    let collision = collisionDetected;
    let humansStayed = goneBack;
    while (collision) {
      updatedNewPositions = newPositions.map((n, i) =>
        humansStayed.includes(i) ? n - 1 : n
      );
      const { collisionDetected, goneBack } = detectCollision(
        updatedNewPositions,
        humansStayed
      );
      collision = collisionDetected;
      humansStayed = goneBack;
    }
    setWaited(flatten(append(waited, humansStayed.map(s => ({
      x: testingHumans[s][updatedNewPositions[s]].x,
      y: testingHumans[s][updatedNewPositions[s]].y,
    })))));
    setHumanPosition(updatedNewPositions);
  };
  // console.log('8', humanPositions[8]);
  // console.log('9', humanPositions[9]);
  // console.log('12', humanPositions[12]);

  return (
    <Container>
      <div style={{
        height: '48px',
        color: 'black',
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 12px',
        position: 'absolute',
        top: 32,
        left: 100
      }}
      >
        <b style={{marginRight: '8px', fontSize: '22px'}}>De Rotterdam</b> Evacuation process
      </div>
      <div style={{height: '765px', width: '874px'}}>
        <Image src={floorPlan} alt="logo" />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            // alignItems: 'center',
            padding: '20px 0',
            // left: `calc(50vw - ${imageWidth / 2}px)`,
            width: '874px',
            height: '765px'
          }}
        >
          <Stage
            height={689}
            width={627}
            style={{ position: 'absolute', top: 54, left: 112 }}
          >
            <Layer>
              {testingHumans.map((h, i) => (
                // <Text
                //   text={i}
                //   fontSize={8}
                //   x={h[humanPositions[i]].x/65.8}
                //   y={(46280 - h[humanPositions[i]].y)/65.8}
                // />
                <ColoredRect
                  key={i}
                  prevX={h[prevPositions[i]].x / 67.07}
                  prevY={(46280 - h[prevPositions[i]].y) / 67.17}
                  X={h[humanPositions[i]].x / 67.07}
                  Y={(46280 - h[humanPositions[i]].y) / 67.17}
                />
              ))}
            </Layer>
            <Layer>
              {waited.map(((w, i) =>
                <Circle
                  key={i}
                  x={w.x/67.07}
                  y={(46280 - w.y)/67.17}
                  // fill="red"
                  // radius={10}
                  width={27}
                  shadowBlur={10}
                  fill='rgba(255, 0, 0, 0.008)'
                />
              ))}
            </Layer>
          </Stage>
          <div style={{ position: 'absolute', top: 36, right: 0, display: 'flex', flexDirection: 'column' }}>
            <h5 style={{color: 'black', fontSize: '16px'}}>{`Steps: ${stepNumber}`}</h5>
            <Button onClick={goBack}>Previous Step</Button>
            <Button onClick={goForward}>Next Step</Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default App;
