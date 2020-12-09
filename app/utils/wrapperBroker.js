const { Kafka, logLevel } = require('kafkajs');
const { PubSub } = require('@google-cloud/pubsub');
const { ServiceBusClient } = require('@azure/service-bus');

/**
 * @typedef {Object} KafkaOption
 * @property {import('kafkajs').KafkaConfig} config
 * @property {string} groupId
 */

/**
 * @typedef {Object} BrokerPublisherOption
 * @property {('kafka'|'pubsub'|'servicebus')} type
 * @property {KafkaOption} [kafkaOption]
 * @property {String} [serviceBusStrCnn]
 */

/**
 * @type {BrokerPublisherOption}
 */
let brokerOptions;

/**
 * @type {(ServiceBusClient|Kafka|PubSub)}
 */
let brokerClient;

/**
 * create client kafak
 * @param {KafkaOption} options
 */
const createKafka = (options) => {
  const kafka = new Kafka({ ...options.config, logLevel: logLevel.ERROR });
  return kafka;
};

const createPubSub = () => new PubSub();

const createServiceBus = (strConn) => new ServiceBusClient(strConn);

/**
 * create publisher instance to create message
 * @param {BrokerPublisherOption} options
 * @returns {(import('kafkajs').Producer)}
 */
const initBroker = (options) => {
  let instance = {};
  switch (options.type) {
    case 'kafka':
      instance = createKafka(options.kafkaOption);
      break;
    case 'servicebus':
      instance = createServiceBus(options.serviceBusStrCnn);
      break;
    case 'pubsub':
      instance = createPubSub();
      break;
    default:
      instance = null;
      break;
  }
  brokerOptions = options;
  brokerClient = instance;
  return instance;
};

/**
 * @callback messageReceived
 * @param {*} message
 */

/**
 * @callback messageError
 * @param {*} message
 */

/**
 * @typedef {Object} ListenerOption
 * @property {messageReceived} onMessage
 * @property {messageError} onError
 * @property {String} [topic]
 * @property {String} [subscription] - suscription name to servicebus and pubsub
 */

let brokerReceiver;

const messageProcessor = {};

/**
 *
 * @param {Kafka} client
 * @param {BrokerOptionSubscriber} options
 */
const createReceiverKafka = async (client, options) => {
  /**
   * @type {import('kafkajs').Consumer}
   */
  const consumer = brokerReceiver || client.consumer({
    groupId: brokerOptions.kafkaOption.groupId,
  });
  if (!brokerReceiver) {
    await consumer.connect();
  }
  await consumer.subscribe({
    topic: options.topic,
  });
  messageProcessor[options.topic] = options;
  if (!brokerReceiver) {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        client.logger().debug('Message received', {
          topic,
          partition,
          offset: message.offset,
          timestamp: message.timestamp,
          headers: Object.keys(message.headers || {}).reduce(
            (headers, key) => ({
              ...headers,
              [key]: message.headers[key].toString(),
            }),
            {},
          ),
          key: message.key.toString(),
          value: message.value.toString(),
        });
        try {
          messageProcessor[topic].onMessage(message);
        } catch (err) {
          messageProcessor[topic].onError(message);
        }
      },
    });
  }
  brokerReceiver = consumer;
};

/**
 *
 * @param {PubSub} client
 * @param {ListenerOption} options
 */
const createReceiverPubSub = (client, options) => {
  const subscription = client.subscription(options.subscription);
  subscription.addListener('message', options.onMessage);
  subscription.addListener('error', options.onError);
  messageProcessor[options.subscription] = subscription;
};

/**
 *
 * @param {ServiceBusClient} client
 * @param {ListenerOption} options
 */
const createReceiverServiceBus = async (client, options) => {
  const receiver = client.createReceiver(options.subscription);
  receiver.subscribe({
    processMessage: options.onMessage,
    processError: options.onError,
  });
  messageProcessor[options.subscription] = receiver;
};

/**
 * create subscriber instance to create message
 * @param {BrokerOptionSubscriber} options
 */
const addListenerMessage = async (options) => {
  switch (brokerOptions.type) {
    case 'kafka':
      await createReceiverKafka(brokerClient, options);
      break;
    case 'pubsub':
      createReceiverPubSub(brokerClient, options);
      break;
    case 'servicebus':
      await createReceiverServiceBus(brokerClient, options);
      break;
    default:
      if (brokerClient) {
        throw new Error('Broker client not found');
      }
      break;
  }
};

let brokerPublisher;

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
  const producer = brokerPublisher || client.producer();
  if (brokerPublisher) {
    await producer.connect();
  }
  brokerPublisher = producer;
  return producer.send(record);
};

/**
 *
 * @param {PubSub} client
 */
const publishMessagePubSub = (
  client,
  record = {
    topic: '',
    data: undefined,
    attrs: undefined,
  },
) => {
  /**
   * @type {import("@google-cloud/pubsub").Topic}
   */
  const topicInstance = messagePublisher[record.topic] || client.topic(record.topic);
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
  record = {
    data: undefined,
  },
) => {
  /**
   * @type {import("@azure/service-bus").ServiceBusSender}
   */
  const queueInstance = messagePublisher[record.topic] || client.createSender(record.topic);
  queueInstance.sendMessages({
    body: record.data,
  });
};

const publishMessage = (
  topic,
  message,
  args = {
    acks: undefined,
    compression: undefined,
    atrs: undefined,
  },
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

module.exports = {
  initBroker,
  addListenerMessage,
  publishMessage,
};
