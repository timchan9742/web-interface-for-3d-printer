import React from "react"
import axios from 'axios'
import {conn} from "./WebSocket"
import "./Console.css"

import MessageIcon from '@mui/icons-material/Message'
import HelpIcon from '@mui/icons-material/Help'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SendIcon from '@mui/icons-material/Send'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import { InputBase } from '@mui/material'
import { TextField } from '@mui/material'
import { IconButton } from '@mui/material'
import { Button } from '@mui/material'

import {RightPanelContext} from "./Context"

// var globalContent = "20:11:11: This is a test\n20:11:11: This is a test\n20:11:11: This is a test\n20:11:11: This is a test\n20:11:11: This is a test\n20:11:11: This is a test\n20:11:11: This is a test\n20:11:11: This is a test\n"
var globalContent = ''

function Console() {

  const [commandToSent, setCommandToSent] = React.useState('');
  const [contentToDisplay, setContentToDisplay] = React.useState('');
  const inputElement = React.useRef(null);

  const contextObj = React.useContext(RightPanelContext);

  const scrollToBottom = () => {
    inputElement.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatMessage = (message) => {
    var date = new Date();
    var time = date.toLocaleTimeString();
    // var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    message = time + ' ' + message + '\n';
    return message
  }

  React.useEffect(() => {
    if(contextObj.message) {
      var message = formatMessage(contextObj.message);
      globalContent = globalContent.concat(message);
      setContentToDisplay(globalContent);
      // scrollToBottom();
    }
  }, [contextObj.message]);

  const handleCommandToSentChange = (event) => {
    setCommandToSent(event.target.value);
  }

  const handleSendCommand = () => {
    const jsonPackage = {
      type: "gcode_command",
      payload: String(commandToSent)
    }
    conn.send(JSON.stringify(jsonPackage));
    var message = formatMessage(commandToSent);
    globalContent = globalContent.concat(message);
    setContentToDisplay(globalContent);
  }

  return (
    <div className="console">
      <div className="console-header">
        <div className="console-header-icon">
          <MessageIcon color="primary"/>
        </div>
        <h3>Console</h3>
        <IconButton aria-label="console-info" size="large" color="primary" onClick=''>
           <HelpIcon/>
        </IconButton>
        <IconButton aria-label="console-dropdown" size="large" color="primary" onClick=''>
           <ExpandMoreIcon/>
        </IconButton>
      </div>
      <div className="console-panel">
        <InputBase
        minRows="10"
        maxRows="10"
        multiline="true"
        fullWidth
        value={contentToDisplay}
        inputRef={inputElement}
        inputProps={{style: {fontSize: 20, color: "grey", fontFamily: "Times", fontStyle: "Bold"}}}
        />
      </div>
      <div className="console-bottom">
        <TextField
          id="command-to-send"
          size="small"
          placeholder="G28 W"
          fullWidth
          value={commandToSent}
          onChange={handleCommandToSentChange}
        />
        <Tooltip title="Send">
          <IconButton aria-label="console-send" size="large" color="primary" onClick={handleSendCommand}>
             <SendIcon/>
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default Console
