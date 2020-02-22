import React, {useRef, useEffect} from 'react';
import floorPlan from './floor-plan.png';
import './App.css';
import humans from './revitHumans';
import styled from 'styled-components';
import {move} from './styles';
import {take, reduce, addIndex} from 'ramda';
import {Stage, Layer, Text, Circle} from 'react-konva';

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

// const detect = newPositions => {
//   const oldCoords = newPositions.map((p, i) => ({
//     x: humans[i][p - 1].x,
//     y: humans[i][p - 1].y
//   }))
  // console.log(oldCoords);
//   const newCoords = newPositions.map((p, i) => ({
//     x: humans[i][p].x,
//     y: humans[i][p].y
//   }))
  // console.log(newCoords);
//   let goBackIndexes = []
//   const reducer = (acc, current, i) => {
//     let canMove = true;
//     acc.map((a, j) => {
//       if ((Math.abs(a.x - current.x) < 1500) && (Math.abs(a.y - current.y) < 1500)) {
        // console.log(j, i)
//         canMove = false
//       }
//     })
//     if (canMove) {
      // console.log(`${i} moved`)
//       acc.push(current)
//       return acc;
//     }
    // console.log(`${i} stayed`)
//     goBackIndexes.push(i)
//     return acc;
//   };
//   reduceIndexed(reducer, oldCoords, newCoords);
//   const updatedNewPositions = newPositions.map((n, i) => goBackIndexes.includes(i) ? n - 1 : n);
  // console.log(updatedNewPositions);
//   return updatedNewPositions;
// }

const collisionBoundary = 500

const detectCollision = (newPositions, goneBack) => {
  const newCoords = newPositions.map((p, i) => ({
    x: humans[i][p].x,
    y: humans[i][p].y
  }))
  // console.log('detect', goneBack);
  let collisionDetected = false;
  let newIndex = 10000000;
  const combinations = pairsOfArray(newCoords);
  // console.log('combos', combinations);
  const comboLength = combinations.length;
  for (let i = 0; i < comboLength; i++) {
    const {first, second, indexes} = combinations[i];
    if ((Math.abs(first.x - second.x) < collisionBoundary) && (Math.abs(first.y - second.y) < collisionBoundary)) {
      // console.log('collision', indexes);
        if (goneBack.includes(indexes[0])) {
          newIndex = indexes[1]
          // console.log(`stayed back ${newIndex} `)
        } else {
          newIndex = indexes[0]
          // console.log(`stayed back ${newIndex} `)
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
  // console.log(comboLength)
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
  const [humanPositions, setHumanPosition] = React.useState(Array(humans.length).fill(0))
  const [stepNumber, setStepNumber] = React.useState(0);
  const goBack = () => {
    const newPositions = humanPositions.map(p => Math.max(0, p - 1))
    setStepNumber(stepNumber - 1);
    setHumanPosition(newPositions);
  }
  const goForward = () => {
    // const newPositions = detect(humanPositions.map(p => p + 1))
    const newPositions = humanPositions.map(p => p + 1)
    setStepNumber(stepNumber + 1);
    // setHumanPosition(humanPositions.map(p => p + 1))
    let times = 0;
    let updatedNewPositions = newPositions;
    const {collisionDetected, goneBack} = detectCollision(updatedNewPositions, []);
    let collision = collisionDetected;
    let humansStayed = goneBack;
    while (collision && times < 200) {
      // console.log('gone', humansStayed);
      updatedNewPositions = newPositions.map((n, i) => humansStayed.includes(i) ? n - 1 : n);
      const {collisionDetected, goneBack} = detectCollision(updatedNewPositions, humansStayed);
      // console.log('positions', updatedNewPositions);
      // console.log(collisionDetected, goneBack);
      collision = collisionDetected;
      // console.log('collision', collision);
      humansStayed = goneBack;
      times += 1;
    }
    // console.log(newPositions, updatedNewPositions);
    setHumanPosition(updatedNewPositions);
  }
  // const test = [humans[3], humans[6]];
  return (
    <div className="App">
      <img src={floorPlan} className="App-logo" alt="logo" />
      <div style={{position: 'absolute', top: 10, left: `calc(50vw - ${imageWidth/2}px)`, width: imageWidth, height: imageHeight}}>
      <Stage height={0.91 * imageHeight} width={0.6388 * imageWidth} style={{position: 'absolute', top: topPadding, left:leftPadding}}>
          <Layer>
            {humans.map((h, i) => (
            // <ColoredRect
            //   key={i}
            //   x={h.steps[Math.min(h.steps.length, humanPositions[i])].x/71.9}
            //   y={(46280 - h.steps[Math.min(h.steps.length, humanPositions[i])].y)/72.1}
            // />
            <Circle
            // text={i}
            radius={4}
            fill='red'
            x={h[humanPositions[i]].x/71.9}
            y={(46280 - h[humanPositions[i]].y)/72.1}
          />
          ))}
            {/* <ColoredRect x={}/> */}
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
