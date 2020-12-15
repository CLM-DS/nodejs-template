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
const createBroker = (brokerOptions) => {
  /**
   * @type {(ServiceBusClient|Kafka|PubSub)}
   */
  let brokerClient;

  /**
   * create client kafak
   * @param {KafkaOption} options
   */
  const createKafka = (options) => new Kafka(options);

  const createPubSub = () => new PubSub();

  const createServiceBus = (strConn) => new ServiceBusClient(strConn);

  /**
   * create publisher instance to create message
   * @param {BrokerPublisherOption} options
   * @returns {(import('kafkajs').Producer)}
   */
  const initBroker = () => {
    switch (brokerOptions.type) {
      case 'kafka':
        brokerClient = createKafka(brokerOptions.kafkaOption);
        break;
      case 'servicebus':
        brokerClient = createServiceBus(brokerOptions.serviceBusStrCnn);
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
  let err = false;
  const setError = (error) => {
    err = error;
  };
  const haveError = () => err;
  return {
    check,
    producer: brokerProducer,
    consumer: brokerConsumer,
    setError,
    haveError,
  };
};

/**
 * @typedef {Object} Broker
 * @property {*} check
 * @property {import('./producer').Producer} producer
 * @property {import('./consumer').Consumer} consumer
 * @property {*} setError
 * @property {*} haveError
 */

/**
 * @callback GetBroker
 * @param {String} alias
 * @returns {Broker}
 */

/**
 * @typedef {Object} PoolBroker
 * @property {} addBroker
 * @property {GetBroker} getBroker
 * @property {*} map
 */

/**
 * @returns {PoolBroker}
 */
const createPool = () => {
  const pool = {};
  const aliases = [];
  const addBroker = (alias, broker) => {
    pool[alias] = broker;
    aliases.push(alias);
  };/**
   * get broker instance by alias
   * @param {String} alias
   * @returns {Broker}
   */
  const getBroker = (alias) => {
    const broker = pool[alias];
    if (!broker) {
      throw new Error('broker not found');
    }
    return broker;
  };
  const map = (func) => aliases.map((alias) => func(pool[alias]));

  let err = false;
  const setError = (error) => {
    err = error;
  };
  const haveError = () => err;
  return {
    addBroker,
    getBroker,
    map,
    setError,
    haveError,
  };
};

module.exports = {
  createBroker,
  createPool,
};
