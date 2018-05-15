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

    with open("essay0.csv", "w") as c:
        fields = ["essay0"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay0:
            writer.writerow([value])

    with open("essay1.csv", "w") as c:
        fields = ["essay1"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay1:
            writer.writerow([value])

    with open("essay2.csv", "w") as c:
        fields = ["essay2"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay2:
            writer.writerow([value])

    with open("essay3.csv", "w") as c:
        fields = ["essay3"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay3:
            writer.writerow([value])

    with open("essay4.csv", "w") as c:
        fields = ["essay4"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay4:
            writer.writerow([value])

    with open("essay5.csv", "w") as c:
        fields = ["essay5"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay5:
            writer.writerow([value])

    with open("essay6.csv", "w") as c:
        fields = ["essay6"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay6:
            writer.writerow([value])

    with open("essay7.csv", "w") as c:
        fields = ["essay7"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay7:
            writer.writerow([value])

    with open("essay8.csv", "w") as c:
        fields = ["essay8"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay8:
            writer.writerow([value])

    with open("essay9.csv", "w") as c:
        fields = ["essay9"]
        writer=csv.writer(c)
        writer.writerow(fields)
        for value in essay9:
            writer.writerow([value])

# import csv
# from collections import Counter

# import csv
# with open("profiles.csv") as f, open("topwords/topwords-essay0.csv") as words0, open("topwords/topwords-essay1.csv") as words1,open("topwords/topwords-essay2.csv") as words2,open("topwords/topwords-essay3.csv") as words3,open("topwords/topwords-essay4.csv") as words4,open("topwords/topwords-essay5.csv") as words5,open("topwords/topwords-essay6.csv") as words6,open("topwords/topwords-essay7.csv") as words7,open("topwords/topwords-essay8.csv") as words8,open("topwords/topwords-essay9.csv") as words9:
#     essay0 = [];
#     essay1 = [];
#     essay2 = [];
#     essay3 = [];
#     essay4 = [];
#     essay5 = [];
#     essay6 = [];
#     essay7 = [];
#     essay8 = [];
#     essay9 = [];
#     topwords0 = [];
#     topwords1 = [];
#     topwords2 = [];
#     topwords3 = [];
#     topwords4 = [];
#     topwords5 = [];
#     topwords6 = [];
#     topwords7 = [];
#     topwords8 = [];
#     topwords9 = [];

#     reader0 = csv.reader(words0, delimiter=",")
#     for i in reader0:
#         topwords0.append(''.join(i))
#     reader1 = csv.reader(words1, delimiter=",")
#     for i in reader1:
#         topwords1.append(''.join(i))  
#     reader2 = csv.reader(words2, delimiter=",")
#     for i in reader2:
#         topwords2.append(''.join(i)) 
#     reader3 = csv.reader(words3, delimiter=",")
#     for i in reader3:
#         topwords3.append(''.join(i)) 
#     reader4 = csv.reader(words4, delimiter=",")
#     for i in reader4:
#         topwords4.append(''.join(i)) 
#     reader5 = csv.reader(words5, delimiter=",")
#     for i in reader5:
#         topwords5.append(''.join(i))
#     reader6 = csv.reader(words6, delimiter=",")
#     for i in reader6:
#         topwords6.append(''.join(i))
#     reader7 = csv.reader(words7, delimiter=",")
#     for i in reader7:
#         topwords7.append(''.join(i))
#     reader8 = csv.reader(words8, delimiter=",")
#     for i in reader8:
#         topwords8.append(''.join(i))
#     reader9 = csv.reader(words9, delimiter=",")
#     for i in reader9:
#         topwords9.append(''.join(i))

#     reader = csv.reader(f, delimiter=",")
#     f.readline()
#     for i in reader:
#         for word in topwords0:
#             if word in i[6]:
#                 essay0.append(i[6])
#                 print("added 0")
#                 break
#         for word in topwords1:
#             if word in i[7]:
#                 essay1.append(i[7])
#         for word in topwords2:
#             if word in i[8]:
#                 essay2.append(i[8])
#         for word in topwords3:
#             if word in i[9]:
#                 essay3.append(i[9])
#         for word in topwords4:
#             if word in i[10]:
#                 essay4.append(i[10])
#         for word in topwords5:
#             if word in i[11]:
#                 essay5.append(i[11])
#         for word in topwords6:
#             if word in i[12]:
#                 essay6.append(i[12])
#         for word in topwords7:
#             if word in i[13]:
#                 essay7.append(i[13])
#         for word in topwords8:
#             if word in i[14]:
#                 essay8.append(i[14])
#         for word in topwords9:
#             if word in i[15]:
#                 essay9.append(i[15])


#     with open("essay0.csv", "w") as c:
#         fields = ["essay0"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay0:
#             writer.writerow([value])

#     with open("essay1.csv", "w") as c:
#         fields = ["essay1"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay0:
#             writer.writerow([value])

#     with open("essay2.csv", "w") as c:
#         fields = ["essay2"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay0:
#             writer.writerow([value])

#     with open("essay3.csv", "w") as c:
#         fields = ["essay3"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay0:
#             writer.writerow([value])

#     with open("essay4.csv", "w") as c:
#     	fields = ["essay4"]
#     	writer=csv.writer(c)
#     	writer.writerow(fields)
#     	for value in essay4:
#             writer.writerow([value])

#     with open("essay5.csv", "w") as c:
#         fields = ["essay5"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay0:
#             writer.writerow([value])

#     with open("essay6.csv", "w") as c:
#         fields = ["essay6"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay6:
#             writer.writerow([value])

#     with open("essay7.csv", "w") as c:
#         fields = ["essay7"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay7:
#             writer.writerow([value])

#     with open("essay8.csv", "w") as c:
#         fields = ["essay8"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay8:
#             writer.writerow([value])

#     with open("essay9.csv", "w") as c:
#         fields = ["essay9"]
#         writer=csv.writer(c)
#         writer.writerow(fields)
#         for value in essay9:
#             writer.writerow([value])
