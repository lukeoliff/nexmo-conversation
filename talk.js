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

  authenticate(username) {
    return USERS[username] || null
  }
}
new ChatApp()