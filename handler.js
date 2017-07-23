import Session from './lib/session';
import Messenger from './lib/messenger';
import Wit from './lib/wit';

const session = new Session();
const messenger = new Messenger();
const wit = new Wit(messenger);

export const webhook = async (event, context, callback) => {
  try {
    if (event.method === 'GET') {
      callback(null, verifyToken(event.query['hub.challenge'], event.query['hub.verify_token']));
    } else if (event.method === 'POST') {
      callback(null, await handleEvents(event.body.entry));
    }
  } catch (error) {
    callback(error.message);
  }
};

const verifyToken = (challenge, token) => {
  if (token === process.env.facebook_verify_token) {
    return parseInt(challenge);
  } else {
    throw new Error('Invalid token');
  }
};

const handleEvents = async (events) => {
  return await events.map(event => event.messaging.map(handleEvent));
};

const handleEvent = async (event) => {
  if (event.message && event.message.text) {
    await handleMessage(event);
  }
};

const handleMessage = async (event) => {
  const userId = event.sender.id;
  if (!process.env.wit_ai_token) {
    console.log('Wit.ai token is not set!');
    await messenger.sendTextMessage(userId, 'Hello! I should converse with Wit.ai but I do not have a key!');
  } else {
    let converseSession = await session.findOrCreate(userId);
    converseSession = await wit.converse(userId, event.message.text, converseSession);
    await session.save(converseSession);
  }
}
