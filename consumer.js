import pkg from 'kafkajs';
import fs from 'fs';
const { Kafka } = pkg;
import util from 'util';
import os from 'os';
const writeFile = util.promisify(fs.writeFile);

(async function () {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
  })

  const consumer = kafka.consumer({ groupId: 'consumer-group' })

  const got = []

  await consumer.connect()
  await consumer.subscribe({ topic: 'chat', fromBeginning: true })
  await consumer.run({
    partitionsConsumedConcurrently: os.cpus().length,
    async eachMessage ({ topic, partition, message }) {
      await new Promise(resolve => {
        setTimeout(resolve, Math.random() * 50);
      })

      const msg = {
        key: message.key.toString(),
        value: message.value.toString(),
      }
      console.log(msg)
      got.push(msg)
      await writeFile('got.json', JSON.stringify(got, null, 2))
    }
  })

})()
