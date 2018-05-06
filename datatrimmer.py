import csv
from collections import Counter

import csv
with open("profiles.csv") as f:
    reader = csv.reader(f, delimiter=",")
    essay4 = [];
    f.readline()
    for i in reader:
        essay4.append(i[10])

    with open("essays.csv", "w") as c:
    	fields = ["essay4"]
    	writer=csv.writer(c)
    	writer.writerow(fields)
    	for value in essay4:
            writer.writerow([value])
