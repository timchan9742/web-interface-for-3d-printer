import React from "react"
import Header from "./components/Header"
import LeftPanel from "./components/LeftPanel"
import RightPanel from "./components/RightPanel"
import Config from "./components/Config"
import {RightPanelContext} from "./components/Context"
import {LeftPanelContext} from "./components/Context"
import {conn, createNewConnection} from "./components/WebSocket"
import {initialState, reducer} from "./components/Reducer"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import './App.css';

const localIpUrl = require('local-ip-url');
const ipAdress = localIpUrl('public', 'ipv4')

const WebSocketContext = React.createContext(conn)

// resp = {"action": "UPDATE_PRINTER_INFO",
//                "payload": {
//                    "extruder": {
//                    "temp": extruder_temp,
//                    "set_temp": extruder_set_temp,
//                    "is_powered": False
//                    },
//                    "bed": {
//                    "temp": bed_temp,
//                    "set_temp": bed_set_temp,
//                    "is_powered": False
//                    },
//                    "pi": {
//                    "temp": pi_temp
//                    },
//                    "fan": {
//                    "power": fan_power,
//                    "is_powered": False
//                    },
//                    "toolhead": {
//                    "position": position,
//                    "max_accel": max_accel,
//                    "max_decel": max_decel,
//                    "move_speed": move_speed,
//                    "move_state": move_state,
//                    "home_state": home_state
//                    },
//                    "task": {
//                    "name": "ongoing_task.name",
//                    "time_spent": "ongoing_task.time_spent",
//                    "time_left": "ongoing_task.time_left",
//                    "state": "ongoing_task.state"
//                    }
//                 }
//                }

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      isHomeSelected: true,
      isConnected: false,
      isPrinting: false,
      extruder: {
        temp: 0,
        setTemp: 0,
        isPowered: false
      },
      bed: {
        temp: 0,
        setTemp: 0,
        isPowered: false
      },
      pi: {
        temp: 0,
      },
      fan: {
        power: 0,
        isPowered: false
      },
      toolhead: {
        position: [0, 0, 0, 0],
        maxAccel: 0,
        maxDecel: 0,
        moveSpeed: 0,
        moveState: [false, false, false, false],
        homeState: [false, false, false, false]

      },
      taskQueue: [],
      message: '',
    }
    // this.state = React.useReducer(reducer, initialState)
    this.setIsHomeSelected = this.setIsHomeSelected.bind(this)
    this.setIsConnected = this.setIsConnected.bind(this)
    this.setPrinterInfo = this.setPrinterInfo.bind(this)
    this.connectWebSocket = this.connectWebSocket.bind(this);
  }

  setIsHomeSelected(newSelection) {
    this.setState({...this.state, isHomeSelected: newSelection});
  }

  setIsConnected(newConnectionState) {
    this.setState({...this.state, isConnected: newConnectionState});
  }

  setPrinterInfo(newPrinterState) {
    this.setState({ ...this.state,
                    isPrinting: newPrinterState.isPrinting,
                    extruder: newPrinterState.extruder,
                    bed: newPrinterState.bed,
                    pi: newPrinterState.pi,
                    fan: newPrinterState.fan,
                    toolhead: newPrinterState.toolhead,
                    taskQueue: Array.from(newPrinterState.taskQueue),
                    message: newPrinterState.message
                  });
  }

  connectWebSocket() {

      if(conn === undefined || (conn && conn.readyState === 3)) {
        createNewConnection();
      }

      conn.onopen = () => {
        console.log('WebSocket Connected');
        this.setIsConnected(true);
        const jsonPackage = {
          type: "get_printer_info",
          payload: ""
        }
        this.interval = setInterval(() => {
          if(conn && conn.readyState === 1) {
            conn.send(JSON.stringify(jsonPackage));
          }
        }, 500);

      }

      conn.onmessage = (message) => {
        // console.log(message.data);
        const responseObJ = JSON.parse(message.data);
        console.log(responseObJ.payload.message);
        switch (responseObJ.action) {
          case "UPDATE_PRINTER_INFO":
            this.setPrinterInfo(responseObJ.payload);
          default:
            break
        }
      }

      conn.onclose = () => {
        console.log("No connection");
        this.setIsConnected(false);
        clearInterval(this.interval);
        setTimeout(this.connectWebSocket, 2000);
      }

  }

  componentWillMount() {
  }

  componentDidMount() {
    this.connectWebSocket();
  }

  render() {
    return (
      <div className="app">
        <Header isHomeSelected={this.state.isHomeSelected} setIsHomeSelected={this.setIsHomeSelected}/>
          {this.state.isHomeSelected? (
            <div className="app-body">
              <LeftPanelContext.Provider value={{extruder: this.state.extruder, bed: this.state.bed, pi: this.state.pi, fan: this.state.fan}}>
                <LeftPanel />
              </LeftPanelContext.Provider>
              <RightPanelContext.Provider value={{toolhead: this.state.toolhead, taskQueue: this.state.taskQueue, isPrinting: this.state.isPrinting, message: this.state.message}}>
                <RightPanel />
              </RightPanelContext.Provider>
            </div>
          )
          :
          (
            <Config />
          )}
      </div>
    );
  }

}


// class App extends React.Component {
//
//   constructor() {
//     super()
//     this.state = {
//       isHomeSelected: true,
//       isConnected: false,
//       isPrinting: false,
//       extruder: {
//         temp: 0,
//         setTemp: 0,
//         isPowered: false
//       },
//       bed: {
//         temp: 0,
//         setTemp: 0,
//         isPowered: false
//       },
//       pi: {
//         temp: 0,
//       },
//       fan: {
//         power: 0,
//         isPowered: false
//       },
//       toolhead: {
//         position: [0, 0, 0, 0],
//         maxAccel: 1000,
//         maxDecel: 1000,
//         moveSpeed: 0,
//         moveState: [false, false, false, false],
//         homeState: [false, false, false, false]
//
//       },
//       taskQueue: [],
//     }
//     // this.state = React.useReducer(reducer, initialState)
//     this.setIsHomeSelected = this.setIsHomeSelected.bind(this)
//     this.setIsConnected = this.setIsConnected.bind(this)
//     this.setPrinterInfo = this.setPrinterInfo.bind(this)
//   }
//
//   setIsHomeSelected(newSelection) {
//     this.setState({...this.state, isHomeSelected: newSelection});
//   }
//
//   setIsConnected(newConnectionState) {
//     this.setState({...this.state, isConnected: newConnectionState});
//   }
//
//   setPrinterInfo(newPrinterState) {
//     this.setState({ ...this.state,
//                     isPrinting: newPrinterState.isPrinting,
//                     extruder: newPrinterState.extruder,
//                     bed: newPrinterState.bed,
//                     pi: newPrinterState.pi,
//                     fan: newPrinterState.fan,
//                     toolhead: newPrinterState.toolhead,
//                     taskQueue: Array.from(newPrinterState.taskQueue) });
//   }
//
//   componentWillMount() {
//
//     conn.onopen = () => {
//       console.log('WebSocket Connected');
//       this.setIsConnected(true);
//       function sendNumber() {
//         if (conn.readyState === conn.OPEN) {
//             var number = Math.round(Math.random() * 0xFFFFFF);
//             conn.send(number.toString());
//             setTimeout(sendNumber, 1000);
//         }
//       }
//       function getPrinterInfo() {
//         const jsonPackage = {
//           type: "get_printer_info",
//           payload: ""
//         }
//         setInterval(() => {
//           conn.send(JSON.stringify(jsonPackage))
//         }, 800)
//       }
//       getPrinterInfo();
//       // sendNumber()
//     };
//
//     conn.onmessage = (message) => {
//       console.log(message.data);
//       const responseObJ = JSON.parse(message.data);
//       switch (responseObJ.action) {
//         case "CONNECT":
//           this.setIsConnected(true)
//           break
//         case "DISCONNECT":
//           this.setIsConnected(false)
//           break
//         case "UPDATE_PRINTER_INFO":
//           this.setPrinterInfo(responseObJ.payload)
//         default:
//           break
//       }
//     };
//
//     conn.onclose = () => {
//       console.log("Closing connection")
//       this.setIsConnected(false)
//       setInterval(() => {
//         conn = new W3CWebSocket('ws://127.0.0.1:8000');
//       }, 3000)
//     }
//   }
//
//   componentDidMount() {
//   }
//
//   render() {
//     return (
//       <div className="app">
//         <Header isHomeSelected={this.state.isHomeSelected} setIsHomeSelected={this.setIsHomeSelected}/>
//           {this.state.isHomeSelected? (
//             <div className="app-body">
//               <LeftPanelContext.Provider value={{extruder: this.state.extruder, bed: this.state.bed, pi: this.state.pi, fan: this.state.fan}}>
//                 <LeftPanel />
//               </LeftPanelContext.Provider>
//               <RightPanelContext.Provider value={{toolhead: this.state.toolhead, taskQueue: this.state.taskQueue, isPrinting: this.state.isPrinting}}>
//                 <RightPanel />
//               </RightPanelContext.Provider>
//             </div>
//           )
//           :
//           (
//             <Config />
//           )}
//       </div>
//     );
//   }
//
// }

// class App extends React.Component {
//
//   constructor() {
//     super()
//
//     this.state = {
//       isHomeSelected: true,
//       isConnected: false,
//       isPrinting: false,
//       isHeating: false,
//       isUploading: false,
//       isMoving: {
//         x: false,
//         y: false,
//         z: false,
//         e: false,
//       },
//       position: {
//         x: 0,
//         y: 0,
//         z: 0,
//         e: 0
//       },
//       temperature: {
//         extruder: 0,
//         bed: 0,
//         pi: 0
//       },
//       gcodeFileList: ["-", "-", "-", "-"]
//     }
//     // this.state = React.useReducer(reducer, initialState)
//     this.setIsHomeSelected = this.setIsHomeSelected.bind(this)
//     this.setIsConnected = this.setIsConnected.bind(this)
//     this.setIsPrinting = this.setIsPrinting.bind(this)
//     this.setIsHeating = this.setIsHeating.bind(this)
//     this.setIsUploading = this.setIsUploading.bind(this)
//     this.setIsMoving = this.setIsMoving.bind(this)
//     this.setPosition = this.setPosition.bind(this)
//     this.setTemperature = this.setTemperature.bind(this)
//     this.setGcodeFileList = this.setGcodeFileList.bind(this)
//   }
//
//   setTemperature(newTemperature) {
//     this.setState({...this.state, temperature: newTemperature});
//   }
//
//   setPosition(newPosition) {
//     this.setState({...this.state, position: newPosition});
//   }
//
//   setGcodeFileList(newFileList) {
//     this.setState({...this.state, gcodeFileList: Array.from(newFileList)});
//   }
//
//   setIsHomeSelected(newSelection) {
//     this.setState({...this.state, isHomeSelected: newSelection});
//   }
//
//   setIsConnected(newConnectionState) {
//     this.setState({...this.state, isConnected: newConnectionState});
//   }
//
//   setIsPrinting(newPrintingState) {
//     this.setState({...this.state, isPrinting: newPrintingState});
//   }
//
//   setIsHeating(newHeatingState) {
//     this.setState({...this.state, isHeating: newHeatingState});
//   }
//
//   setIsUploading(newUploadingState) {
//     this.setState({...this.state, isUploading: newUploadingState});
//   }
//
//   setIsMoving(newMovingState) {
//     this.setState({...this.state, isMoving: newMovingState});
//   }
//
//   componentWillMount() {
//
//     conn.onopen = () => {
//       console.log('WebSocket Connected');
//       this.setIsConnected(true)
//       function sendNumber() {
//         if (conn.readyState === conn.OPEN) {
//             var number = Math.round(Math.random() * 0xFFFFFF);
//             conn.send(number.toString());
//             setTimeout(sendNumber, 1000);
//         }
//       }
//       function getPrinterInfo() {
//         const jsonPackage = {
//           type: "get_printer_info",
//           payload: ""
//         }
//         setInterval(() => {
//           conn.send(JSON.stringify(jsonPackage))
//         },1000)
//       }
//       getPrinterInfo()
//       // sendNumber()
//     };
//
//     conn.onmessage = (message) => {
//       const data = JSON.parse(message.data);
//       switch (data.action) {
//         case "CONNECT":
//           this.setIsConnected(true)
//           break
//         case "DISCONNECT":
//           this.setIsConnected(false)
//           break
//         case "START_PRINT":
//           this.setIsPrinting(true)
//           break
//         case "RESUME_PRINT":
//           this.setIsPrinting(true)
//           break
//         case "STOP_PRINT":
//           this.setIsPrinting(false)
//           break
//         case "CANCEL_PRINT":
//           this.setIsPrinting(false)
//           break
//         case "START_HEATING":
//           this.setIsHeating(true)
//           break
//         case "STOP_HEATING":
//           this.setIsHeating(false)
//           break
//         case "UPDATE_TEMPERATURE":
//           this.setTemperature(data.temperature)
//           break
//         case "UPDATE_POSITION":
//           this.setPosition(data.position)
//           break
//         case "UPDATE_FILE_LIST":
//           this.setGcodeFileList(data.gcodeFileList)
//           break
//         case "UPDATE_PRINTER_INFO":
//           console.log(data.payload)
//           console.log("from App.js")
//         default:
//           break
//       }
//       console.log(message)
//     };
//
//     conn.onclose = () => {
//       console.log("Closing connection")
//       this.setIsConnected(false)
//     }
//   }
//
//   componentDidMount() {
//   }
//
  // render() {
  //   return (
  //     <div className="app">
  //       <Header isHomeSelected={this.state.isHomeSelected} setIsHomeSelected={this.setIsHomeSelected}/>
  //         {this.state.isHomeSelected? (
  //           <div className="app-body">
  //             <LeftPanelContext.Provider value={{temperature: this.state.temperature, gcodeFileList: this.state.gcodeFileList, isHeating: this.state.isHeating, isUploading: this.state.isUploading}}>
  //               <LeftPanel />
  //             </LeftPanelContext.Provider>
  //             <RightPanelContext.Provider value={{position: this.state.position, isPrinting: this.state.isPrinting}}>
  //               <RightPanel />
  //             </RightPanelContext.Provider>
  //           </div>
  //         )
  //         :
  //         (
  //           <Config />
  //         )}
  //     </div>
  //   );
  // }
// }

// <LeftPanelContext.Provider value={{temperature: this.state.temperature, gcodeFileList: this.state.gcodeFileList, isHeating: this.state.isHeating, isUploading: this.state.isUploading}}>
//   <LeftPanel />
// </LeftPanelContext.Provider>
// <RightPanelContext.Provider value={{position: this.state.position, isPrinting: this.state.isPrinting}}>
//   <RightPanel />
// </RightPanelContext.Provider>

export default App
