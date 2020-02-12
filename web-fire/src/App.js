import React, {useRef, useEffect} from 'react';
import floorPlan from './floor-plan.png';
import './App.css';
import humans from './revitHumans';
import styled from 'styled-components';
// import {move} from './styles';
import {take} from 'ramda';

const HumanDot = styled.circle`
`;

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const imageHeight = screenHeight - 20;
const imageWidth = (1.29 * screenHeight - 20);
const leftPadding = 0.18065 * imageWidth;
const topPadding = 0.045 * imageHeight;

const collisionBoundary = 800

const pairsOfArray = array => (
  array.reduce((acc, val, i1) => [
    ...acc,
    ...new Array(array.length - 1 - i1).fill(0)
      .map((v, i2) => ([array[i1], array[i1 + 1 + i2]]))
  ], [])
) 

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

const tops = [1000, 2000, 3000];
const lefts = [1000, 2000, 3000];

const App = () => {
  const usePrevious = (value) => {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    
    // Return previous value (happens before update in useEffect above)
    return ref.current;
  }
  const [index, setIndex] = React.useState(0);
  const prevIndex = usePrevious(index);
  const prevSteps = Array(humans.length).fill(prevIndex || 0)
  const steps = Array(humans.length).fill(index)
  // const [steps, setSteps] = React.useState([0, 0, 0])
  // const humanInstances = humans.map(human =>
  //   new Human(human[index].x, human[index].y, human, index)
  // );
  // React.useEffect(() => {
  //   setSteps([index, index, index])
  // }, [index])
  return (
    <div className="App">
      <img src={floorPlan} className="App-logo" alt="logo" />
      <div style={{position: 'absolute', top: 10, left: `calc(50vw - ${imageWidth/2}px)`, width: imageWidth, height: imageHeight}}>
        <svg style={{position: 'absolute', top: topPadding, left: leftPadding}} width={0.6388 * imageWidth} height={0.91 * imageHeight} viewBox={`0 0 42070 46285`} xmlns="http://www.w3.org/2000/svg">
          {humans.map((h, i) => (
            <>
              {/* {console.log(hs[prevSteps[i]])} */}
              <HumanDot
                // x={[h[prevSteps[i]].x, h[steps[i]].x]}
                // y={[h[prevSteps[i]].y, h[steps[i]].y]}
                key={h.id}
                cx={h[steps[i]].x}
                cy={46285 - h[steps[i]].y}
                r="200"
                stroke={`rgb(${Math.random() * 255}, 0, 0)`}
                fill={`rgb(${Math.random() * 255}, 0, 0)`}
              />
            </>
          ))}
        </svg>
        <div style={{position: 'absolute', top: 20, right: 0}}>
          <h5>{`Step: ${index}`}</h5>
          <button onClick={() => setIndex(Math.max(0, index - 1))}>Prev Step</button>
          <button onClick={() => setIndex(index + 1)}>Next Step</button>
        </div>
      </div>
    </div>
  );
}

export default App;
