import csv
from collections import Counter

import csv
with open("meep.csv") as f:
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
        essay0.append(i[7])
        essay1.append(i[8])
        essay2.append(i[9])
        essay3.append(i[10])
        essay4.append(i[11])
        essay5.append(i[12])
        essay6.append(i[13])
        essay7.append(i[14])
        essay8.append(i[15])
        essay9.append(i[16])

    with open("essay0.csv", "wb") as c:
        fields = ["essay1"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay0:
            writer.writerow([value])

    with open("essay1.csv", "wb") as c:
        fields = ["essay1"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay1:
            writer.writerow([value])

    with open("essay2.csv", "wb") as c:
        fields = ["essay2"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay2:
            writer.writerow([value])

    with open("essay3.csv", "wb") as c:
        fields = ["essay3"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay3:
            writer.writerow([value])

    with open("essay4.csv", "wb") as c:
        fields = ["essay4"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay4:
            writer.writerow([value])

    with open("essay5.csv", "wb") as c:
        fields = ["essay5"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay5:
            writer.writerow([value])

    with open("essay6.csv", "wb") as c:
        fields = ["essay6"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay6:
            writer.writerow([value])

    with open("essay7.csv", "wb") as c:
        fields = ["essay7"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay7:
            writer.writerow([value])

    with open("essay8.csv", "wb") as c:
        fields = ["essay8"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay8:
            writer.writerow([value])

    with open("essay9.csv", "wb") as c:
        fields = ["essay9"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay9:
            writer.writerow([value])

