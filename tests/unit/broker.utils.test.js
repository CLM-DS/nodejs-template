jest.mock('kafkajs');
jest.mock('@google-cloud/pubsub');
jest.mock('@azure/service-bus');
const kafkajs = require('kafkajs');
const pubsub = require('@google-cloud/pubsub');
const servicebus = require('@azure/service-bus');
const { createPool, createBroker } = require('../../app/utils/broker');

describe('Test Cases: Broker utils', () => {
  it('Test Case Create Broker Kafka', () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const broker = createBroker({ type: 'kafka', kafkaOption: {} });
    expect(broker.haveError()).toEqual(false);
    const brokerPubSub = createBroker({ type: 'pubsub' });
    expect(brokerPubSub.haveError()).toEqual(false);
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    expect(brokerServiceBus.haveError()).toEqual(false);
    const brokerFail = createBroker({ type: null });
    expect(brokerFail.haveError()).toBeDefined();
  });
  it('Test Case Create Broker Kafka, check', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const producerKafkaMock = jest.fn();
    producerKafkaMock.mockReturnValueOnce({
      connect: jest.fn(() => Promise.resolve()),
      disconnect: jest.fn(() => Promise.resolve()),
    });
    kafkajs.Kafka.mockImplementationOnce(() => ({
      producer: producerKafkaMock,
    }));
    const broker = createBroker({ type: 'kafka', kafkaOption: {} });
    const isCheckKafka = await broker.check();
    expect(isCheckKafka).toEqual(true);
    pubsub.PubSub.mockImplementationOnce(() => ({
      auth: {
        getAccessToken: jest.fn(() => Promise.resolve()),
      },
    }));
    const brokerPubSub = createBroker({ type: 'pubsub' });
    const isCheckPubSub = await brokerPubSub.check();
    expect(isCheckPubSub).toEqual(true);
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    const isCheckServiceBus = await brokerServiceBus.check();
    expect(isCheckServiceBus).toEqual(true);
  });
  it('Test Case Create Broker Kafka, publish', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const producerKafkaMock = jest.fn();
    producerKafkaMock.mockReturnValueOnce({
      connect: jest.fn(() => Promise.resolve()),
      send: jest.fn(() => {}),
      disconnect: jest.fn(() => Promise.resolve()),
    });
    kafkajs.Kafka.mockImplementationOnce(() => ({
      producer: producerKafkaMock,
    }));
    const broker = createBroker({ type: 'kafka', kafkaOption: {} });
    const record = await broker.producer.publish('', {});
    expect(record).not.toBeDefined();
    pubsub.PubSub.mockImplementationOnce(() => ({
      topic: jest.fn(() => ({
        publish: jest.fn(() => 'id'),
      })),
    }));
    const brokerPubSub = createBroker({ type: 'pubsub' });
    const messageId = await brokerPubSub.producer.publish('', { data: {} });
    expect(messageId).toEqual('id');
    servicebus.ServiceBusClient.mockImplementationOnce(() => ({
      createSender: jest.fn(() => ({
        sendMessages: jest.fn(() => 'id'),
      })),
    }));
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    const idQueue = await brokerServiceBus.producer.publish('', {});
    expect(idQueue).toEqual('id');
  });
});
