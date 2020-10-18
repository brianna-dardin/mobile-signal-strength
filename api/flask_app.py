from flask import Flask, render_template, jsonify, abort, request
from flask_cors import CORS
import numpy as np
from scipy.optimize import curve_fit

app = Flask(__name__)
app.config["DEBUG"] = True

CORS(app, origins="*", methods=["GET", "POST"], expose_headers=["Content-Type"], \
        allow_headers="*", send_wildcard=True, max_age=10000)

# Function to calculate the exponential with constants a and b
def exponential(x, a, b):
    return a * np.exp(b * np.asarray(x, dtype='float64'))

x = np.array([-130,-120,-110,-100,-90,-80,-70])
y = np.array([10,100,1000,10000,100000,1000000,10000000])

pars, cov = curve_fit(f=exponential, xdata=x, ydata=y, p0=[0, 0], bounds=(-np.inf, np.inf))
a = pars[0]
b = pars[1]

@app.route("/api/signal", methods=["POST"])
def get_signal_strength():
    if not request.json or not 'networks' in request.json:
        abort(400)

    signals_obj = request.json['networks']

    if len(signals_obj) > 0:
        for sig in signals_obj:
            try:
                sig['strength'] = int(exponential(sig['signal'], a, b))
            except:
                sig['strength'] = "Something went wrong, please try again."

        return jsonify(signals_obj)
    else:
        abort(400)