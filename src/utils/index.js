export const pairsOfArray = array => array.reduce(
  (acc, _, i1) => [
    ...acc,
    ...new Array(array.length - 1 - i1).fill(0).map((v, i2) => ({
      first: array[i1],
      second: array[i1 + 1 + i2],
      indexes: [i1, i1 + 1 + i2]
    }))
  ],
  []
);

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