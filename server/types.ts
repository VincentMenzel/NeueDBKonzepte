import {ObjectID} from "mongodb";

export enum SocketEvents {
  CONNECTION = "connection",
  SEND_MESSAGE = "send_message",
  EMIT_MESSAGE = "emit_message",
  SEND_COMMENT = "send_comment",
  EMIT_COMMENT = "emit_comment",
  GET_MESSAGE_HISTORY = "get_message_history"
}

export class Database {
  static DB_NAME = "NewDBConcepts"
  static COLLECTIONS = {
    MESSAGES: "messages"
  }
}

export interface NewMessage {
  msg: string
}

export interface Message extends NewMessage{
  _id: string
  comments: Comment[]
}

export interface NewComment {
  messageId: string
  msg: string
}

export interface Comment extends NewComment{
  _id: string | ObjectID
}
