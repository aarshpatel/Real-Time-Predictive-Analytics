import sys
import csv
from datetime import datetime, date
import time
import random


def generate_points(start_time, end_time):
    n = random.randint(20, 50)

    s_t = time.mktime(start_time.timetuple())
    e_t = time.mktime(end_time.timetuple())

    interval = (e_t - s_t) / n
    out = []

    for i in range(1, n + 1):
        t = float(i) / n
        prob = random.uniform(0, 1)
        thyme = s_t + interval * i

        if prob <= t:
            entry = ["occurred", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", 1]
        else:
            entry = ["occurred", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", 2]

        entry[0] = datetime.fromtimestamp(thyme).strftime('%m/%d/%Y %H:%M:%S')
        out.append(entry)
    return out


with open(sys.argv[1], 'rb') as ifile, open(sys.argv[2], 'wb') as ofile:
    reader = csv.reader(ifile)
    writer = csv.writer(ofile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL)

    metadata = next(reader)
    writer.writerow(metadata)

    first_error = next(reader)

    start_time = 0
    end_time = datetime.strptime(first_error[0], '%m/%d/%Y %H:%M:%S')
    start_time = end_time.replace(day=(end_time.day - 1))

    for line in generate_points(start_time, end_time):
        writer.writerow(line)

    writer.writerow(first_error)
    end_time = datetime.strptime(first_error[4], '%m/%d/%Y %H:%M:%S')

    for failure in reader:
        start_time = end_time
        end_time = datetime.strptime(failure[0], '%m/%d/%Y %H:%M:%S')

        for line in generate_points(start_time, end_time):
            writer.writerow(line)

        writer.writerow(failure)
        end_time = datetime.strptime(failure[4], '%m/%d/%Y %H:%M:%S')
