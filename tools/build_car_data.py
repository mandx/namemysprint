from os.path import dirname, join as path_join
import json
from csv import DictReader
from collections import defaultdict


def process_csv(in_filename, out_filename):
    data = defaultdict(lambda: defaultdict(set))
    with open(in_filename, 'r') as csvfile:
        csv_reader = DictReader(csvfile, fieldnames=None)
        for row in csv_reader:
            make = row['make'].strip()
            model = row['model'].strip()
            year = row['year'].strip()
            if make and model and year:
                data[make][model].add(year)

    for make, models in data.items():
        for model, years in models.items():
            data[make][model] = tuple(sorted(data[make][model]))

    with open(out_filename, 'w') as jsonfile:
        json.dump(data, jsonfile)


if __name__ == '__main__':
    process_csv('./vehicles.csv', './models.json')
