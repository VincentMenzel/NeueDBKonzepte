import Express, {Request, Response} from "express"
import HTTP from "http"
import cors from 'cors'
import path from "path";
import {Socket} from "socket.io";
import {Comment, Database, Message, NewComment, NewMessage, SocketEvents} from "./types";
import mongodb, {MongoClient, ObjectID} from "mongodb"

const socketIo = require("socket.io")

const app = Express();

const client = new MongoClient("mongodb://localhost:27017")

app.use(cors({
  origin: "http://localhost:3000"
}))

export const server = HTTP.createServer(app);

const buildPath = path.join(__dirname, '../../client/build')
app.use(Express.static(buildPath));

app.get('/', function (req: Request, res: Response) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

server.listen(3500, async () => {

  await client.connect()

  const db = client.db(Database.DB_NAME)
  const messageCol = db.collection(Database.COLLECTIONS.MESSAGES)

  const socket = socketIo(server, {
    cors: {
      origin: "http://localhost:3000"
    }
  })

  let cons = 0
  socket.on("connection", (uSocket: Socket) => {
    console.log("con", cons++)


    messageCol.find().toArray().then(messages => {
      // console.log(messages)
      uSocket.emit(SocketEvents.GET_MESSAGE_HISTORY, messages)
    })

    uSocket.on(SocketEvents.SEND_MESSAGE, async (msg: NewMessage) => {
      const newMessage: Partial<Message> = {
        ...msg,
        comments: [],
      }
      const newEntry = await messageCol.insertOne(newMessage)
      newMessage._id = newEntry.insertedId

      socket.emit(SocketEvents.EMIT_MESSAGE, newMessage)
    })

    uSocket.on(SocketEvents.SEND_COMMENT, (comment: NewComment) => {
      const newComment: Comment = {
        _id: new ObjectID(),
        ...comment
      }
      console.log(comment)
      messageCol.updateOne({_id: new ObjectID(comment.messageId)}, {$push: {comments: newComment}})
      socket.emit(SocketEvents.EMIT_COMMENT, newComment)
    })
  })

  socket.on("disconnect", () => console.log("cons: ", cons--))
})
