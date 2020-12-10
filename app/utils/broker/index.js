const { Kafka } = require('kafkajs');
const { PubSub } = require('@google-cloud/pubsub');
const { ServiceBusClient } = require('@azure/service-bus');
const { createProducer } = require('./producer');
const { createConsumer } = require('./consumer');

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
 * @param {BrokerPublisherOption} brokerOptions
 */
const createBroker = () => (brokerOptions) => {
  /**
   * @type {(ServiceBusClient|Kafka|PubSub)}
   */
  let brokerClient;

  /**
   * create client kafak
   * @param {KafkaOption} options
   */
  const createKafka = (options) => new Kafka(options.config);

  const createPubSub = () => new PubSub();

  const createServiceBus = (strConn) => new ServiceBusClient(strConn);

  /**
   * create publisher instance to create message
   * @param {BrokerPublisherOption} options
   * @returns {(import('kafkajs').Producer)}
   */
  const initBroker = (options) => {
    switch (options.type) {
      case 'kafka':
        brokerClient = createKafka(options.kafkaOption);
        break;
      case 'servicebus':
        brokerClient = createServiceBus(options.serviceBusStrCnn);
        break;
      case 'pubsub':
        brokerClient = createPubSub();
        break;
      default:
        brokerClient = null;
        break;
    }
  };

  initBroker();
  const brokerProducer = createProducer(brokerClient, brokerOptions);
  const brokerConsumer = createConsumer(brokerClient, brokerOptions);
  const check = async () => {
    switch (brokerOptions.type) {
      case 'kafka':
        await brokerClient.producer().connect();
        await brokerClient.producer().disconnect();
        break;
      case 'pubsub':
        await brokerClient.auth.getAccessToken();
        break;
      case 'servicebus':
        break;
      default:
        if (brokerClient) {
          throw new Error('Broker client not found');
        }
        throw new Error('type invalid');
    }
  };
  return {
    check,
    producer: brokerProducer,
    consumer: brokerConsumer,
  };
};

const createPool = () => {
  const pool = {};
  const aliases = [];
  const addBroker = (alias, broker) => {
    pool[alias] = broker;
    aliases.push(alias);
  };
  const getBroker = (alias) => {
    const broker = pool[alias];
    if (!broker) {
      throw new Error('broker not found');
    }
    return broker;
  };
  const map = (func) => aliases.map((alias) => func(pool[alias]));

  return {
    addBroker,
    getBroker,
    map,
  };
};

module.exports = {
  createBroker,
  createPool,
};
