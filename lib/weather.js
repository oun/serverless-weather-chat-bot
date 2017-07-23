import axios from 'axios';
import moment from 'moment';

const apiKey = process.env.open_weather_token;

export default class Weather {
  async fetchForecastByLocationAndTime(location, datetime) {
    console.log(`Fetching forecast by location ${location} and time ${datetime}`);
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&APPID=${apiKey}`;

    const response = await axios.get(url);
    const { city, list } = response.data;
    const time = moment(datetime);
    const timestampStart = time.valueOf() / 1000;
    const timestampEnd = time.add(3, 'hours').valueOf() / 1000;

    const forecastsInDatetime = list.slice().filter(item =>
      (item.dt > timestampStart && item.dt < timestampEnd)
    );
    if (forecastsInDatetime.length > 0) {
      console.log(`Received forecast data: ${JSON.stringify(forecastsInDatetime[0])}`);
      return this.mapWeather(forecastsInDatetime[0], city);
    }
  }

  mapWeather(forecast, city) {
    const location = city.name || 'Unknown';
    const description = forecast.weather ? forecast.weather[0].description : 'Unknown';
    const temperature = forecast.main ? forecast.main.temp : 'Unknown';
    return { temperature, description, location };
  }
}