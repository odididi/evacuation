# import clr

# # Import RevitAPI
# clr.AddReference("RevitAPI")
# import Autodesk
# from Autodesk.Revit.DB import ReferencePointArray

# # Import DocumentManager and TransactionManager
# clr.AddReference("RevitServices")
# import RevitServices
# from RevitServices.Persistence import DocumentManager
# from RevitServices.Transactions import TransactionManager

# # Import ToDSType(bool) extension method
# clr.AddReference("RevitNodes")
# import Revit
# clr.ImportExtensions(Revit.Elements)

# # Unwrap
# humans = UnwrapElement( IN[0] )
# indpoints = UnwrapElement( IN[1] )
# step = IN[2]
# Room =  UnwrapElement( IN[3] )
# # Start Transaction
# doc = DocumentManager.Instance.CurrentDBDocument
# TransactionManager.Instance.EnsureInTransaction(doc)

# Code
a=3
b=1
outPut = []
for human in humans:
	intlist = []
	for point in indpoints:
		if human.DoesIntersect(point)
			intlist.append(True)			
		else:
			intlist.append(False)
		outPut.append(intlist)
		
# End Transaction
# TransactionManager.Instance.TransactionTaskDone()

# Wrap
OUT = outPut