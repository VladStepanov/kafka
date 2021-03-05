import pkg from 'kafkajs'
const { Kafka } = pkg

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});
const admin = kafka.admin();

(async function () {
  await admin.connect()

  await admin.createTopics({
    waitForLeader: true,
    topics: [{
      topic: 'chat',
      numPartitions: 100
    }],
  })

  console.log(await admin.listTopics())
  // const topic = await admin.fetchTopicMetadata({
  //   topics: ['__consumer_offsets']
  // })
  await admin.disconnect()
})()
