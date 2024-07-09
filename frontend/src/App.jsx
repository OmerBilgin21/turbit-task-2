// external
import dayjs from "dayjs";
import Dropdown from "react-dropdown";

// hooks
import useSWR from "swr";
import { useState, useEffect } from "react";
import useTurbineData from "./hooks/useTurbineData";

// components
import Plot from "./components/Plot/Plot";
import CustomDatePicker from "./components/CustomDatepicker/CustomDatepicker";

// utils
import { fetcher } from "./utils/axios";

function App() {
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [selectedTurbine, setSelectedTurbine] = useState(null);
	const [power, setPower] = useState();
	const [windSpeed, setWindSpeed] = useState();

	const { data: turbines } = useSWR("/turbines", fetcher);
	const { turbineData } = useTurbineData(turbines);

	// I'm aware that the useEffect below is bad practice and unnecessary
	// but it really helps with usability because the dates are so far behind of present
	// and it's painful to go to 2016 using the datepickers
	useEffect(() => {
		setStartDate(
			dayjs(turbineData?.[selectedTurbine]?.[0]?.["Dat/Zeit"])?.toDate()
		);
		setEndDate(
			dayjs(
				turbineData?.[selectedTurbine]?.[
					turbineData?.[selectedTurbine]?.length - 1
				]?.["Dat/Zeit"]
			)?.toDate()
		);
	}, [turbineData, selectedTurbine, turbines]);

	useEffect(() => {
		if (!turbineData || !selectedTurbine || !turbineData[selectedTurbine])
			return;

		const filteredData = turbineData[selectedTurbine].filter(
			(item) =>
				dayjs(item["Dat/Zeit"]).toDate() >= startDate &&
				dayjs(item["Dat/Zeit"]) <= endDate
		);
		setWindSpeed(
			filteredData.map((item) => {
				if ("Wind" in item) return item["Wind"];
			})
		);
		setPower(
			filteredData.map((item) => {
				if ("Leistung" in item) {
					return item["Leistung"];
				}
			})
		);
	}, [endDate, turbineData, selectedTurbine, startDate]);

	return (
		<div className="app-container">
			<Dropdown
				controlClassName="dropdown-control"
				placeholder="Please select a turbine..."
				menuClassName="dropdown-menu"
				className="dropdown"
				options={turbines?.map((e) => ({
					label: e.name,
					value: e.id,
				}))}
				onChange={(val) => {
					setSelectedTurbine(val.value);
				}}
			/>
			<div className="flex flex-col gap-6 items-center justify-center">
				<CustomDatePicker
					selectedDate={startDate}
					onChange={(newVal) => setStartDate(newVal)}
				/>
				<Plot
					x={windSpeed}
					y={power}
					turbineName={
						turbines?.find((e) => e?.id === selectedTurbine)?.[
							"name"
						]
					}
				/>
				<CustomDatePicker
					selectedDate={endDate}
					onChange={(newVal) => setEndDate(newVal)}
				/>
			</div>
		</div>
	);
}

export default App;
