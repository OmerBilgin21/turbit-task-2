import Plot from "react-plotly.js";

const PlotComponent = ({ x, y, turbineName }) => {
	if (!x || !y || !turbineName) return;
	const data = [
		{
			x: x,
			y: y,
			mode: "lines",
			type: "scatter",
		},
	];
	const layout = {
		title: `Power Curve Plot for ${turbineName}`,
		xaxis: {
			title: "Wind Speed (m/s)",
			range: 50,
		},
		yaxis: {
			title: "Power (kW)",
		},
		width: "20em",
		height: "20em",
	};
	return (
		<div>
			<Plot data={data} layout={layout} />
		</div>
	);
};

export default PlotComponent;
