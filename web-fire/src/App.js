import React, {useRef, useEffect} from 'react';
import floorPlan from './floor-plan.jpg';
import './App.css';
import humans from './revitNew.json';
import styled from 'styled-components';
import {move} from './styles';
import {take, reduce, addIndex} from 'ramda';
import {Stage, Layer, Text, Circle} from 'react-konva';
import {usePrevious} from 'react-use';
import { Spring, animated } from 'react-spring/renderprops-konva';

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

const reduceIndexed = addIndex(reduce);

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const imageHeight = screenHeight - 20;
const imageWidth = (1.143 * screenHeight - 20);
const leftPadding = 0.128 * imageWidth;
const topPadding = 0.044 * imageHeight;


const pairsOfArray = array => (
  array.reduce((acc, val, i1) => [
    ...acc,
    ...new Array(array.length - 1 - i1).fill(0)
      .map((v, i2) => ({first: array[i1], second: array[i1 + 1 + i2], indexes: [i1, i1 + 1 + i2]}))
  ], [])
) 

const ColoredRect = ({X, Y, prevX, prevY}) => {
    return (
      <Spring
        native
        from={{ x: prevX, y: prevY }}
        to={{
          x:  X,
          y: Y,
          fill: 'red',
          width: 4
        }}
      >
        {props => (
          <animated.Circle {...props} />
        )}
      </Spring>
    );
  }

const collisionBoundary = 300

const detectCollision = (newPositions, goneBack) => {
  const newCoords = newPositions.map((p, i) => ({
    x: testingHumans[i][p].x,
    y: testingHumans[i][p].y
  }))
  // console.log(newCoords[128], newCoords[118])
  let collisionDetected = false;
  let newIndex = 10000000;
  const combinations = pairsOfArray(newCoords);
  const comboLength = combinations.length;
  for (let i = 0; i < comboLength; i++) {
    const {first, second, indexes} = combinations[i];
    if ((Math.abs(first.x - second.x) < collisionBoundary) && (Math.abs(first.y - second.y) < collisionBoundary)) {
        if (newPositions[indexes[0]] === testingHumans[indexes[0]].length - 1 ||
          newPositions[indexes[1]] === testingHumans[indexes[1]].length - 1) {
            continue
          }
        // console.log(`collision between ${indexes[0]} and ${indexes[1]}`);
        if (goneBack.includes(indexes[0])) {
          // console.log(`${indexes[1]} went back`)
          newIndex = indexes[1]
        } else {
          // console.log(`${indexes[0]} went back`)
          newIndex = indexes[0]
        }
      collisionDetected = true;
      break;
    }
  }
  return {
    collisionDetected,
    goneBack: newIndex !== 10000000 ? [...goneBack, newIndex] : goneBack
  };
}

const detectCollisions = humans => {
  let collisionDetected = false;
  const combinations = pairsOfArray(humans);
  const comboLength = combinations.length;
  for (let i = 0; i < comboLength; i++) {
    const first = combinations[i][0];
    const second = combinations[i][1]; 
    if ((Math.abs(first.x - second.x) < collisionBoundary) && (Math.abs(first.y - second.y) < collisionBoundary)) {
      first.goBack();
      collisionDetected = true;
      break;
    }
  }
  return collisionDetected;
}
const App = () => {
  const [humanPositions, setHumanPosition] = React.useState(Array(testingHumans.length).fill(0))
  const prevPositions = usePrevious(humanPositions) || Array(testingHumans.length).fill(0) ;
  const [stepNumber, setStepNumber] = React.useState(0);
  const goBack = () => {
    const newPositions = humanPositions.map(p => Math.max(0, p - 1))
    setStepNumber(stepNumber - 1);
    setHumanPosition(newPositions);
  }
  const goForward = () => {
    const newPositions = humanPositions.map((p, i) => Math.min(testingHumans[i].length - 1, p + 1))
    setStepNumber(stepNumber + 1);
    let updatedNewPositions = newPositions;
    const {collisionDetected, goneBack} = detectCollision(updatedNewPositions, []);
    let collision = collisionDetected;
    let humansStayed = goneBack;
    while (collision) {
      updatedNewPositions = newPositions.map((n, i) => humansStayed.includes(i) ? n - 1 : n);
      const {collisionDetected, goneBack} = detectCollision(updatedNewPositions, humansStayed);
      collision = collisionDetected;
      humansStayed = goneBack;
    }
    setHumanPosition(updatedNewPositions);
  }
  // console.log('8', humanPositions[8]);
  // console.log('9', humanPositions[9]);
  // console.log('12', humanPositions[12]);

  return (
    <div className="App">
      <img src={floorPlan} className="App-logo" alt="logo" />
      <div style={{position: 'absolute', top: 10, left: `calc(50vw - ${imageWidth/2}px)`, width: imageWidth, height: imageHeight}}>
      <Stage height={0.902 * imageHeight} width={0.718 * imageWidth} style={{position: 'absolute', top: topPadding, left:leftPadding}}>
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
                prevX={h[prevPositions[i]].x/65.8}
                prevY={(46280 - h[prevPositions[i]].y)/65.8}
                X={h[humanPositions[i]].x/65.8}
                Y={(46280 - h[humanPositions[i]].y)/65.8}
              />
            ))}
          </Layer>
        </Stage>
        <div style={{position: 'absolute', top: 20, right: 0}}>
          <h5>{`Step: ${stepNumber}`}</h5>
          <button onClick={goBack}>prev Step</button>
          <button onClick={goForward}>Next Step</button>
        </div>
      </div>
    </div>
  );
}

export default App;
