import React from "react"
import CanvasJSReact from '../assets/canvasjs.react'
import "./Thermal.css"

var CanvasJS = CanvasJSReact.CanvasJS
var CanvasJSChart = CanvasJSReact.CanvasJSChart

var dataPoints1 = [];
var dataPoints2 = [];
var updateInterval = 500;
//initial values
const count = 20
var yValue1 = 100;
var yValue2 = 57;
var xValue = 5;

class ThermalChart extends React.Component {

	constructor() {
		super();
		this.updateChart = this.updateChart.bind(this);
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
	}
	componentDidMount(){
		this.updateChart(count);
		setInterval(this.updateChart, updateInterval);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.displayChart != nextProps.displayChart) {
			return true
		} else {
			return false
		}
  }

	toggleDataSeries(e) {
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}
	updateChart(count) {
		if(this.props.displayChart) {
			count = count || 1;
			for(var i = 0; i < count; i++) {
				// xValue += 2;
				xValue = new Date();
				// yValue1 = Math.floor(Math.random() * (130 - 100 + 1) + 100);
				// yValue2 = Math.floor(Math.random() * (70 - 57 + 1) + 57);
				dataPoints1.push({
				  x: xValue,
				  y: this.props.temperature.extruder
				});
				dataPoints2.push({
				  x: xValue,
				  y: this.props.temperature.bed
				});
			}
			if(dataPoints1.length >= count * 2) {
				dataPoints1.splice(0, count)
				dataPoints2.splice(0, count)
			}
			const options = {
				height: 320,
				zoomEnabled: true,
				theme: "light2",
				title: {
					text: "Temperature °C"
				},
				axisX: {
					valueFormatString: "hh:mm TT",
					labelAngle: 0,
					title: "Time"
				},
				axisY:{
					suffix: "°C"
				},
				toolTip: {
					shared: true
				},
				legend: {
					cursor:"pointer",
					verticalAlign: "top",
					fontSize: 15,
					fontColor: "dimGrey",
					itemclick : this.toggleDataSeries
				},
				data: [
					{
						type: "line",
						xValueFormatString: "hh:mm TT",
						yValueFormatString: "#,##0 °C",
						showInLegend: true,
						name: "Extruder",
						dataPoints: dataPoints1
					},
					{
						type: "line",
						xValueFormatString: "hh:mm TT",
						yValueFormatString: "#,##0 °C",
						showInLegend: true,
						name: "Bed" ,
						dataPoints: dataPoints2
					}
				]
			}
			try {
				this.chart.options = options
				this.chart.options.data[0].legendText = " Extruder - " + this.props.temperature.extruder + " °C";
				this.chart.options.data[1].legendText = " Bed - " + this.props.temperature.bed + " °C";
				this.chart.render();
			}
			catch (e) {
				// console.log("this solve some bugs when switching between header options");
      }
		}
	}

	render() {

		if(this.props.displayChart) {
			return (
				<div className="thermal-chart" >
					<CanvasJSChart
						onRef={ref => this.chart = ref}
					/>
				</div>
			)
		}
		else {
			return (
				<div></div>
			)
		}

	}
}

export default ThermalChart
