import fs from 'fs'

const initMessages = JSON.parse(fs.readFileSync('messages.json', 'utf-8'))
const gotMessages = JSON.parse(fs.readFileSync('got.json', 'utf-8'))

function groupByChatId (messages) {
  const map = new Map()
  for (const msg of messages) {
    const chatId = msg.key
    const accountId = msg.value
  
    if (map.get(chatId)) {
      map.set(chatId, [...map.get(chatId), accountId])
    } else {
      map.set(chatId, [accountId])
    }
  }
  return map
}

const grouped = groupByChatId(initMessages)

main: for (const entry of grouped.entries()) {
  const chatId = entry[0]
  let lastIdx = 0

  for (const msg of entry[1]) {
    const curIdx = gotMessages.findIndex(m => m.value === msg)

    if (curIdx >= lastIdx) {
      lastIdx = curIdx
    } else {
      console.log(`queue corrupted for chatId ${chatId}`, msg, { curIdx, lastIdx })
      break main
    }
  }
  console.log('success for chat', chatId)
}
