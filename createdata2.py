import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import text 
from nltk.tokenize import TweetTokenizer

import operator
import json


tweettokenizer = TweetTokenizer()

with open("meep.csv") as f:
    df = pd.read_csv(f)

essays = ["essay0", "essay1", "essay2", "essay3", "essay4", "essay5", "essay6", "essay7", "essay8", "essay9"]
# gender = "f"
# gender2 = "m"

def preprocessed(s):
    return BeautifulSoup(s, "html.parser").get_text()

# nwords = 200
english_plus = set(text.ENGLISH_STOP_WORDS)
english_plus.add("nan")
english_plus.add("sf")
english_plus.add("san")
english_plus.add("francisco")
english_plus.add('.')
english_plus.add(',')
english_plus.add('/')
english_plus.add('!')
english_plus.add('?')
english_plus.add(':')
english_plus.add(')')
english_plus.add('(')
english_plus.add('...')
english_plus.add('-')
english_plus.add('\"')
english_plus.add("'")
english_plus.add("*")
english_plus.add(";")
english_plus.add("..")
english_plus.add(":)")
english_plus.add(":D")
english_plus.add(":(")
english_plus.add(":/")
english_plus.add("&")
english_plus.add("^")
english_plus.add("$")
english_plus.add("#")
english_plus.add("@")
english_plus.add("~")
english_plus.add("`")
english_plus.add("=")
english_plus.add("_")
english_plus.add("|")
english_plus.add('"')
english_plus.add('[')
english_plus.add(']')
english_plus.add('{')
english_plus.add('}')



# json_both = []
# json_male = []
# json_female = []
json_array = []
for essay in essays:
	shared_dict = {}
	female_dict = {}
	male_dict = {}
	pattern = "(?u)\\b[\\w-]+\\b"
	cvect = TfidfVectorizer(stop_words=english_plus, preprocessor = preprocessed, min_df=10, max_df = 0.95, max_features=200, tokenizer=tweettokenizer.tokenize, ngram_range=(1,2))
	# females
	counts = cvect.fit_transform(df[df.sex == 'f'][essay].values.astype('U'))
	counts_sum = (counts.toarray().sum(axis=0)).tolist()
	cvect_dict = cvect.vocabulary_ #ohh these are just indexes cuz vector is always the same cuz vector space model
	for word, word_index in cvect_dict.items():
		female_dict[word] = counts_sum[word_index]

	# Females
	counts = cvect.fit_transform(df[df.sex == 'm'][essay].values.astype('U'))
	counts_sum = (counts.toarray().sum(axis=0)).tolist()
	cvect_dict = cvect.vocabulary_ #ohh these are just indexes cuz vector is always the same cuz vector space model
	for word, word_index in cvect_dict.items():
		male_dict[word] = counts_sum[word_index]

	#we only want to see where they both talked
	male_intersect_female = set(female_dict.keys()) & set(male_dict.keys())
	for common_word in male_intersect_female:
		shared_dict[common_word] = male_dict[common_word] + female_dict[common_word]

	sorted_top_f = sorted(female_dict.items(), key=operator.itemgetter(1), reverse=True)
	sorted_top_fdarray = [{'word':x[0], 'count':x[1]} for x in sorted_top_f]
	# sorted_f_word = [x[0] for x in sorted_top_f]
	# sorted_f_count = [x[1] for x in sorted_top_f]
	
	sorted_top_m = sorted(male_dict.items(), key=operator.itemgetter(1), reverse=True)
	sorted_top_mdarray = [{'word':x[0], 'count':x[1]} for x in sorted_top_m]
	# sorted_m_word = [x[0] for x in sorted_top_m]
	# sorted_m_count = [x[1] for x in sorted_top_m]
	
	sorted_top_both = sorted(shared_dict.items(), key=operator.itemgetter(1), reverse=True)
	sorted_top_bothdarray = [{'word':x[0], 'count':x[1], 'fcount': female_dict[x[0]], 'mcount': male_dict[x[0]]} for x in sorted_top_both]
	# sorted_both_word = [x[0] for x in sorted_top_both]
	# sorted_both_count = [x[1] for x in sorted_top_both]

	# meep = {'essay':essay, 'female':sorted_f_word, 'female_count':sorted_f_count, 'male':sorted_m_word, 'male_count':sorted_m_count, 'both':sorted_both_word, 'both_count':sorted_both_count}
	meep = {'essay':essay, 'female': sorted_top_fdarray, 'male': sorted_top_mdarray ,'both': sorted_top_bothdarray}
	json_array.append(meep)


with open('potato5.json', 'w') as outfile:

	json.dump(json_array, outfile, indent=4)


# with open('potato.json', 'w') as outfile:
# 	json_array = []
# 	for gender in ["m", "f"]:
# 		for essay in essays:
# 			cvect = CountVectorizer(stop_words="english", preprocessor = preprocessed, min_df=10, max_df = 0.95, max_features =200, ngram_range=(1,2))
# 			counts = cvect.fit_transform(df[df.sex == gender][essay].values.astype('U'))
# 			counts_sum = (counts.toarray().sum(axis=0)).tolist()
# 			cvect_dict = cvect.vocabulary_ #ohh these are just indexes cuz vector is always the same cuz vector space model
# 			newcvect_dict = {}
# 			# word = []
# 			# word_count = []
# 			for key, value in cvect_dict.items():
# 				# word.append(key)
# 				# word_count.append(value)
# 				newcvect_dict[key] = counts_sum[value]
# 			sorted_top = sorted(newcvect_dict.items(), key=operator.itemgetter(1), reverse=True)
# 			meep = {'gender':'f', 'essay':essay, 'top_word':sorted_top}
# 			json_array.append(meep)

# 	json.dump(json_array, outfile, indent=4)

# with open('okcupidsf_m' + gender2 + '.json', 'w') as outfile:
# 	json_array = []
# 	for essay in essays:
# 		cvect = CountVectorizer(stop_words="english", preprocessor = preprocessed, min_df=10, max_df = 0.95, max_features =200, ngram_range=(1,2))
# 		counts = cvect.fit_transform(df[df.sex == gender][essay].values.astype('U'))
# 		counts_sum = (counts.toarray().sum(axis=0)).tolist()
# 		cvect_dict = cvect.vocabulary_ #ohh these are just indexes cuz vector is always the same cuz vector space model
# 		newcvect_dict = {}
# 		# word = []
# 		# word_count = []
# 		for key, value in cvect_dict.items():
# 			# word.append(key)
# 			# word_count.append(value)
# 			newcvect_dict[key] = counts_sum[value]
# 		sorted_top = sorted(newcvect_dict.items(), key=operator.itemgetter(1), reverse=True)
# 		meep = {'gender':'f', 'essay':essay, 'top_word':sorted_top}
# 		json_array.append(meep)

# 	json.dump(json_array, outfile, indent=4)

# with open('okcupidsf_both.json', 'w') as outfile:
# 	json_array = []
# 	for essay in essays:
# 		cvect = CountVectorizer(stop_words="english", preprocessor = preprocessed, min_df=10, max_df = 0.95, max_features =200, ngram_range=(1,2))
# 		counts = cvect.fit_transform(df[essay].values.astype('U'))
# 		counts_sum = (counts.toarray().sum(axis=0)).tolist()
# 		cvect_dict = cvect.vocabulary_ #ohh these are just indexes cuz vector is always the same cuz vector space model
# 		newcvect_dict = {}
# 		# word = []
# 		# word_count = []
# 		for key, value in cvect_dict.items():
# 			# word.append(key)
# 			# word_count.append(value)
# 			newcvect_dict[key] = counts_sum[value]
# 		sorted_top = sorted(newcvect_dict.items(), key=operator.itemgetter(1), reverse=True)
# 		meep = {'gender':'f', 'essay':essay, 'top_word':sorted_top}
# 		json_array.append(meep)

# 	json.dump(json_array, outfile, indent=4)