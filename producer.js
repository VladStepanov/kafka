import pkg from 'kafkajs'
import _ from 'lodash'
import fs from 'fs'
import util from 'util'
import uniqueNamesGeneratorPkg from 'unique-names-generator'
const { Kafka } = pkg;
const { uniqueNamesGenerator, adjectives, colors, animals } = uniqueNamesGeneratorPkg
const writeFile = util.promisify(fs.writeFile)

const chatIds = ['chat1', 'chat2', 'chat3', 'chat4', 'chat5', 'chat6', 'chat7', 'chat8']
const accountIds = Array.from({ length: 50 }, () => uniqueNamesGenerator({
  dictionaries: [adjectives, animals, colors],
  length: 2
}));

(async function () {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
  })
  
  const producer = kafka.producer()
  await producer.connect()

  const messages = Array.from({ length: 10000 }, (__, i) => ({
    key: _.sample(chatIds),
    value: `${i}__${_.sample(accountIds)}`
  }))
  
  await producer.send({
    topic: 'chat',
    messages
  })
  await writeFile('messages.json', JSON.stringify(messages, null, 2))

  await producer.disconnect()
})()
