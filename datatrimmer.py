import csv
from collections import Counter

import csv
with open("profiles.csv") as f:
    reader = csv.reader(f, delimiter=",")
    essay0 = [];
    essay1 = [];
    essay2 = [];
    essay3 = [];
    essay4 = [];
    essay5 = [];
    essay6 = [];
    essay7 = [];
    essay8 = [];
    essay9 = [];
    f.readline()
    for i in reader:
        essay0.append(i[6])
        essay1.append(i[7])
        essay2.append(i[8])
        essay3.append(i[9])
        essay4.append(i[10])
        essay5.append(i[11])
        essay6.append(i[12])
        essay7.append(i[13])
        essay8.append(i[14])
        essay9.append(i[15])

    with open("essays.csv", "w") as c:
    	fields = ["essay0", "essay1", "essay2", "essay3", "essay4", "essay5", "essay6", "essay7", "essay8", "essay9"]
    	writer=csv.writer(c)
    	writer.writerow(fields)
    	for value in essay4:
            writer.writerow([value])
