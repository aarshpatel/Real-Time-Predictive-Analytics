import pandas as pd
import time


class ComputeProbability:
    def __init__(self, window_size):
        self.window_size = window_size
        self.history = []
        self.df = pd.read_csv("fault_errors_final.csv")
        self.dp_array = []

    def compute_error_probability(self, index, data_point):
        if len(self.history) >= self.window_size:
            self.history.pop(0)
        self.history.append(data_point[-1])

        total = 0
        for status in self.history:
            if status == 1:
                total += 1

        dp = data_point.tolist()
        dp.append(float(total) / self.window_size)
        return dp

    def main(self):
        for idx, row in self.df.iterrows():
            dp = self.compute_error_probability(idx, row)
            self.dp_array.append(dp)

        for idx, dp in enumerate(self.dp_array):
            print dp[-2], dp[-1]
            if idx == 201:
                break

if __name__ == '__main__':
    cp = ComputeProbability(7)
    cp.main()
