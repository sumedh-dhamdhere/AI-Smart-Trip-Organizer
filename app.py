from flask import Flask, render_template, request
import json
from weather import get_weather

print("Program Started")

app = Flask(__name__)

with open("data/vehicles.json","r") as file:
    vehicles = json.load(file)

with open("data/fuel_prices.json","r") as file:
    fuel_prices = json.load(file)

trip_data = {}

@app.route("/")
def home():
    return render_template(
        "home.html",
        vehicles=vehicles
        )


@app.route("/plan-trip", methods=["POST"])
def plan_trip():


    trip_data["start"] = request.form["start"]
    trip_data["destination"] = request.form["destination"]

    weather = get_weather(trip_data["destination"])
    print(weather)

    trip_data["transport"] = request.form["transport"]
    trip_data["date"] = request.form["date"]
    trip_data["time"] = request.form["time"]
    trip_data["budget"] = request.form["budget"]
    

    if trip_data["transport"] == "Car":
        trip_data["brand"] = request.form.get("car_brand")
        trip_data["model"] = request.form.get("car_model")

        trip_data["fuel"] = request.form.get("fuel")
        trip_data["fuel_price"] = fuel_prices[trip_data["fuel"]]

        trip_data["mileage"] = float(request.form.get("mileage"))
        trip_data["tank"] = float(request.form.get("tank"))

    elif trip_data["transport"] == "Bike":
        trip_data["brand"] = request.form.get("bike_brand")
        trip_data["model"] = request.form.get("bike_model")

        trip_data["fuel"] = request.form.get("fuel")
        trip_data["fuel_price"] = fuel_prices[trip_data["fuel"]]

        trip_data["mileage"] = float(request.form.get("mileage"))
        trip_data["tank"] = float(request.form.get("tank")) 

    else:
        trip_data["option"] = request.form.get("public_transport")
        trip_data["brand"] = ""
        trip_data["model"] = ""
        trip_data["fuel"] = "Public Transport"
        trip_data["fuel_price"] = 0
        trip_data["mileage"] = 1
        trip_data["tank"] = 0

    print("===== DEBUG =====")
    print(request.form)
    print("Brand:", trip_data.get("brand"))
    print("Model:", trip_data.get("model"))
    print("=================")

    context = {
        "start": trip_data["start"],
        "destination": trip_data["destination"],
        "transport": trip_data["transport"],

        "brand": trip_data["brand"],
        "model": trip_data["model"],
        
        "fuel": trip_data["fuel"],
        "fuel_price": trip_data["fuel_price"],
        "mileage": trip_data["mileage"],
        "tank": trip_data["tank"],
        "date": trip_data["date"],
        "time": trip_data["time"],
        "budget": trip_data["budget"],
        "weather": weather
    }

    return render_template("result.html", **context)

@app.route("/result")
def result():
    return "This route is not used."

if __name__ == "__main__":
    print("Starting Flask Server...")
    app.run(debug=True, use_reloader=False)