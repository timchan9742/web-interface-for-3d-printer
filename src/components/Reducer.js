import React from "react"

const initialState = {
  isConnected: false,
  isPrinting: false,
  isHeating: false,
  position: {
    x: 0,
    y: 0,
    z: 0,
    e: 0
  },
  temperature: {
    extruder: 0,
    bed: 0,
    pi: 0
  },
  gcodeFileList: []
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case "CONNECT":
      return {...state, isConnected: true}
      break
    case "DISCONNECT":
      return {...state, isConnected: false}
      break
    case "START_PRINTING":
      return {...state, isPrinting: true}
      break
    case "STOP_PRINTING":
      return {...state, isPrinting: false}
      break
    case "START_HEATING":
      return {...state, isHeating: true}
      break
    case "STOP_HEATING":
      return {...state, isHeating: false}
      break
    case "UPDATE_POSITION":
      return {...state, position: action.payload.position}
      break
    case "UPDATE_TEMPERATURE":
      return {...state, temperature: action.payload.temperature}
      break
    case "UPDATE_FILE_LIST":
      return {...state, gcodeFileList: action.payload.gcodeFileList}
      break
    default:
      return state
      break
  }
}

export {initialState, reducer}
