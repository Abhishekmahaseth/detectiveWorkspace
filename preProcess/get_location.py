import pprint

import spacy
from spacy import displacy
from collections import Counter
nlp = spacy.load("en_core_web_sm")

import json
from os import listdir
from os.path import isfile, join

import re

fileNames = [f for f in listdir('./text')]
fileNames.sort()

locations = []
peopleNames = []
index = -1
index_people = -1
for i in range( len(fileNames) ):
    filePath = "text/" + fileNames[i]
    text = open(filePath).read()

    doc = nlp(text)

    # displacy.serve(doc, style="dep")

    for token in doc:
        if(token.ent_type_ == 'GPE' and token.ent_iob_ == 'B'):
            locations.append(token.text)
            index = index + 1

        if(token.ent_type_ == 'GPE' and token.ent_iob_ == 'I'):
            locations[index] = locations[index] + " " + token.text

        if(token.ent_type_ == 'PERSON' and token.ent_iob_ == 'B'):
            peopleNames.append(token.text)
            index_people = index_people + 1

        if(token.ent_type_ == 'PERSON' and token.ent_iob_ == 'I'):
            peopleNames[index_people] = peopleNames[index_people] + " " + token.text



        # if(token.ent_type_ == 'DATE'):
        #     print( [child for child in token.children] )


    # print(locations)

print(Counter(peopleNames))
