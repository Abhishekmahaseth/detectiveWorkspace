import json
from os import listdir
from os.path import isfile, join


fileNames = [f for f in listdir('./text')]
fileNames.sort()

fd = open("data.json", "a+")
fd.write( '[' );
x = 1
for i in fileNames:
    filePath = "text/" + i
    fileContent = open(filePath).read()
    fd.write(json.dumps({"fileName": i, "fileContent": fileContent}))
    if( x != len(fileNames) ):
        fd.write( ',' );
    x = x+1
fd.write( ']' );
fd.close()
