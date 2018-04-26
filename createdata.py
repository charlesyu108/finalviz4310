import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import CountVectorizer
import operator
import json


with open("profiles.csv") as f:
    df = pd.read_csv(f)

N = 50
top_n = df.location.value_counts().head(n=N).index.tolist() #np array
essays = ["essay0", "essay1", "essay2", "essay3", "essay4", "essay5", "essay6", "essay7", "essay8", "essay9"]

def preprocessed(s):
    return BeautifulSoup(s, "html.parser").get_text()

with open('okcupid.json', 'w') as outfile:
	json_array = []
	for i in range(N): #N is top n cities
		for essay in essays:
			cvect = CountVectorizer(stop_words="english", preprocessor = preprocessed, min_df=10, max_df = 0.95, max_features =200, ngram_range=(1,2))
			counts = cvect.fit_transform(df[df.location == top_n[i]][essay].values.astype('U'))
			counts_sum = (counts.toarray().sum(axis=0)).tolist()
			cvect_dict = cvect.vocabulary_ #ohh these are just indexes cuz vector is always the same cuz vector space model
			newcvect_dict = {}
			# word = []
			# word_count = []
			for key, value in cvect_dict.items():
				# word.append(key)
				# word_count.append(value)
				newcvect_dict[key] = counts_sum[value]
			sorted_top = sorted(newcvect_dict.items(), key=operator.itemgetter(1), reverse=True)
			meep = {'city':top_n[i], 'essay':essay, 'top_word':sorted_top}
			json_array.append(meep)

	json.dump(json_array, outfile, indent=4)