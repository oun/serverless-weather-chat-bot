import axios from 'axios';

export default class Messenger {

  async sendTextMessage(recipientId, text) {
    console.log(`Sending message ${text} to ${recipientId}`);
    const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.facebook_page_access_token}`;
    const payload = {
      recipient: {
        id: recipientId
      },
      message: {
        text
      }
    };
    return await axios.post(url, payload);
  }
}