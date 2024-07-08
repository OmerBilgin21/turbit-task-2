// external
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import Dropdown from "react-dropdown";

// hooks
import { useState, useEffect } from "react";

// components
import Plot from "./components/Plot";

// utils
import { getTurbines, getTurbineData } from "./utils/axios";

// styles
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";

function App() {
	const [turbines, setTurbines] = useState(null);
	const [turbineData, setTurbineData] = useState({});
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [selectedTurbine, setSelectedTurbine] = useState(null);
	const [power, setPower] = useState();
	const [windSpeed, setWindSpeed] = useState();
	useEffect(() => {
		const fetchTurbines = async () => {
			try {
				const res = await getTurbines();
				if (res.status === 200) {
					setTurbines(res.data);
				}
			} catch (error) {
				console.error("Error fetching turbines!", error);
				window.alert("Error fetching turbines!");
			}
		};

		fetchTurbines();
	}, []);

	useEffect(() => {
		const fetchTurbineData = async () => {
			if (!turbines || turbines.length === 0) return;

			try {
				const promises = turbines.map(async (turbine) => {
					const res = await getTurbineData(turbine["id"]);
					if (res.status === 200)
						return { id: turbine["id"], data: res.data };
					else return null;
				});

				const results = await Promise.all(promises);

				setTurbineData((prev) => {
					const newData = {};
					results.forEach((result) => {
						newData[result.id] = result.data;
					});
					return { ...prev, ...newData };
				});
			} catch (error) {
				console.alert("Error fetching turbine data!", error);
				window.alert("Error fetching turbine data!");
			}
		};

		fetchTurbineData();
	}, [turbines]);

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
		setWindSpeed(
			turbineData[selectedTurbine]?.map((item) => {
				if (
					"Wind" in item &&
					item["Wind"] &&
					dayjs(item["Dat/Zeit"]).toDate() >= startDate &&
					dayjs(item["Dat/Zeit"]) <= endDate
				)
					return parseFloat(item.Wind.replace(",", "."));
			})
		);
		setPower(
			turbineData[selectedTurbine]?.map((item) => {
				if (
					"Leistung" in item &&
					item["Leistung"] &&
					dayjs(item["Dat/Zeit"]).toDate() >= startDate &&
					dayjs(item["Dat/Zeit"]) <= endDate
				) {
					return parseFloat(item.Leistung.replace(",", "."));
				}
			})
		);
	}, [endDate, turbineData, selectedTurbine, startDate]);

	return (
		<div className="flex flex-col w-screen h-screen bg-slate-200 items-center justify-center gap-8">
			<Dropdown
				controlClassName="font-bold text-black border 
				border-b-black w-full border-opacity-100"
				placeholder="Please select a turbine..."
				className="bg-slate-300 rounded-md text-white p-2 
				cursor-pointer border border-opacity-80 border-black"
				options={turbines?.map((e) => ({
					label: e.name,
					value: e.id,
				}))}
				onChange={(val) => {
					setSelectedTurbine(val.value);
				}}
			/>
			<DatePicker
				selected={startDate}
				onChange={(newVal) => setStartDate(newVal)}
				showTimeSelect
			/>
			<Plot x={windSpeed} y={power} turbineName="turbine 1" />
			<DatePicker
				selected={endDate}
				onChange={(newVal) => setEndDate(newVal)}
				showTimeSelect
			/>
		</div>
	);
}

export default App;
