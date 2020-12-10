const createProducer = (brokerClient, brokerOptions) => {
  const defaultRecord = {
    topic: '',
    data: undefined,
    attrs: undefined,
  };
  const messagePublisher = {};

  /**
   *
   * @param {Kafka} client
   * @param {import('kafkajs').ProducerRecord} record
   */
  const publishMessageKafka = async (client, record) => {
    /**
     * @type {import('kafkajs').Producer}
     */
    const producerKafka = client.producer();
    await producerKafka.connect();
    const res = producerKafka.send(record);
    await producerKafka.disconnect();
    return res;
  };

  /**
   *
   * @param {PubSub} client
   */
  const publishMessagePubSub = (
    client,
    record = defaultRecord,
  ) => {
    /**
     * @type {import("@google-cloud/pubsub").Topic}
     */
    const topicInstance = client.topic(record.topic);
    messagePublisher[record.topic] = topicInstance;
    let dataStr = record.data;
    if (typeof dataStr === 'string') {
      dataStr = JSON.stringify(dataStr);
    }
    return topicInstance.publish(Buffer.from(dataStr, 'utf-8'), record.attrs);
  };

  /**
   *
   * @param {import('@azure/service-bus').ServiceBusClient} client
   */

  const publishMessageServiceBus = (
    client,
    record = defaultRecord,
  ) => {
    /**
     * @type {import("@azure/service-bus").ServiceBusSender}
     */
    const queueInstance = messagePublisher[record.topic] || client.createSender(record.topic);
    messagePublisher[record.topic] = queueInstance;
    return queueInstance.sendMessages({
      body: record.data,
    });
  };

  const publishMessage = (
    topic,
    message,
    args = defaultRecord,
  ) => {
    switch (brokerOptions.type) {
      case 'kafka':
        return publishMessageKafka(brokerClient, {
          topic,
          messages: [message],
          acks: args.acks,
          compression: args.compression,
        });
      case 'pubsub':
        return publishMessagePubSub(brokerClient, {
          ...args,
          message,
        });
      case 'servicebus':
        return publishMessageServiceBus(brokerClient, { message });
      default:
        if (brokerClient) {
          throw new Error('Broker client not found');
        }
        throw new Error('type invalid');
    }
  };
  return {
    publish: publishMessage,
  };
};
module.exports = {
  createProducer,
};
