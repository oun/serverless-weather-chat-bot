import moment from 'moment-timezone';
import Weather from './weather';

const weather = new Weather();
const timezone = 'Asia/Bangkok';

const actions = {
  getWeather: async (data) => {
    const { entities, context } = data;
    console.log(`Executing getWeather... with entities: ${JSON.stringify(entities)}, context: ${JSON.stringify(context)}`);
    const missingLocation = entities.location === undefined;
    const missingDatetime = entities.datetime === undefined;
    const location = entities.location ? entities.location[0].value : null;
    const datetime = entities.datetime ? entities.datetime[0].value : null;
    if (missingLocation) {
      console.log('Missing location');
      return { ...context, missingLocation, datetime };
    }
    if (missingDatetime) {
      console.log('Missing datetime');
      return {...context, missingDatetime, location };
    }
    const weatherData = await weather.fetchForecastByLocationAndTime(location, datetime);
    console.log(`Retrieved weather data ${JSON.stringify(weatherData)}`);
    return { ...context, ...weatherData, datetime: moment(datetime).tz(timezone).calendar().toLowerCase() }
  }
};

export default actions;