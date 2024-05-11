# Web Interface for 3D Printer

![Screen Recording 2024-05-08 at 15 55 36](https://github.com/timchan9742/web-interface-for-3d-printer/assets/167204379/ac307209-208c-46ac-bd0e-7a0d0e45ffc1)

## Introduction

Welcome to the repository! This repository contains the source code for the web interface built using React JS, designed specifically to interact with a self-developed 3D printer. The interface provides users with a comprehensive platform to control various aspects of the printer's functionality conveniently through a web browser.

## Features

- **Real-Time Temperature Monitoring**: Users can monitor the temperatures of the extruder and the heating bed through dynamically updating graphs, providing crucial insights into the printer's status.

- **Printer Control**: The interface allows users to control the printer (e.g. move the printer head, set extruder/bed temperatures, change printer settings, etc).

- **Printing Tasks**: Users can send printing tasks directly through the web interface, streamlining the printing process.

- **Console Interface**: The console feature enables users to send Gcode commands or predefined commands to the printer, offering advanced control capabilities.

## System Architecture

This web interface communicates with the local 3D printer control system, which is developed in Python and resides in a separate repository([here](https://github.com/timchan9742/control-system-for-3d-printer)). The control system serves as the intermediary between the web interface and the printer hardware, handling requests and executing commands sent from the interface.
