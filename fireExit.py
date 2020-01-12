import itertools

# mylist = [1, 2, 2, 4]

# def compare(a, b):
#   if a == b:
#     print('{} equals {}'.format(a, b))

# for a, b in itertools.combinations(mylist, 2):
#     compare(a, b)

class Human:  
    def __init__(self, x, y, steps):  
      self.x = x
      self.y = y
      self.coordinates = {
        'x': self.x,
        'y': self.y
      }
      self.steps = steps

    def setCoordinates(self, coords):  
      self.x = coords['x']
      self.y = coords['y']
      self.coordinates = coords

    def hasArrived(self):
      return (self.x == self.steps[-1]['x']) & (self.y == self.steps[-1]['y'])

human1 = Human(0, 3, [
      {
        'x': 1.4,
        'y': 3
      },
          {
        'x': 2.8,
        'y': 3
      },
          {
        'x': 4.2,
        'y': 3
      },
      {
        'x': 4.2,
        'y': 1.6
      },
      {
        'x': 2.8,
        'y': 1.6
      }
    ])

human2 = Human(10, 6, [
      {
        'x': 10,
        'y': 4.6
      },
          {
        'x': 8.6,
        'y': 4.6
      },
          {
        'x': 8.6,
        'y': 3
      },
      {
        'x': 8.6,
        'y': 1.6
      },
      {
        'x': 7.2,
        'y': 1.6
      },
      {
        'x': 5.8,
        'y': 1.6
      },
      {
        'x': 4.4,
        'y': 1.6
      },
      {
        'x': 3,
        'y': 1.6
      }
    ])


humans = [human1, human2]
zone = {
  'xMin': 3,
  'xMax': 4,
  'yMin': 1,
  'yMax': 2
}

# def isInZone(zone, human):
#   isInXBounds = zone['xMin'] <= human.x <= zone['xMax']
#   isInYBounds = zone['yMin'] <= human.y <= zone['yMax']
#   return isInXBounds & isInYBounds

def haveAllArrived(humans):
  haveAllArrived = True
  for human in humans:
    haveAllArrived = haveAllArrived & human.hasArrived()
  return haveAllArrived

def detectCollisions(humans, step):
  for humanX, humanY in itertools.combinations(humans, 2):
    print(humanX.coordinates, humanY.coordinates)
    print(abs(humanX.x - humanY.x) < 1.2)
    print(abs(humanX.y - humanY.y) < 1.2)
    print(step)
    if (abs(humanX.x - humanY.x) < 1.2) | (abs(humanX.y - humanY.y) < 1.2):
      print('collision detected')
      humanX.setCoordinates(humanX.steps[step - 1])
      continue


i = 0

while not haveAllArrived(humans):
  # Intermediate state
  for (y, human) in enumerate(humans):
    if human.hasArrived():
      continue
    human.setCoordinates(human.steps[i])
  # for human in humans:
  #   print(human.coordinates)
  # detectCollisions(humans, i)
  i+=1

print(human1.coordinates)
print(human2.coordinates)
print(humans[0])