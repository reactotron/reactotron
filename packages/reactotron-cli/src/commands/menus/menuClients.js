import R from 'ramda'

const formatClient = (client = {}, prefix = '-') => {
  return `${prefix} {green-fg}[${client.address}]{/} <${client.userAgent}> <${client.version}>`
}

const formatClients = (clients = {}, prefix = '-') => {
  return R.pipe(
    R.values,
    R.map((c) => formatClient(c, prefix)),
    R.join('\n')
  )(clients)
}

const COMMAND = 'menu.clients'

const process = (context, action) => {
  const clients = formatClients(context.server.connections.slice(), '   ')

  const messageText = `
    {bold}Clients{/bold}
    ---------------------------------
${clients}
`

  context.info(' {yellow-fg}reactotron{/} {blue-fg}clients{/} ', messageText)
}

export default {
  name: COMMAND,
  process
}
