class ChatApp {
  constructor() {
    this.loginForm = document.getElementById('login')
    this.messages = document.getElementById('messages')
    this.messageFeed = document.getElementById('messageFeed')
    this.audio = document.getElementById('audio')
    this.audioToggle = document.getElementById('audioToggle')
    this.audioToggleText = document.getElementById('audioToggleText')
    this.setupUserEvents()
  }

  errorLogger(error) {
    console.log(error)
  }

  eventLogger(event) {
    return () => {
      console.log("'%s' event was sent", event)
    }
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
      this.loginForm.children.username.value = ''
      if (userToken) {
        this.joinConversation(userToken)
        this.loginForm.style.display = 'none'
      } else {
        alert('user not found')
      }
    })

    this.audioToggle.addEventListener('click', () => {
      const buttonContainer = this.audioToggle.parentNode
      if (this.audioToggle.checked) {
        this.audioToggleText.innerHTML = 'Disable Audio'
        buttonContainer.classList.add('btn-danger')
        buttonContainer.classList.add('active')
        buttonContainer.classList.remove('btn-secondary')
        this.conversation.media.enable().then(stream => {
          // Older browsers may not have srcObject
          if ("srcObject" in this.audio) {
            this.audio.srcObject = stream
          } else {
            // Avoid using this in new browsers, as it is going away.
            this.audio.src = window.URL.createObjectURL(stream)
          }

          this.audio.onloadedmetadata = () => {
            this.audio.play()
          }

          this.eventLogger('member:media')()
        }).catch(this.errorLogger)
      } else {
        this.audioToggleText.innerHTML = 'Enable Audio'
        buttonContainer.classList.remove('btn-danger')
        buttonContainer.classList.remove('active')
        buttonContainer.classList.add('btn-secondary')
        this.conversation.media.disable().then(this.eventLogger('member:media')).catch(this.errorLogger)
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