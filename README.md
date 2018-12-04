# Enable an Audio Conversation in an Existing Web Application

## Prerequisites

### Node & NPM

Developed with Node 8 and NPM 6. Check if they're installed and are up to date.

```bash
node --version
npm --version
```

If node or npm are not installed, [install them](https://nodejs.org/en/download/).

### Nexmo CLI

To setup our application, we’re going to need the Nexmo CLI installed. We’ll install it using npm.

```bash
npm install -g nexmo-cli@beta
```

[Sign up for a free Nexmo account](https://dashboard.nexmo.com/) and set up the Nexmo CLI with your API key and secret which you can find on the [settings page](https://dashboard.nexmo.com/settings).

```bash
nexmo setup <your_api_key> <your_api_secret>
```

### Git _(Optional)_

We’ll use git to clone our demo application from GitHub.

**If you’re not comfortable with git commands, don’t worry, we’ll cover downloading and unzipping it instead**.

[Follow this guide to install git, if necessary](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## The Demo Application

### Basic Installation

```bash
git clone https://github.com/lukeoliff/nexmo-conversation.git
```

If you’re not comfortable with git commands or you’ve chosen not to install git, you can [download the demo application as a zip file](https://github.com/lukeoliff/nexmo-conversation/archive/master.zip) and unpack it locally.

Once cloned or unpacked, change into our new demo application directory.

```bash
cd nexmo-conversation
```

Install the npm dependencies.

```bash
npm install
```

Now, start the application.

```bash
npm start
```

The application should be running at the default address: [http://127.0.0.1:8080](http://127.0.0.1:8080).

You can log in with the default user “luke”, found in the [config.js](./config.js) file.

You’ll notice we’re just mocking authentication here.

## Super Simple Setup

This ships with a config script. Run that now to generate a new [config.js](./config.js) file with your settings.

```bash
npm run setup-script
```

[config.js](./config.js) gets updated to look more like this:

```js
const USERS = {
  luke: 'eyJhbGciOiJIkpXVCJ9.eyJpYXQiOnt9fX19.EDHi1R61yh01oeZ9DYQ',
  mary: 'eyJhbGciOi234JXVCJ9.eyJpyXQiOjt9fX19.VqLdU97Fdb2ZiOfqmoQ',
}

const CONVERSATION_ID = 'CON-da9c1a6b-c2dc-4bdd-ac03-cc041ef03502'
```

### What Did That Script Do?!?

So, behind the scenes, the script carries out the following steps.

- Create a Nexmo application using the nexmo app:create command.
- Create a Nexmo conversation using the nexmo conversation:create command.
- Create both users using the nexmo user:create command.
- Add both users to the Nexmo conversation with nexmo member:add.
- Generate JWTs for both users to access the application.
- Writes out the config to config.js.

## I Don't Want To Run Your Script! (Running The Steps Manually)



## Enable Audio

So, we’ve configured the demo application. Now, we need to add the code to enable audio!

First, install the nexmo-stitch package.

npm install nexmo-stitch

Next, edit index.html as shown below. We’re adding the script tag to include the Nexmo Stitch conversation client in our application.

 // index.html
 // ...
 <head>
   // ...
   <link rel="stylesheet" href="talk.css">
+  <script src="./node_modules/nexmo-stitch/dist/conversationClient.js"></script>
 </head>

 <body>
 // ...

Editing the same file, add the code which will act as a container for alerts and messages from the Nexmo system—like when someone else enables audio. 

This code also provides your toggle button, to enable and disable audio.

 // index.html
 // ...
     </form>

+    <section id="messages">
+      <div>
+        <audio id="audio">
+          <source>
+        </audio>
+        <div class="btn-group" data-toggle="buttons">
+          <label class="btn btn-secondary">
+            <input type="checkbox" autocomplete="off" id="audioToggle"> <span id="audioToggleText">Enable Audio</span>
+          </label>
+        </div>
+      </div>
+      <h1>Messages</h1>
+      <div id="messageFeed"></div>
+    </section>

   </div> <!-- /container -->
 // ...

Now, our markup is ready. We can edit the script to allow us to communicate with the Nexmo service and enable audio.

Edit the talk.js file as shown. First, we’ll fetch some of the elements with our JavaScript class.

 // talk.js
 class ChatApp {
   constructor() {
     this.loginForm = document.getElementById('login')
+    this.messages = document.getElementById('messages')
+    this.messageFeed = document.getElementById('messageFeed')
+    this.audio = document.getElementById('audio')
+    this.audioToggle = document.getElementById('audioToggle')
+    this.audioToggleText = document.getElementById('audioToggleText')
     this.setupUserEvents()
   }
   // ...
 }
 // ...

We’re going to be modifying or registering events on those elements, so fetching them in our class makes them easier to access.

Next, we’ll update our login event.

Add a new function joinConversation() that, for now, is just going to initialise the Nexmo Stitch conversation client, identify our user with their token and get our conversation by CONVERSATION_ID. The user’s token and CONVERSATION_ID come from the config we generated earlier.

 // talk.js
 class ChatApp {
   // ...

+  joinConversation(userToken) {
+    new ConversationClient({ debug: false })
+      .login(userToken)
+      .then(app => {
+        console.log('*** Logged into app', app)
+        return app.getConversation(CONVERSATION_ID)
+      })
+  }

   setupUserEvents() {
     this.loginForm.addEventListener('submit', (event) => {
       // ...
       if (userToken) {
-        alert('logged in as:' + this.loginForm.children.username.value)
+        this.joinConversation(userToken)
         this.loginForm.style.display = 'none'
       } else {
         alert('user not found')
       }
     })
   }

   // ...
 }
 new ChatApp()

Adding to the joinConversation() function, next we’ll register the event listener to listen for when someone enables or disables audio.

 // talk.js
 class ChatApp {
   // ...

   joinConversation(userToken) {
     new ConversationClient({ debug: false })
       .login(userToken)
       .then(app => {
         console.log('*** Logged into app', app)
         return app.getConversation(CONVERSATION_ID)
       })
+      .then((conversation) => {
+        console.log('*** Joined conversation', conversation)
+        this.setupConversationEvents(conversation)
+      })
   }

+  setupConversationEvents(conversation) {
+    this.conversation = conversation
+    this.messages.style.display = "block"
+    conversation.on("member:media", (member, event) => {
+      console.log(`*** Member changed media state`, member, event)
+      const text = `${member.user.name} <b>${event.body.audio ? 'enabled' : 'disabled'} audio in the conversation</b><br>`
+      this.messageFeed.innerHTML = text + this.messageFeed.innerHTML
+    })
+  }

   // ...
 }
 new ChatApp()

The setupConversationEvents() functions purpose is to register JavaScript events on the conversation object we’ve got from the Nexmo Stitch conversation client. We can listen and utilise many events by name, but for our purposes, we’re just listening for member:media. This is the event that is sent when the media state changes for a user.

Lastly, for our joinConversation() function, we’ll need some error logging.

 // talk.js
 class ChatApp {
   // ...

+  errorLogger(error) {
+    console.log(error)
+  }

   joinConversation(userToken) {
     new ConversationClient({ debug: false })
       .login(userToken)
       .then(app => {
         console.log('*** Logged into app', app)
         return app.getConversation(CONVERSATION_ID)
       })
       .then((conversation) => {
         console.log('*** Joined conversation', conversation)
         this.setupConversationEvents(conversation)
       })
+      .catch(this.errorLogger)
   }

   // ...
 }
 new ChatApp()

We should always abstract our methods of carrying out a generic function, like error logging. So, in the future, you only have one function to edit if you want to log errors to something like a monitoring tool.

Now, add a new event to our setupUserEvents() function. This event will be registered to our enable audio button, listening for a click event. This allows us to toggle enabling and disabling audio. It does some fancy bits too, like modifying context from enabling to disabling, etc.

 // talk.js
 class ChatApp {
   // ...

+  eventLogger(event) {
+    return () => {
+      console.log("'%s' event was sent", event)
+    }
+  }


   // ...

   setupUserEvents() {
     // ...

+    this.audioToggle.addEventListener('click', () => {
+      const buttonContainer = this.audioToggle.parentNode
+      if (this.audioToggle.checked) {
+        this.audioToggleText.innerHTML = 'Disable Audio'
+        buttonContainer.classList.add('btn-danger')
+        buttonContainer.classList.add('active')
+        buttonContainer.classList.remove('btn-secondary')
+        this.conversation.media.enable().then(stream => {
+          // Older browsers may not have srcObject
+          if ("srcObject" in this.audio) {
+            this.audio.srcObject = stream
+          } else {
+            // Avoid using this in new browsers, as it is going away.
+            this.audio.src = window.URL.createObjectURL(stream)
+          }
+
+          this.audio.onloadedmetadata = () => {
+            this.audio.play()
+          }
+
+          this.eventLogger('member:media')()
+        }).catch(this.errorLogger)
+      } else {
+        this.audioToggleText.innerHTML = 'Enable Audio'
+        buttonContainer.classList.remove('btn-danger')
+        buttonContainer.classList.remove('active')
+        buttonContainer.classList.add('btn-secondary')
+        this.conversation.media.disable().then(this.eventLogger('member:media')).catch(this.errorLogger)
+      }
+    })
+  }


   // ...
 }
 new ChatApp()

With our changes made, start the demo application again. (If it’s still running from last time, press CTRL+C to stop it).

npm start

Once again, open your favourite browser and view the application: http://127.0.0.1:8080.

So far, it’s not changed much. Let’s log in as your first user and see what happens.

Now we’re logged in, we can see Messages and our button to Enable Audio. Go ahead and click on Enable Audio.

Allow the application to use your microphone.

Log in as your second user and enable audio with them too.

With both instances of the application having enabled audio, you can hold a conversation between the two browser windows. At this point, if you’re in a coffee shop and you’re testing it in two browser windows like I was, be prepared for frowns from your co-coffee-drinkers when you generate some loud feedback.

Now you can click on Disable Audio to turn your microphone back off. Other users will be alerted that you have.

Some bits are missing. One is that when a new user joins, they can’t see the history or who has their audio already enabled. The conversation object does contain a history of events, which can be utilised to show this. Another might be that you want to use the conversation object to see the users that have joined but not left the conversation, so you know they're online.

If you’d like to manually run the steps to generate the config file, the README of the demo application has those steps covered. Thanks for following along.
Conclusion
Nexmo’s Stitch makes it SUPER easy to enable audio conversations on in your application. Hopefully, I’ve demonstrated that in an easy to follow way.

Often, messages can be done on the fly. Audio conversations are a lot more deliberate and personal. Enable your users to enhance their conversations with in-app audio communication without having a negative impact on your user’s experience.

Once again, the demo application and finished application can be found on GitHub now. The instructions to get each up and running is part of the README.
More Resources
This guide was developed using Nexmo Stitch. Read more about it here. 

You can also find a Node.JS and Angular demo and an Android client demo, as well as JS, Android and iOS quickstarts.




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