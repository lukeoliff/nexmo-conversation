const USERS = {
  exampleUser: ''
}
const CONVERSATION_ID = ''

class ChatApp {
  constructor() {
    this.loginForm = document.getElementById('login')
    this.messages = document.getElementById('messages')
    this.messageFeed = document.getElementById('messageFeed')
    this.audio = document.getElementById('audio')
    this.audioToggle = document.getElementById('audioToggle')
    this.setupUserEvents()
  }

  errorLogger(error) {
    console.log(error)
  }

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
      .catch(this.errorLogger)
  }

  setupUserEvents() {
    this.loginForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const userToken = this.authenticate(this.loginForm.children.username.value)
      if (userToken) {
        alert('logged in as:' + this.loginForm.children.username.value)
        this.loginForm.style.display = 'none'
      } else {
        alert('user not found')
      }
    })
  }

  setupConversationEvents(conversation) {
    this.conversation = conversation
    this.messages.style.display = "block"
    conversation.on("member:media", (member, event) => {
      console.log(`*** Member changed media state`, member, event)
      const text = `${member.user.name} <b>${event.body.audio ? 'enabled' : 'disabled'} audio in the conversation</b><br>`
      this.messageFeed.innerHTML = text + this.messageFeed.innerHTML
    })
  }

  authenticate(username) {
    return USERS[username] || null
  }
}
new ChatApp()