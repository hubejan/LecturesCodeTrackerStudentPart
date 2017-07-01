import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/solarized_dark';
import io from 'socket.io-client';
import Sidebar from './Sidebar';
import TicketSubmitContainer from '../containers/TicketSubmitContainer';

export default class CodeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ''
    };
    //Brian's IP from 11th floor 172.16.21.52:3030
    //                25th floor 172.16.25.125:3030
  }

  componentDidMount() {
    // Q from PK: should we just lift this up to the parent component?
    // we could make this component dumber by passing socket/data from above?
    this.props.socket.on('editorChanges', data => {
      this.setState({ data } );
    });
  }

  componentWillUnmount() {
    // socket.io docs are terrible
    // this removes all callbacks built via socket.on('editorChanges', cb)
    this.props.socket.removeAllListeners('editorChanges');
  }

  render() {
    const snapshots = {
      list: [{id: 1, name: 'Snapshot 1'}, {id: 2, name: 'Snapshot 2'}, {id: 3, name: 'Snapshot 3'}]
    };
    const selectSnapshot = (snapshot) => console.log(`Select snapshot: ${snapshot}`);

    return (
      <div>
          <div>
            <button id="first" type="button" >First</button>
            <button id="prev" type="button" >Prev</button>
            <button id="makeSnapshot" type="button" >Snapshot</button>
            <button id="next" type="button" >Next</button>
            <button id="last" type="button" >Last</button>
          </div>
          <TicketSubmitContainer socket={this.state.socket} />
          <AceEditor value={this.state.data} mode="javascript" theme="solarized_dark" />
      </div>
    );
  }
}
