import React, {useState} from "react";
import {IMessage, ISendComment} from "../../App";
import {Grid, Typography} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Comment from "./comment";

const Message = (props: { msg: IMessage, sendComment: ISendComment }) => {

  const [commentVal, setComment] = useState("")

  const sendMessage = () => {
    props.sendComment(props.msg, commentVal)
    setComment("")
  }

  return <Grid container direction={"column"}>
    <Grid item xs>
      <Typography variant={"subtitle2"} color={"textSecondary"}>{props.msg._id}</Typography>
    </Grid>
    <Grid item xs>
      <Typography variant={"body1"}>{props.msg.msg || "{No Message :/}"}</Typography>
      <div style={{paddingLeft: "20px"}}>

        {
          props.msg.comments.map(comment => (
            <Comment key={comment._id} comment={comment}/>
          ))
        }

        <TextField label="Comment" value={commentVal} onChange={(event => setComment(event.target.value))}/>
        <Button variant="contained" onClick={sendMessage}>
          Comment
        </Button>
      </div>


    </Grid>
  </Grid>
}

export default Message
