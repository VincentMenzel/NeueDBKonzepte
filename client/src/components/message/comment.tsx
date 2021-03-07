import React from "react";
import {Grid, Typography} from "@material-ui/core";
import {IComment} from "../../App";

const Comment = (props: {comment: IComment}) => (
  <Grid container direction={"column"}>
    <Grid item>
      <Typography variant={"body2"} color={"textSecondary"}>{props.comment._id}</Typography>
    </Grid>
    <Grid item>
      {props.comment.msg || "No Comment"}
    </Grid>
  </Grid>
)

export default Comment
