import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import text 
from nltk.tokenize import TweetTokenizer
from nltk import FreqDist,pos_tag

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
english_plus.add('<')
english_plus.add('>')
english_plus.add('br')
english_plus.add("i'm")
english_plus.add("i'll")
english_plus.add("it's")
english_plus.add("i've")
english_plus.add("+")
english_plus.add("i'd")
english_plus.add("you're")
english_plus.add("let's")
english_plus.add("don't")
english_plus.add("actually")
english_plus.add("1")
english_plus.add("2")
english_plus.add("3")
english_plus.add("4")
english_plus.add("5")
english_plus.add("6")
english_plus.add("7")
english_plus.add("8")
english_plus.add("9")
english_plus.add("10")
english_plus.add("b")
english_plus.add("c")
english_plus.add("d")
english_plus.add("e")
english_plus.add("f")
english_plus.add("g")
english_plus.add("h")
english_plus.add("i")
english_plus.add("j")
english_plus.add("k")
english_plus.add("l")
english_plus.add("m")
english_plus.add("n")
english_plus.add("o")
english_plus.add("p")
english_plus.add("q")
english_plus.add("r")
english_plus.add("s")
english_plus.add("t")
english_plus.add("u")
english_plus.add("v")
english_plus.add("w")
english_plus.add("x")
english_plus.add("y")
english_plus.add("z")
english_plus.add("there's")



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
	
	# adjectives, adverbs only
	# essays_pos_tagged= [pos_tag(tweettokenizer.tokenize(m)) for m in df[df.sex == 'f'][essay].values.astype('U')]
	# reviews_adj_adv_only=[" ".join([w for w,tag in m if tag in ["JJ","RB","RBS","RBJ","JJR","JJS"]])
	# 						  for m in essays_pos_tagged]

	# Females
	counts = cvect.fit_transform(df[df.sex == 'f'][essay].values.astype('U'))
	# counts = cvect.fit_transform(reviews_adj_adv_only)
	counts_sum = (counts.toarray().sum(axis=0)).tolist()
	cvect_dict = cvect.vocabulary_ #ohh these are just indexes cuz vector is always the same cuz vector space model
	for word, word_index in cvect_dict.items():
		female_dict[word] = counts_sum[word_index]

	# # Males
	# essays_pos_tagged= [pos_tag(tweettokenizer.tokenize(m)) for m in df[df.sex == 'm'][essay].values.astype('U')]
	# reviews_adj_adv_only=[" ".join([w for w,tag in m if tag in ["JJ","RB","RBS","RBJ","JJR","JJS"]])
	# 						  for m in essays_pos_tagged]

	counts = cvect.fit_transform(df[df.sex == 'm'][essay].values.astype('U'))
	# counts = cvect.fit_transform(reviews_adj_adv_only)
	counts_sum = (counts.toarray().sum(axis=0)).tolist()
	cvect_dict = cvect.vocabulary_ #ohh these are just indexes cuz vector is always the same cuz vector space model
	for word, word_index in cvect_dict.items():
		male_dict[word] = counts_sum[word_index]

	#we only want to see where they both talked
	male_intersect_female = set(female_dict.keys()) & set(male_dict.keys())
	for common_word in male_intersect_female:
		shared_dict[common_word] = male_dict[common_word] + female_dict[common_word]

	female_only = set(female_dict.keys()) - set(shared_dict.keys())
	male_only = set(male_dict.keys()) - set(shared_dict.keys())

	female_only_dict = {}
	for potato in female_only:
		female_only_dict[potato] = female_dict[potato]

	male_only_dict = {}
	for rotato in male_only:
		male_only_dict[rotato] = male_dict[rotato]


	# working hard example bigram
	bigram_set = set([])
	for key, value in shared_dict.items():
		if len(key.split(" ")) == 2:
			arr = key.split(" ")
			bigram_set.add(arr[0])
			bigram_set.add(arr[1])

	for key, value in female_only_dict.items():
		if len(key.split(" ")) == 2:
			arr = key.split(" ")
			bigram_set.add(arr[0])
			bigram_set.add(arr[1])

	for key, value in male_only_dict.items():
		if len(key.split(" ")) == 2:
			arr = key.split(" ")
			bigram_set.add(arr[0])
			bigram_set.add(arr[1])

	shared_dictnobigrams = {}
	for key, value in shared_dict.items():
		if key not in bigram_set:
			shared_dictnobigrams[key] = value

	female_only_dictnobigrams = {}
	for key, value in female_only_dict.items():
		if key not in bigram_set:
			female_only_dictnobigrams[key] = value

	male_only_dictnobigrams = {}
	for key, value in male_only_dict.items():
		if key not in bigram_set:
			male_only_dictnobigrams[key] = value




	sorted_top_f = sorted(female_only_dictnobigrams.items(), key=operator.itemgetter(1), reverse=True)
	sorted_top_fdarray = [{'word':x[0], 'count':x[1]} for x in sorted_top_f]
	# sorted_f_word = [x[0] for x in sorted_top_f]
	# sorted_f_count = [x[1] for x in sorted_top_f]
	
	sorted_top_m = sorted(male_only_dictnobigrams.items(), key=operator.itemgetter(1), reverse=True)
	sorted_top_mdarray = [{'word':x[0], 'count':x[1]} for x in sorted_top_m]
	# sorted_m_word = [x[0] for x in sorted_top_m]
	# sorted_m_count = [x[1] for x in sorted_top_m]
	
	sorted_top_both = sorted(shared_dictnobigrams.items(), key=operator.itemgetter(1), reverse=True)
	sorted_top_bothdarray = [{'word':x[0], 'count':x[1], 'fcount': female_dict[x[0]], 'mcount': male_dict[x[0]]} for x in sorted_top_both]
	# sorted_both_word = [x[0] for x in sorted_top_both]
	# sorted_both_count = [x[1] for x in sorted_top_both]

	# meep = {'essay':essay, 'female':sorted_f_word, 'female_count':sorted_f_count, 'male':sorted_m_word, 'male_count':sorted_m_count, 'both':sorted_both_word, 'both_count':sorted_both_count}
	meep = {'essay':essay, 'female': sorted_top_fdarray, 'male': sorted_top_mdarray ,'both': sorted_top_bothdarray}
	json_array.append(meep)


with open('potato6.json', 'w') as outfile:

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