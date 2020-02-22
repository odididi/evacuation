import React, {useRef, useEffect} from 'react';
import floorPlan from './floor-plan.png';
import './App.css';
import humans from './revitHumans';
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
const imageWidth = (1.29 * screenHeight - 20);
const leftPadding = 0.18065 * imageWidth;
const topPadding = 0.045 * imageHeight;


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
          width: 6
        }}
      >
        {props => (
          <animated.Circle {...props} />
        )}
      </Spring>
    );
  }

const collisionBoundary = 500

const detectCollision = (newPositions, goneBack) => {
  const newCoords = newPositions.map((p, i) => ({
    x: testingHumans[i][p].x,
    y: testingHumans[i][p].y
  }))
  let collisionDetected = false;
  let newIndex = 10000000;
  const combinations = pairsOfArray(newCoords);
  const comboLength = combinations.length;
  for (let i = 0; i < comboLength; i++) {
    const {first, second, indexes} = combinations[i];
    if ((Math.abs(first.x - second.x) < collisionBoundary) && (Math.abs(first.y - second.y) < collisionBoundary)) {
        if (goneBack.includes(indexes[0])) {
          newIndex = indexes[1]
        } else {
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
    const newPositions = humanPositions.map(p => p + 1)
    setStepNumber(stepNumber + 1);
    let times = 0;
    let updatedNewPositions = newPositions;
    const {collisionDetected, goneBack} = detectCollision(updatedNewPositions, []);
    let collision = collisionDetected;
    let humansStayed = goneBack;
    while (collision && times < 200) {
      updatedNewPositions = newPositions.map((n, i) => humansStayed.includes(i) ? n - 1 : n);
      const {collisionDetected, goneBack} = detectCollision(updatedNewPositions, humansStayed);
      collision = collisionDetected;
      humansStayed = goneBack;
      times += 1;
    }
    setHumanPosition(updatedNewPositions);
  }

  return (
    <div className="App">
      <img src={floorPlan} className="App-logo" alt="logo" />
      <div style={{position: 'absolute', top: 10, left: `calc(50vw - ${imageWidth/2}px)`, width: imageWidth, height: imageHeight}}>
      <Stage height={0.91 * imageHeight} width={0.6388 * imageWidth} style={{position: 'absolute', top: topPadding, left:leftPadding}}>
          <Layer>
            {testingHumans.map((h, i) => (
              <ColoredRect
                key={i}
                prevX={h[prevPositions[i]].x/71.9}
                prevY={(46280 - h[prevPositions[i]].y)/72.1}
                X={h[humanPositions[i]].x/71.9}
                Y={(46280 - h[humanPositions[i]].y)/72.1}
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
