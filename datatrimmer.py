import csv
from collections import Counter

import csv
with open("profiles.csv") as f:
    reader = csv.reader(f, delimiter=",")
    locations = []
    for i in reader:
        locations.append(i[21])
    locations = Counter(locations).most_common(10)

    with open("cities.csv", "w") as c:
    	fields = ["city", "users"]
    	writer=csv.writer(c)
    	writer.writerow(fields)
    	for key, value in locations:
            print(key);
            writer.writerow([key] + [value])
