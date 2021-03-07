import React, {Component} from 'react';
import './App.css';

import io from 'socket.io-client';
import {Container} from "@material-ui/core";
// import { fromEvent, Observable } from 'rxjs';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Message from "./components/message/message";

export enum SocketEvents {
  CONNECTION = "connection",
  SEND_MESSAGE = "send_message",
  EMIT_MESSAGE = "emit_message",
  SEND_COMMENT = "send_comment",
  EMIT_COMMENT = "emit_comment",
  GET_MESSAGE_HISTORY = "get_message_history"
}

export interface INewMessage {
  msg: string
}

export interface IMessage extends INewMessage {
  _id: string
  comments: IComment[]
}

export interface NewComment {
  messageId: string
  msg: string
}

export interface IComment extends NewComment {
  _id: string
}

export type ISendComment = (msg: IMessage, comment: string) => void

const socket = io("ws://localhost:3500", {})

class App extends Component {

  state = {
    messages: [] as IMessage[],
    messageContent: "" as string,
    socket: undefined as (SocketIOClient.Socket | undefined)
  }


  componentDidMount() {
    socket.on(SocketEvents.GET_MESSAGE_HISTORY, (messages: IMessage[]) => {
      this.setState({messages: messages})
      console.log(messages)
    })
    socket.on(SocketEvents.EMIT_MESSAGE, (msg: INewMessage) => this.appendNewMessage(msg))
    socket.on(SocketEvents.EMIT_COMMENT, (comment: IComment) => this.appendNewComment(comment))
  }

  sendMessage(newMessage: INewMessage) {
    socket!.emit(SocketEvents.SEND_MESSAGE, newMessage)
    this.setState({messageContent: ""})
  }

  appendNewMessage(message: INewMessage) {
    this.setState({messages: [...this.state.messages, message]})
  }

  appendNewComment(comment: IComment) {
    this.setState(this.state.messages.map((msg => {
      if (msg._id === comment.messageId) {
        msg.comments.push(comment);
      }
      return msg
    })))
  }


  sendComment(msg: IMessage, comment: string) {
    const newComment: NewComment = {messageId: msg._id, msg: comment}
    socket.emit(SocketEvents.SEND_COMMENT, newComment)
  }


  render() {
    return (
      <Container>
        <div className="App">
          {
            this.state.messages.map(msg => (
              <Message msg={msg} sendComment={this.sendComment}/>
            ))
          }
        </div>
        <TextField id="standard-basic" value={this.state.messageContent}
                   onChange={event => this.setState({messageContent: event.target.value})}/>
        <Button variant="contained" onClick={() => this.sendMessage({msg: this.state.messageContent})}>
          Send
        </Button>
      </Container>
    )
  }

}

export default App
