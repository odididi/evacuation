import itertools
import uuid

class Human:  
    def __init__(self, x, y, steps):  
      self.id = str(uuid.uuid4())
      self.x = x
      self.y = y
      self.coordinates = {
        'x': self.x,
        'y': self.y
      }
      self.initialCoordinates = {
        'x': self.x,
        'y': self.y
      }
      self.steps = steps
      self.position = 0

    def setCoordinates(self, coords):  
      self.x = coords['x']
      self.y = coords['y']
      self.coordinates = coords

    def goBack(self):
      self.position = max(0, self.position - 1)
      self.setCoordinates(self.steps[self.position])

    def goForward(self):
      self.position = min(len(self.steps), self.position + 1)
      self.setCoordinates(self.steps[self.position])

    def hasArrived(self):
      return (self.x == self.steps[-1]['x']) & (self.y == self.steps[-1]['y'])

humans = [human1, human2, human3]

def haveAllArrived(humans):
  haveAllArrived = True
  for human in humans:
    haveAllArrived = haveAllArrived & human.hasArrived()
  return haveAllArrived

def detectCollisions(humans, step):
  haveGoneBack = []
  for humanX, humanY in itertools.combinations(humans, 2):
    if (humanX.hasArrived() | humanY.hasArrived()):
      continue
    if (abs(humanX.x - humanY.x) < 1.2) & (abs(humanX.y - humanY.y) < 1.2):
      if not (humanX.id in haveGoneBack):
        humanX.goBack()
        haveGoneBack.append(humanX.id)


i = 0

while not haveAllArrived(humans):
  # Intermediate state
  print('STEP {} \n'.format(i + 1))
  for (y, human) in enumerate(humans):
    print('Before human {} coords: {} \n in position {}'.format(y + 1, human.coordinates, human.position))
    if human.hasArrived():
      continue
    human.goForward()
  detectCollisions(humans, i)
  for (y, human) in enumerate(humans):
    print('After human {} coords: {} \n in position {}'.format(y + 1, human.coordinates, human.position))
  i+=1