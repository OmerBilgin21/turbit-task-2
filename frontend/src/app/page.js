"use client";
import Plot from "@/components/Plot";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import Dropdown from "react-dropdown";
import { useState, useEffect, useMemo } from "react";
import { getTurbines, getTurbineData } from "@/utils/axios";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
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
			console.log("=== endDate ===", endDate);
			console.log("=== startDate ===", startDate);

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
		console.log("=== startDate ===", startDate);
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
	}, [startDate, endDate]);

	return (
		<div className="graph-container">
			<Dropdown
				placeholder="Please select a turbine..."
				className="bg-slate-300 rounded-md text-white p-2 cursor-pointer"
				options={turbines?.map((e) => ({ label: e.name, value: e.id }))}
				onChange={(val) => {
					console.log("=== val  ===", val);
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
