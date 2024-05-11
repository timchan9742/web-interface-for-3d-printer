import React from "react"
import { ButtonGroup } from '@mui/material'
import { IconButton } from '@mui/material'
import { Button } from '@mui/material'
import { TextField } from '@mui/material'
import { Slider } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import LockIcon from '@mui/icons-material/Lock'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PrintIcon from '@mui/icons-material/Print'
import VisibilityIcon from '@mui/icons-material/Visibility'
import "./Printer.css"

import Tooltip from '@mui/material/Tooltip'
import CircularProgress, {CircularProgressProps} from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import CancelIcon from '@mui/icons-material/Cancel'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'

import { red, pink, grey }  from '@mui/material/colors'

import {RightPanelContext} from "./Context"
import {conn} from "./WebSocket"

const axisArray = ['X', 'Y', 'Z', 'E']

// function getJsonPackageToolHeadRelativeMove(axis, value) {
//   return {
//     type: "gcode_command",
//     payload: `G91\nG1 ${axis}${value}`
//   }
// }

function getJsonPackageToolHeadRelativeMove(axis, value) {
  var displacement = [0.0, 0.0, 0.0, 0.0]
  var idx = axisArray.indexOf(axis)
  // displacement[idx] = parseInt(value)
  displacement[idx] = parseFloat(value)
  return {
    type: "relative_move",
    payload: displacement
  }
}

// function getJsonPackageToolHeadAbsoluteMove(axis, value) {
//   return {
//     type: "gcode_command",
//     payload: `G90\nG1 ${axis}${value}`
//   }
// }

function getJsonPackageToolHeadAbsoluteMove(axis, value) {
  var destination = [0.0, 0.0, 0.0, 0.0]
  var idx = axisArray.indexOf(axis)
  // destination[idx] = parseInt(value)
  destination[idx] = parseFloat(value)
  return {
    type: "relative_move",
    payload: destination
  }
}

// function getJsonPackageExtruderMove(value) {
//   //always a relative move
//   return {
//     type: "gcode_command",
//     payload: `M83\nG1 E${value}`
//   }
// }

function getJsonPackageExtruderMove(value) {
  //always a relative move
  return {
    type: "relative_move",
    payload: [0.0, 0.0, 0.0, parseFloat(value)]
  }
}


function PrinterControlHeader() {

  const handleMotorsOff = () => {
    const jsonPackage = {
      type: "motors_off",
      payload: ""
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  return (
    <div className="printer-control-header">
      <div className="printer-control-header-icon">
        <PrintIcon color="primary"/>
      </div>
      <h3>Tool</h3>
      <div className="printer-motors-off" style={{paddingLeft: "140px"}}>
        <Button variant="contained" size="small" onClick={handleMotorsOff}>Motors off</Button>
      </div>
    </div>
  )
}

function PrinterControl() {

  const iconButtonStyle = {
    width: "36px",
    height: "36px"
  }
  const toggleButtonStyle = {
    width: "60px",
    height: "35px"
  }
  const textFieldStyle = {
    paddingRight: "5px"
  }

  const [toolheadScale, setToolheadScale] = React.useState('10')
  const [extruderScale, setExtruderScale] = React.useState('0.005')
  const [extrudeLength, setExtrudeLength] = React.useState("")
  const [retractLength, setRetractLength] = React.useState("")

  const handleToolheadScaleChange = (event, newScale) => {
    setToolheadScale(newScale);
  }
  const handleExtruderScaleChange = (event, newScale) => {
    setExtruderScale(newScale)
  }

  const handleExtrudeLengthChange = (event) => {
    setExtrudeLength(event.target.value)
  }
  const handleRetractLengthChange = (event) => {
    setRetractLength(event.target.value)
  }

  const handleExtrude = () => {
    if(extrudeLength === "") {
      console.log(extruderScale)
      const jsonPackage = getJsonPackageExtruderMove(extruderScale)
      conn.send(JSON.stringify(jsonPackage))
    } else {
      console.log(extrudeLength)
      const jsonPackage = getJsonPackageExtruderMove(extrudeLength)
      conn.send(JSON.stringify(jsonPackage))
    }
  }
  const handleRetract = () => {
    if(retractLength === "") {
      console.log(extruderScale)
      const jsonPackage = getJsonPackageExtruderMove(-extruderScale)
      conn.send(JSON.stringify(jsonPackage))
    } else {
      console.log(retractLength)
      const jsonPackage = getJsonPackageExtruderMove(-retractLength)
      conn.send(JSON.stringify(jsonPackage))
    }
  }

  const handleXForward = () => {
    console.log(`x forward ${toolheadScale}`)
    const jsonPackage = getJsonPackageToolHeadRelativeMove('X', toolheadScale)
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleXBackward = () => {
    console.log(`x backward ${toolheadScale}`)
    const jsonPackage = getJsonPackageToolHeadRelativeMove('X', -toolheadScale)
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleYForward = () => {
    console.log(`y forward ${toolheadScale}`)
    const jsonPackage = getJsonPackageToolHeadRelativeMove('Y', toolheadScale)
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleYBackward = () => {
    console.log(`y backward ${toolheadScale}`)
    const jsonPackage = getJsonPackageToolHeadRelativeMove('Y', -toolheadScale)
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleZUpward = () => {
    console.log(`z upward ${toolheadScale}`)
    const jsonPackage = getJsonPackageToolHeadRelativeMove('Z', toolheadScale)
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleZDownward = () => {
    console.log(`z downward ${toolheadScale}`)
    const jsonPackage = getJsonPackageToolHeadRelativeMove('Z', -toolheadScale)
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleXHoming = () => {
    console.log("x homing")
    const jsonPackage = {
      type: "gcode_command",
      payload: "G28 X"
    }
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleYHoming = () => {
    console.log("y homing")
    const jsonPackage = {
      type: "gcode_command",
      payload: "G28 Y"
    }
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleZHoming = () => {
    console.log("z homing")
    const jsonPackage = {
      type: "gcode_command",
      payload: "G28 Z"
    }
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleXYHoming = () => {
    console.log("xy homing")
    const jsonPackage = {
      type: "gcode_command",
      payload: "G28 X Y"
    }
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleXYZHoming = () => {
    console.log("xyz homing")
    const jsonPackage = {
      type: "gcode_command",
      payload: "G28 X Y Z"
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  const handleClosedLoop = (axis) => {
    const jsonPackage = {
      type: "closedloop",
      payload: axis
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  return (
    <div className="printer-control">
      <PrinterControlHeader />
      <div className="printer-control-first">
        <div className="printer-control-option" style={{marginLeft:"60px", backgroundColor:""}}>
          <IconButton aria-label="y-forward" size="large" color="primary" onClick={handleYForward}>
             <ArrowUpwardIcon style={iconButtonStyle} fontSize="inherit" />
          </IconButton>
        </div>
        <div className="printer-control-option" style={{marginLeft:"60px", backgroundColor:""}}>
          <IconButton aria-label="z-upward" size="large" color="primary" onClick={handleZUpward}>
             <ArrowUpwardIcon style={iconButtonStyle} fontSize="inherit" />
          </IconButton>
        </div>
        <div className="printer-control-option">
          <Tooltip title="Home ALL">
            <Button variant="outlined" startIcon={<HomeIcon />} onClick={handleXYZHoming}>
              ALL
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="printer-control-second">
        <div className="printer-control-option">
          <IconButton aria-label="x-backward" size="large" color="primary" onClick={handleXBackward}>
             <ArrowBackIcon style={iconButtonStyle} fontSize="inherit" />
          </IconButton>
        </div>
        <div className="printer-control-option">
          <Tooltip title="Home XY">
            <IconButton aria-label="xy-homing" size="large" color="primary" onClick={handleXYHoming}>
               <HomeIcon style={iconButtonStyle} fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="printer-control-option">
          <IconButton aria-label="x-forward" size="large" color="primary" onClick={handleXForward}>
             <ArrowForwardIcon style={iconButtonStyle} fontSize="inherit" />
          </IconButton>
        </div>
        <div className="printer-control-option">
          <Tooltip title="Home Z">
            <IconButton aria-label="z-homing" size="large" color="primary" onClick={handleZHoming}>
               <HomeIcon style={iconButtonStyle} fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="printer-control-option">
          <Tooltip title="Home X">
            <Button variant="outlined" startIcon={<HomeIcon />} onClick={handleXHoming}>
              X
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="printer-control-third">
        <div className="printer-control-option" style={{marginLeft:"60px", backgroundColor:""}}>
          <IconButton aria-label="y-backward" size="large" color="primary" onClick={handleYBackward}>
             <ArrowDownwardIcon style={iconButtonStyle} fontSize="inherit" />
          </IconButton>
        </div>
        <div className="printer-control-option" style={{marginLeft:"60px", backgroundColor:""}}>
          <IconButton aria-label="z-downward" size="large" color="primary" onClick={handleZDownward}>
             <ArrowDownwardIcon style={iconButtonStyle} fontSize="inherit" />
          </IconButton>
        </div>
        <div className="printer-control-option">
          <Tooltip title="Home Y">
            <Button variant="outlined" startIcon={<HomeIcon />} onClick={handleYHoming}>
              Y
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="printer-display-closedloop">
        <Tooltip title="Closed Loop X">
          <Button style={{width:"50px"}} variant="outlined" startIcon={<LockIcon />} onClick={() => handleClosedLoop('X')}>
            X
          </Button>
        </Tooltip>
        <Tooltip title="Closed Loop Y">
          <Button style={{width:"50px"}} variant="outlined" startIcon={<LockIcon />} onClick={() => handleClosedLoop('Y')}>
            Y
          </Button>
        </Tooltip>
        <Tooltip title="Closed Loop Z">
          <Button style={{width:"50px"}} variant="outlined" startIcon={<LockIcon />} onClick={() => handleClosedLoop('Z')}>
            Z
          </Button>
        </Tooltip>
        <Tooltip title="Closed Loop E">
          <Button style={{width:"50px"}} variant="outlined" startIcon={<LockIcon />} onClick={() => handleClosedLoop('E')}>
            E
          </Button>
        </Tooltip>
        <Tooltip title="Closed Loop ALL">
          <Button style={{width:"50px"}} variant="outlined" startIcon={<LockIcon />} onClick={() => handleClosedLoop('A')}>
            ALL
          </Button>
        </Tooltip>
      </div>
      <div className="printer-control-fourth">
        <ToggleButtonGroup
          value={toolheadScale}
          exclusive
          onChange={handleToolheadScaleChange}
          aria-label="scale selection">
          <ToggleButton style={toggleButtonStyle} value="0.1">
            0.1
          </ToggleButton>
          <ToggleButton style={toggleButtonStyle} value="1.0">
            1.0
          </ToggleButton>
          <ToggleButton style={toggleButtonStyle} value="10">
            10
          </ToggleButton>
          <ToggleButton style={toggleButtonStyle} value="25">
            25
          </ToggleButton>
          <ToggleButton style={toggleButtonStyle} value="100">
            100
          </ToggleButton>,
        </ToggleButtonGroup>
      </div>
      <div className="printer-control-fifth" >
        <TextField style={textFieldStyle}
          size="small"
          id="extrude-length"
          placeholder="mm"
          value={extrudeLength}
          onChange={handleExtrudeLengthChange}
          label="Extrude Length"
          variant="outlined" />
        <Button variant="contained" onClick={handleExtrude} endIcon={<ArrowDownwardIcon />}>
          Extrude
        </Button>
      </div>
      <div className="printer-control-sixth" >
        <TextField style={textFieldStyle}
          size="small"
          id="retract-length"
          placeholder="mm"
          value={retractLength}
          onChange={handleRetractLengthChange}
          label="Retract Length"
          variant="outlined" />
        <Button variant="contained" onClick={handleRetract} endIcon={<ArrowUpwardIcon />}>
          Retract
        </Button>
      </div>
      <div className="printer-control-seventh">
        <ToggleButtonGroup
          value={extruderScale}
          exclusive
          onChange={handleExtruderScaleChange}
          aria-label="scale selection">
          <ToggleButton style={toggleButtonStyle} value="0.005">
            0.005
          </ToggleButton>
          <ToggleButton style={toggleButtonStyle} value="0.010">
            0.010
          </ToggleButton>
          <ToggleButton style={toggleButtonStyle} value="0.025">
            0.025
          </ToggleButton>
          <ToggleButton style={toggleButtonStyle} value="0.100">
            0.100
          </ToggleButton>
          <ToggleButton style={toggleButtonStyle} value="0.500">
            0.500
          </ToggleButton>,
        </ToggleButtonGroup>
      </div>
    </div>
  )
}

function PrinterDisplayHeader(props) {

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialogWithYes = () => {
    setOpenDialog(false);
    const jsonPackage = {
      type: "cancel_print",
      payload: ""
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  const handleCancelPrint = () => {
    handleOpenDialog();
  }

  const handlePausePrint = () => {
    const jsonPackage = {
      type: "pause_print",
      payload: ""
    }
    conn.send(JSON.stringify(jsonPackage))
  }
  const handleResumePrint = () => {
    const jsonPackage = {
      type: "resume_print",
      payload: ""
    }
    conn.send(JSON.stringify(jsonPackage))
  }


  return (
    <div className="printer-display-header">
      <div className="printer-display-header-icon">
        <VisibilityIcon color="primary"/>
      </div>
      <h3 style={{paddingRight:"160px"}}>Print</h3>
      {props.isPrinting ?
        (
          <Tooltip title="Pause">
            <IconButton aria-label="pause" size="large" color="primary" onClick={handlePausePrint}>
               <PauseCircleFilledIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        ) :
        (
          <Tooltip title="Resume">
            <IconButton aria-label="resume" size="large" color="primary" onClick={handleResumePrint}>
               <PlayCircleFilledWhiteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )
      }
      <Tooltip title="Cancel">
        <IconButton aria-label="cancel" size="large" sx={{ color: red[800] }} onClick={handleCancelPrint}>
           <CancelIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to cancel the print?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button onClick={handleCloseDialogWithYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

function Progress(props) {

  var progress = 0;
  var progressHeader = <h4>No printing at the moment</h4>;

  function updateProgress() {
    if(props.task === undefined) { //when there is no task
      progress = 0;
    }
    else {
      progress = props.task.time_spent / (props.task.time_spent + props.task.time_left) * 100;
    }
  }

   /*
    CREATED = 0
    READY = 1
    PRINTING = 2
    SUSPENDED = 3
    COMPLETED = 4
    CANCELED = 5
  */

  function updateProgressHeader() {
    if(props.isPrinting) {
      if(props.task.name === undefined) {
        progressHeader = <h4>undefined file</h4>;
      }
      else {
        progressHeader = <h4>{props.task.name}</h4>;
      }
    }
    else {
      //same as above
      if(props.task === undefined) { //when there is no task
        progressHeader = <h4>No print at the moment</h4>;
      }
      else {
        if(props.task.state === 3) {
          progressHeader = <h4>The print has been suspended</h4>;
        }
        else if(props.task.state === 4) {
          progressHeader = <h4>Print complete</h4>;
        }
        else if(props.task.state === 5) {
          progressHeader = <h4>The print has been canceled</h4>;
        }
      }
    }
  }

  // function updateProgress() {
  //   //error handling when the task queue is empty and there is no task
  //   try {
  //     progress = props.task.time_spent / (props.task.time_spent + props.task.time_left) * 100
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }

  // function updateProgressHeader() {
  //   if(props.isPrinting) {
  //     progressHeader = <h4>{props.task.name}</h4>;
  //   }
  //   else {
  //     //same as above
  //     try {
  //       if(props.task.state === 3) {
  //         progressHeader = <h4>The print has been suspended</h4>;
  //       }
  //       else {
  //         progressHeader = <h4>No print at the moment</h4>;
  //       }
  //     } catch(e) {
  //       console.log(e);
  //     }
  //   }
  // }

  function timeConvert(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " h " : " h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " m " : " m ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  updateProgressHeader();
  updateProgress();

  // {props.isPrinting ? (
  //   <h4>{props.task.name}</h4>
  // ) : (
  //   <h4>No printing at the moment</h4>
  // )}

  return (
    <div className="printer-display-progress">
      <div className="printer-display-progress-header">
        {progressHeader}
      </div>
      <div className="printer-display-progress-body">
        <div className="printer-display-progress-left">
          <Box sx={{ position: 'relative', display: 'inline-flex'}}>
            <CircularProgress variant="determinate" color='primary' thickness={3} value={Math.round(progress)} size={120}
              style={{
                borderRadius: "100%",
                boxShadow: "inset 0 0 0px 8px DarkGrey",
            }}/>
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" component="div" color="text.secondary">
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
        </div>
        <div className="printer-display-progress-right">
          {props.isPrinting &&
            <div>
              <h4>Total time: {timeConvert(props.task.time_spent + props.task.time_left)}</h4>
              <h4>Time left: {timeConvert(props.task.time_left)}</h4>
              <h4>Speed: {`${parseInt(props.speed)} mm/s`}</h4>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

function PrinterDisplay() {

  const [progress, setProgress] = React.useState(0)
  const [xValue, setXValue] = React.useState(0)
  const [yValue, setYValue] = React.useState(0)
  const [zValue, setZValue] = React.useState(0)
  const [acceleration, setAcceleration] = React.useState(0)
  const [deceleration, setDeceleration] = React.useState(0)

  const contextObj = React.useContext(RightPanelContext)

  React.useEffect(() => {
    const timer = setInterval(() => {
      if(contextObj.isPrinting) {
        setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 1));
      }
      else {
        setProgress(0);
      }
    }, 600);
    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    setAcceleration(contextObj.toolhead.maxAccel);
    setDeceleration(contextObj.toolhead.maxDecel);
    console.log("dwnodjwoj")
  }, [contextObj.toolhead.maxAccel, contextObj.toolhead.maxDecel])

  const handleXValueChange = (event) => {
    setXValue(event.target.value)
  }
  const handleYValueChange = (event) => {
    setYValue(event.target.value)
  }
  const handleZValueChange = (event) => {
    setZValue(event.target.value)
  }

  // const handleAbsoluteMoveX = (event) => {
  //   if(event.key === 'Enter') {
  //     const jsonPackage = {
  //       type: "gcode_command",
  //       payload: `G90\nG1 X${event.target.value}`
  //     }
  //     conn.send(JSON.stringify(jsonPackage))
  //   }
  // }
  // const handleAbsoluteMoveY = (event) => {
  //   if(event.key === 'Enter') {
  //     const jsonPackage = {
  //       type: "gcode_command",
  //       payload: `G90\nG1 Y${event.target.value}`
  //     }
  //     conn.send(JSON.stringify(jsonPackage))
  //   }
  // }
  // const handleAbsoluteMoveZ = (event) => {
  //   if(event.key === 'Enter') {
  //     const jsonPackage = {
  //       type: "gcode_command",
  //       payload: `G90\nG1 Z${event.target.value}`
  //     }
  //     conn.send(JSON.stringify(jsonPackage))
  //   }
  // }

  const handleAbsoluteMoveX = (event) => {
    var targetPositionX = parseInt(event.target.value)
    if(event.key === 'Enter') {
      const jsonPackage = {
        type: "absolute_move",
        payload: [targetPositionX, 9999, 9999, 9999]
      }
      conn.send(JSON.stringify(jsonPackage))
    }
  }
  const handleAbsoluteMoveY = (event) => {
    var targetPositionY = parseInt(event.target.value)
    if(event.key === 'Enter') {
      const jsonPackage = {
        type: "absolute_move",
        payload: [9999, targetPositionY, 9999, 9999]
      }
      conn.send(JSON.stringify(jsonPackage))
    }
  }
  const handleAbsoluteMoveZ = (event) => {
    var targetPositionZ = parseInt(event.target.value)
    if(event.key === 'Enter') {
      const jsonPackage = {
        type: "absolute_move",
        payload: [9999, 9999, targetPositionZ, 9999]
      }
      conn.send(JSON.stringify(jsonPackage))
    }
  }

  const handleAccelerationChangeCommitted = (event, value) => {
    const jsonPackage = {
      type: "set_max_acceleration",
      payload: value
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  const handleDecelerationChangeCommitted = (event, value) => {
    const jsonPackage = {
      type: "set_max_deceleration",
      payload: value
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  const handleClosedLoop = (axis) => {
    const jsonPackage = {
      type: "closedloop",
      payload: axis
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  return (
    <div className="printer-display">
      <PrinterDisplayHeader isPrinting={contextObj.isPrinting} task={contextObj.taskQueue[0]} />
      <Progress isPrinting={contextObj.isPrinting} task={contextObj.taskQueue[0]} speed={contextObj.toolhead.moveSpeed}/>
      <div className="printer-display-position">
        <h3>X:</h3>
        <TextField
          style={{width:"80px"}}
          size="small"
          id="x-position"
          label=""
          defaultValue={contextObj.toolhead.position[0]}
          value={contextObj.isPrinting? contextObj.toolhead.position[0] : xValue}
          onChange={handleXValueChange}
          onKeyDown={handleAbsoluteMoveX}
        />
        <h3>Y:</h3>
        <TextField
          style={{width:"80px"}}
          size="small"
          id="y-position"
          label=""
          defaultValue={contextObj.toolhead.position[1]}
          value={contextObj.isPrinting? contextObj.toolhead.position[1] : yValue}
          onChange={handleYValueChange}
          onKeyDown={handleAbsoluteMoveY}
        />
        <h3>Z:</h3>
        <TextField
          style={{width:"80px"}}
          size="small"
          id="z-position"
          label=""
          defaultValue={contextObj.toolhead.position[2]}
          onChange={handleZValueChange}
          value={contextObj.isPrinting? contextObj.toolhead.position[2] : zValue}
          onKeyDown={handleAbsoluteMoveZ}
        />
      </div>
      <div className="printer-display-slider">
        <h3>Max Acceleration:</h3>
        <Slider
          value={acceleration}
          defaultValue={acceleration}
          aria-label="Small"
          valueLabelDisplay="auto"
          onChangeCommitted={handleAccelerationChangeCommitted}
          max={60000}
        />
      </div>
      <div className="printer-display-slider">
        <h3>Max Deceleration:</h3>
        <Slider
          value={deceleration}
          defaultValue={deceleration}
          aria-label="Small"
          valueLabelDisplay="auto"
          onChangeCommitted={handleDecelerationChangeCommitted}
          max={60000}
        />
      </div>
    </div>
  )
}
function Printer() {
  return (
    <div className="printer">
      <PrinterDisplay />
      <PrinterControl />
    </div>
  )
}

export default Printer

// <ButtonGroup variant="contained" aria-label="outlined primary button group">
//   <Button style={buttonStyle}>0.1</Button>
//   <Button style={buttonStyle}>1.0</Button>
//   <Button style={buttonStyle}>10</Button>
//   <Button style={buttonStyle}>25</Button>
//   <Button style={buttonStyle}>100</Button>
// </ButtonGroup>

// <ButtonGroup variant="contained" aria-label="outlined primary button group">
//   <Button style={buttonStyle}>0.005</Button>
//   <Button style={buttonStyle}>0.010</Button>
//   <Button style={buttonStyle}>0.025</Button>
//   <Button style={buttonStyle}>0.050</Button>
//   <Button style={buttonStyle}>0.100</Button>
// </ButtonGroup>
