import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'

const Styles = {
  name: {
    margin: 0,
    padding: 0
  }
}

class StateActionComplete extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { ms, action, name } = payload

    return (
      <Command command={command} title='ACTION' duration={ms}>
        <div style={Styles.container}>
          <span style={Styles.name}>{name}</span>
          <ObjectTree object={{action}} />
        </div>
      </Command>
    )
  }
}

export default StateActionComplete
