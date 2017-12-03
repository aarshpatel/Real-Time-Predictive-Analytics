# Predictive Analysis on Real-Time Machine Performance Data

Our app is a platform for predictive analysis on real-time machine performance data from Black & Decker. Hence, its primary purpose is to anticipate whether a machine would fail based on the given data. A secondary objective was to build an IoT dashboard to visualize results of exploratory data analysis (e.g. summary statistics).

```
pip install virtualenv
virtualenv venv; source venv/bin/activate
pip install -r requirements.txt
npm install -g webpack; npm install
```

Then in two separate tabs run `python app.py` and `webpack --watch`. 

These steps are explained in more detail below.

## Prerequisites

You'll need some package managers.

- `npm`
- `pip`

## Setup

For the backend:

```
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

For the frontend:

If you don't have webpack, install it:

```
npm install -g webpack
```

Then, use `npm` to install the remaining JavaScript dependencies.

```
npm install
```

## Running the app

If you're using a virtualenv, activate it.

```
source venv/bin/activate
```

Then run the Flask app:

```
python app.py
```

To generate a stream of IoT data

```
python data/generate_stream.py
```

## How we built it
In order to perform predictive analysis, we implemented an anomaly detection algorithm that takes the temporal nature of the data into consideration. We implemented the system on top of the Flask framework, with a React front-end. In addition, we used Firebase as a central data repository and hosted the app on Google's App Engine. We also used the Twilio API in order to implement text-message alerts.

## Challenges we ran into
The dataset we were given to work with was very small and not representative of the entire problem domain. Hence, we had to design a custom algorithm in order to generate sufficient data. Also, none of us had experience working with time series models or anomaly detection, so we had to learn a lot along the way.

## What we learned
We learned a lot about the IoT framework and predictive analysis on streaming data (e.g. online learning, time series, etc.). In addition, we learned about the importance of clean data for both visualization and predictive analysis. Last but not least, we learned that teamwork and collaboration are major keys to tackling challenging and unfamiliar problems.

## Collaborators
- Aarsh Patel 
- Lynn Samson
- Varun Sharma
- Chenhao Huang 

## Screenshots

![screenshot1.png]

![screenshot2.png]
