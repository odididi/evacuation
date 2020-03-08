import React from 'react';
import './App.css';
import styled from 'styled-components';
import {append, flatten} from 'ramda';
import {Stage, Layer, Circle} from 'react-konva';
import {usePrevious} from 'react-use';
import revitHumans from './revitNew.json';
import {
  BuildingImage,
  Controls,
  HumanDot,
  Title
} from './components';
import {detectCollision} from './utils/humans';

const testingHumans = revitHumans;

const imageHeight = 765;
const imageWidth = 874;
const buildingCanvasWidth = 627;
const buildingCanvasHeight = 689;
const originOffset = {
  x: 112,
  y: 54
}
const buildingRevitWidth = 42070;
const buildingRevitHeight = 46280;
const humanXToCanvasX = buildingRevitWidth / buildingCanvasWidth;
const humanYToCanvasY = buildingRevitHeight / buildingCanvasHeight;

const collisionBoundary = 300;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  width: ${imageWidth};
  height: ${imageHeight};
`;

const Container = styled.div`
  min-height: 100vh;
  overflow: auto;
  padding: 20px 0;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const App = () => {
  const [humanPositions, setHumanPosition] = React.useState(Array(testingHumans.length).fill(0));
  const [waited, setWaited] = React.useState([]);
  const prevPositions = usePrevious(humanPositions) || Array(testingHumans.length).fill(0);
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
    const { collisionDetected, goneBack } = detectCollision({
      humans: testingHumans,
      newPositions: updatedNewPositions,
      goneBack: [],
      collisionBoundary
    });
    let collision = collisionDetected;
    let humansStayed = goneBack;
    while (collision) {
      // eslint-disable-next-line no-loop-func
      updatedNewPositions = newPositions.map((n, i) =>
        humansStayed.includes(i) ? n - 1 : n
      );
      const { collisionDetected, goneBack } = detectCollision({
        humans: testingHumans,
        newPositions: updatedNewPositions,
        goneBack: humansStayed,
        collisionBoundary
      });
      collision = collisionDetected;
      humansStayed = goneBack;
    }
    setWaited(flatten(append(waited, humansStayed.map(s => ({
      x: testingHumans[s][updatedNewPositions[s]].x,
      y: testingHumans[s][updatedNewPositions[s]].y,
    })))));
    setHumanPosition(updatedNewPositions);
  };

  return (
    <Container>
      <Title />
      <div style={{height: imageHeight, width: imageWidth}}>
        <BuildingImage />
        <CanvasContainer>
          <Stage
            width={buildingCanvasWidth}
            height={buildingCanvasHeight}
            style={{ position: 'absolute', top: originOffset.y, left: originOffset.x }}
          >
            <Layer>
              {testingHumans.map((h, i) => (
                <HumanDot
                  key={i}
                  prevX={h[prevPositions[i]].x / humanXToCanvasX}
                  prevY={(buildingRevitHeight - h[prevPositions[i]].y) / humanYToCanvasY}
                  X={h[humanPositions[i]].x / humanXToCanvasX}
                  Y={(buildingRevitHeight - h[humanPositions[i]].y) / humanYToCanvasY}
                />
              ))}
            </Layer>
            <Layer>
              {waited.map(((w, i) =>
                <Circle
                  key={i}
                  x={w.x/humanXToCanvasX}
                  y={(buildingRevitHeight - w.y)/humanYToCanvasY}
                  width={27}
                  shadowBlur={10}
                  fill='rgba(255, 0, 0, 0.008)'
                />
              ))}
            </Layer>
          </Stage>
        </CanvasContainer>
        <Controls
          onPrev={goBack}
          onNext={goForward}
          stepNumber={stepNumber}
        />
      </div>
    </Container>
  );
};

export default App;
