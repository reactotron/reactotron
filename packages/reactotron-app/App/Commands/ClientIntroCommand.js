import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'
import makeTable from '../Shared/MakeTable'

class ClientIntroCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload } = command

    return (
      <Command command={command} title='CONNECTION' color={Colors.Palette.almostBlack}>
        {makeTable(payload)}
      </Command>
    )
  }
}

export default ClientIntroCommand
