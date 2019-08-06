import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.tree import Tree

import json
from os import listdir
from os.path import isfile, join

import re

stop_words = set(stopwords.words('english'))
fileNames = [f for f in listdir('./text')]
fileNames.sort()

fd = open("data.json", "a+")
fd.write( '[' );

fileContent = []
pos = []
chunks = []
for i in range( len(fileNames) ):
    filePath = "text/" + fileNames[i]                                   ######  FILTERING NOT WORKING
    text = open(filePath).read()
    chunks.append([])

    # pos.append(   nltk.pos_tag( word_tokenize(text) )   )
    for chunk in nltk.ne_chunk(   nltk.pos_tag( word_tokenize(text) )   ):
        if hasattr(chunk, 'label'):
            chunkStr = (chunk.label(), ' '.join(c[0] for c in chunk))
            chunks[i].append(chunkStr)


    #make a set of all the locations found then use regex to replace strings
    fileContent.append([])
    # for x in set(chunks[i]):
    #     # print('x[0]: ' + x[0] + '   x[1]: ' + x[1] )
    #     if(x[0] == 'GPE'):      #check if this is only the first of many tuples
    #         regex = re.compile(x[1])
    #         splitLocation = x[1].split();
    #         if len(splitLocation) > 1:
    #             id = splitLocation[0] + '_' + splitLocation[1]
    #         else:
    #             id = x[1]
    #
    #         tempStr = ' ' + id + '$ '
    #         text = regex.sub(tempStr, text)

    fileContent[i].append(text)
    fd.write(json.dumps({"fileName": fileNames[i], "fileContent": text}))
    if( i != len(fileNames)-1 ):
        fd.write( ',' )

fd.write( ']' )
fd.close()


# print(chunks)
# print(fileContent[0])
