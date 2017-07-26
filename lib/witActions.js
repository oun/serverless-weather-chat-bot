import moment from 'moment-timezone';
import Weather from './weather';

const weather = new Weather();
const timezone = 'Asia/Bangkok';

const actions = {
  getWeather: async (data) => {
    const { entities, context } = data;
    console.log(`Executing getWeather... with entities: ${JSON.stringify(entities)}, context: ${JSON.stringify(context)}`);
    const location = entities.location ? entities.location[0].value : context.location;
    const datetime = entities.datetime ? entities.datetime[0].value : context.datetime;
    if (location === undefined || location === null) {
      console.log('Missing location');
      return { ...context, missingLocation: true, datetime };
    }
    let weatherData = null;
    if (datetime) {
      weatherData = await weather.fetchForecastByLocationAndTime(location, datetime);
    } else {
      weatherData = await weather.fetchCurrentWeatherByLocation(location);
    }
    console.log(`Retrieved weather data ${JSON.stringify(weatherData)}`);
    let { missingLocation, ...other } = context;
    return { done: true, ...other, ...weatherData, calendar: moment(datetime).tz(timezone).calendar().toLowerCase() }
  }
};

export default actions;