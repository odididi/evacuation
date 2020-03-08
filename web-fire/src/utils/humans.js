import {pairsOfArray} from '.';

export const detectCollision = ({
  humans,
  newPositions,
  goneBack,
  collisionBoundary
}) => {
  const newCoords = newPositions.map((p, i) => ({
    x: humans[i][p].x,
    y: humans[i][p].y
  }));
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
        newPositions[indexes[0]] === humans[indexes[0]].length - 1 ||
        newPositions[indexes[1]] === humans[indexes[1]].length - 1
      ) {
        continue;
      }
      if (goneBack.includes(indexes[0])) {
        newIndex = indexes[1];
      } else {
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

export const distanceToSafety = (humans, humanIndex, position) => {
  const currentCoords = {
    x: humans[humanIndex][position].x,
    y: humans[humanIndex][position].y
  }
  const nextCoords = {
    x: humans[humanIndex][position + 1].x,
    y: humans[humanIndex][position + 1].y
  }
  const distanceFromNextStep = Math.sqrt(
    Math.pow(nextCoords.x - currentCoords.x, 2) +
    Math.pow(nextCoords.y - currentCoords.y, 2)
  )
  return distanceFromNextStep;
}