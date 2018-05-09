import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import text 
from nltk.tokenize import TweetTokenizer
from nltk import FreqDist,pos_tag
import pickle
import csv
import operator

essays = ["essay0", "essay1", "essay2", "essay3", "essay4", "essay5", "essay6", "essay7", "essay8", "essay9"]

json_array = []
for essay in essays:

	with open("pickles/{}-{}-features.pickle".format(essay, "f"), "rb+") as f:
		featurez_female = pickle.load(f)

	with open("pickles/{}-{}-features.pickle".format(essay, "m"), "rb+") as f:
		featurez_male = pickle.load(f)

	# featurez_both = set(featurez_female) & set(featurez_male)
	# featurez_male_only = set(featurez_male) - featurez_both
	# featurez_female_only = set(featurez_female) - featurez_both
	# featurez_all = np.array(list(set(featurez_female.tolist()) | set(featurez_male.tolist())))
	featurez_all = np.union1d(featurez_male, featurez_female)
	np.savetxt("topwords/topwords-{}.csv".format(essay), featurez_all, delimiter=",", fmt="%s") 