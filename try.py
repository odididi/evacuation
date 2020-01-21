import clr

# Import RevitAPI
clr.AddReference("RevitAPI")
import Autodesk
from Autodesk.Revit.DB import ReferencePointArray

# Import DocumentManager and TransactionManager
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager

# Import ToDSType(bool) extension method
clr.AddReference("RevitNodes")
import Revit
clr.ImportExtensions(Revit.Elements)

clr.AddReference("ProtoGeometry")
from Autodesk.DesignScript.Geometry import *
# Unwrap

# Start Transaction
doc = DocumentManager.Instance.CurrentDBDocument
TransactionManager.Instance.EnsureInTransaction(doc)

# Code
import itertools
import uuid

class Human:  
  def __init__(self, x, y, steps, position):  
    self.id = str(uuid.uuid4())
    self.x = x
    self.y = y
    self.steps = steps
    self.position = position

  def setCoordinates(self, coords):  
    self.x = coords['x']
    self.y = coords['y']

  def goBack(self):
    self.position = max(0, self.position - 1)
    self.setCoordinates(self.steps[self.position])

  def hasArrived(self):
    return self.position == (len(self.steps) - 1)

# Inputs
humansSteps = In[0]
humanElements = IN[1]
index = IN[2]

# Create human dictionaries
humans = []

for (i, humanSteps) in enumerate(humansSteps):
  humanInitialX = humanSteps[index]['x']
  humanInitialY = humanSteps[index]['y']
  # steps = map(lambda point: { 'x': point.X, 'y': point.Y }, humanSteps)
  humans.append(Human(humanInitialX, humanInitialY, humansSteps[i], index))

collisionBoundary = 800

def detectCollisions(humans):
  for humanX, humanY in itertools.combinations(humans, 2):
    if (abs(humanX.x - humanY.x) < collisionBoundary) & (abs(humanX.y - humanY.y) < collisionBoundary):
      humanX.goBack()
      return True

hasCollision = detectCollisions(humans)
while hasCollision:
  hasCollision = detectCollisions(humans)

# humansss2 = map(lambda human: {'pos': human.position, 'x': human.x, 'y': human.y}, humans)
# print(list(humansss2))
# Reposition human elements
for (i, human) in enumerate(humans):
	point = Point.ByCoordinates(human.x, human.y, 6096)
	humanElements[i].SetLocation(point)

# End Transaction
TransactionManager.Instance.TransactionTaskDone()

# Wrap
OUT = humanElements
