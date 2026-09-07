print("weather.py loaded")
import requests
import os

API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

def get_weather(city):
    print("get_weather() called with:", city)

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}&appid={API_KEY}&units=metric"
    )

    print("URL:", url)

    response = requests.get(url)

    print("Status Code:", response.status_code)
    print("Response:", response.text)

    data = response.json()

    if response.status_code != 200:
        return None

    return {
        "city": city,
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "wind": data["wind"]["speed"],
        "description": data["weather"][0]["description"].title(),
        "icon": data["weather"][0]["icon"]
    }