# Basic Nexmo Conversation App

## Create Application

Run the `app:create` CLI command. Returns an application ID.

```bash
nexmo app:create "Nexmo Demo Application" https://example.com/answer https://example.com/event --type=rtc --keyfile=private.key
```

Add the application ID to your local environment variables.

```bash
APPLICATION_ID="application ID from previous command"
```

## Create Conversation

Run the conversation:create CLI command. Creates a conversation for users to join.

```bash
nexmo conversation:create display_name="Nexmo Demo Conversation"
```
Add the application ID to your local environment variables.

```bash
CONVERSATION_ID="conversation ID from previous command"
```

## Create First User
Run the user:create CLI command. Creates a user to join the conversation.

```bash
nexmo user:create name="jamie"
```

Add the returned user ID to your local environment variables.

```bash
FIRST_USER="user ID from previous command"
```

## Join Conversation

Add new user to the conversation.

```bash
nexmo member:add ${CONVERSATION_ID} action=join channel='{"type":"app"}' user_id=${FIRST_USER}
```