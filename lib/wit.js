import { Wit as NodeWit, log } from 'node-wit';
import witActions from './witActions';

export default class Wit {
  constructor(messenger) {
    this.messenger = messenger;
  }

  async converse(userId, text, session) {
    const actions = {
      send: async (request, response) => {
        console.log(`Wit.ai sending message: ${JSON.stringify(response)}`);
        await this.messenger.sendTextMessage(userId, response.text);
        return null;
      },
      debugContext: async (data) => {
        const context = data.context;
        console.log(`Wit.ai debug context: ${JSON.stringify(data, null, 2)}`);
        return context;
      },
      ...witActions
    };

    const wit = new NodeWit({
      accessToken: process.env.wit_ai_token,
      actions,
      logger: new log.Logger(log.INFO)
    });

    const sessionId = session.id;
    console.log(`Converse with Wit.ai with sessionId: ${sessionId}, text: ${text}, context: ${JSON.stringify(session.context)}`);
    try {
      session.context = await wit.runActions(
        sessionId,
        text,
        session.context
      );
    } catch (error) {
      console.log('Wit.ai throw error: ', error);
    }
    return session;
  }
};
