# Basic Nexmo Conversation App

Steps to get the conversation running.

```bash
npm install -g nexmo-cli@beta
```

Configure the nexmo CLI. Writes a config file to ~/.nexmorc

```bash
nexmo setup api_key api_secret
```

Run the app:create CLI command. Returns an application ID.

```bash
nexmo app:create "My Stitch App" https://example.com/answer https://example.com/event --type=rtc --keyfile=private.key
```

Add the application ID to your local environment variables.

```
APP_ID="application ID from previous command"
```

Run the conversation:create CLI command. Creates a conversation for users to join.

```bash
nexmo conversation:create display_name="Nexmo Chat"
```

Add the application ID to your local environment variables.

```
CONVERSATION_ID="conversation ID from previous command"
```

Run the user:create CLI command. Creates a user to join the conversation.

```bash
nexmo user:create name="Luke"
```

Add the returned user ID to your local environment variables.

```bash
FIRST_USER="user ID from previous command"
```

Add new user to the conversation.

```bash
nexmo member:add ${CONVERSATION_ID} action=join channel='{"type":"app"}' user_id=${FIRST_USER}
```
