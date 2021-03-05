## Startup
```bash
# Run kafka
cd kafka
docker-compose up

# Create "chat" topic
node admin.js

# Run consumer listener
node consumer.js

# Produce dummy data
node producer.js

# ... Wait for consuming end

# Make sure that chat queue does not corrupt
node checkQueue.js
```
