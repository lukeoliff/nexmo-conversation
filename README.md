# Basic Nexmo Conversation App

Steps to get the conversation running.

## Install CLI

Install the Nexmo CLI.

```bash
npm install -g nexmo-cli@beta
```

## Configure CLI

Configure the CLI. Writes a config file to ~/.nexmorc

```bash
nexmo setup api_key api_secret
```

## Create Application

Run the app:create CLI command. Returns an application ID.

```bash
nexmo app:create "My Stitch App" https://example.com/answer https://example.com/event --type=rtc --keyfile=private.key
```

Add the application ID to your local environment variables.

```
APP_ID="application ID from previous command"
```

## Create Conversation

Run the conversation:create CLI command. Creates a conversation for users to join.

```bash
nexmo conversation:create display_name="Nexmo Chat"
```

Add the application ID to your local environment variables.

```
CONVERSATION_ID="conversation ID from previous command"
```

## Create first user

Run the user:create CLI command. Creates a user to join the conversation.

```bash
nexmo user:create name="Luke"
```

Add the returned user ID to your local environment variables.

```bash
FIRST_USER="user ID from previous command"
```

## Join conversation 

Add new user to the conversation.

```bash
nexmo member:add ${CONVERSATION_ID} action=join channel='{"type":"app"}' user_id=${FIRST_USER}
```

## Create second user

Run the user:create CLI command again. Creates another user to join the conversation.

```bash
nexmo user:create name="Luke2"
```

Add the returned user ID to your local environment variables.

```bash
SECOND_USER="user ID from previous command"
```

## Invite second user to conversation

Invite the second user to the conversation.

```bash
nexmo member:add ${CONVERSATION_ID} action=invite channel='{"type":"app"}' user_id=${SECOND_USER}
```