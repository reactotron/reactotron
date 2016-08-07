import R from 'ramda'
import socketIO from 'socket.io'
import Commands from './commands'
import validate from './validation'

const DEFAULTS = {
  port: 9090, // the port to live (required)
  onCommand: command => null, // handles inbound commands
  onStart: () => null, // handles inbound commands
  onStop: () => null, // handles inbound commands
  onConnect: socket => null, // notify connections
  onDisconnect: socket => null // notify disconnections
}

export class Server {

  // the configuration options
  options = R.merge({}, DEFAULTS)
  started = false
  io = null
  openSockets = []
  messageId = 0
  commands = new Commands()

  /**
   * Set the configuration options.
   */
  configure (options = {}) {
    // options get merged & validated before getting set
    const newOptions = R.merge(this.options, options)
    validate(newOptions)
    this.options = newOptions
    return this
  }

  /**
   * Configures the socket.io server with our behaviours.
   */
  registerCallbacks () {
    const { onCommand, onConnect, onDisconnect } = this.options

    // when we get new clients
    this.io.on('connection', socket => {
      // remember them
      this.openSockets.push(socket)

      // details about who has connected
      const clientDetails = {
        id: socket.id,
        address: socket.request.connection.remoteAddress
      }

      // trigger event
      onConnect && onConnect(clientDetails)

      // when this client disconnects
      socket.on('disconnect', () => {
        // remove them from the list
        this.openSockets = R.without([socket], this.openSockets)

        // trigger event
        onDisconnect && onDisconnect(clientDetails)
      })

      // when we receive a command from the client
      socket.on('command', ({ type, payload }) => {
        this.messageId++
        const date = new Date()
        const fullCommand = { type, payload, messageId: this.messageId, date }
        onCommand(fullCommand)
        this.commands.addCommand(fullCommand)
      })
    })
  }

  /**
   * Starts the server.
   */
  start () {
    this.started = true
    const { port, onStart } = this.options

    // start listening
    this.io = socketIO(port)

    // configure socket.io to do its thing
    this.registerCallbacks()

    // trigger the start message
    onStart && onStart()

    return this
  }

  /**
   * Stops the server.
   */
  stop () {
    const { onStop } = this.options
    this.started = false
    R.forEach(s => s.connected && s.disconnect(), this.openSockets)
    this.io.close()

    // trigger the stop message
    onStop && onStop()

    return this
  }

  /**
   * Sends a command to the client
   */
  send (type, payload) {
    this.io.sockets.emit('command', { type, payload })
  }

}

// convenience factory function
export const createServer = (options) => {
  const server = new Server()
  server.configure(options)
  return server
}
