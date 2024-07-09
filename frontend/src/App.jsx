// external
import dayjs from "dayjs";
import Dropdown from "react-dropdown";

// hooks
import useSWR from "swr";
import { useState, useEffect } from "react";
import useTurbineData from "./hooks/useTurbineData";

// components
import Plot from "./components/Plot";
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
		<div className="flex justify-center items-center w-screen h-screen bg-slate-100 overflow-scroll gap-16">
			<Dropdown
				controlClassName="flex justify-center items-center font-bold 
				text-black border border-0
				border-b-[1.5px] border-b-black border-opacity-100 bg-inherit"
				placeholder="Please select a turbine..."
				menuClassName="flex flex-col gap-4 mt-4 bg-white bg-inherit
				border border-opacity-60 border-dashed
				border-black w-28 -ml-[8.6px] items-center justify-center 
				rounded-b-lg border-y-0 pb-4"
				className=" rounded-lg text-black p-2 
				cursor-pointer border border-opacity-60 border-dashed
				border-black w-28 bg-white"
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
