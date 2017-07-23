import AWS from 'aws-sdk';

export default class Session {
  constructor() {
    const region = 'ap-northeast-1';
    this.tableName = 'sessions';
    this.dynamoDB = new AWS.DynamoDB.DocumentClient();

    if (typeof AWS.config.region !== 'string') {
      console.warn(`No region found, defaulting to ${region}`);
      AWS.config.update({ region });
    }
  }

  async findById(id) {
    console.log(`Find session by id ${id}`);
    const params = {
      TableName: this.tableName,
      Key: {
        id: id.toString()
      }
    };

    const data = await this.dynamoDB.get(params).promise();
    return data.Item;
  }

  async findOrCreate(id) {
    console.log(`Find or create session by id ${id}`);
    let session = await this.findById(id.toString());
    if (!session) {
      console.log('Session not found. Creating new session');
      return { id, context: {}, ...session };
    }
    console.log(`Found session: ${JSON.stringify(session)}`);
    return session;
  }

  async save(session) {
    const now = Date.now();
    if (!session.createdAt) {
      session.createdAt = now;
    }
    session.updatedAt = now;
    console.log(`Save session ${JSON.stringify(session)}`);
    const params = {
      TableName: this.tableName,
      Item: session
    };

    await this.dynamoDB.put(params).promise();
    return session;
  }
}
