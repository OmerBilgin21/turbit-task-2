import useSWR from "swr";
import { getTurbineData } from "../utils/axios";

const fetchTurbineData = async (turbines) => {
	const promises = turbines.map(async (turbine) => {
		const res = await getTurbineData(turbine.id);
		if (res.status === 200) {
			return { id: turbine.id, data: res.data };
		}
		return null;
	});

	const results = await Promise.all(promises);

	return results.reduce((acc, result) => {
		if (result) {
			acc[result.id] = result.data;
		}
		return acc;
	}, {});
};

const useTurbineData = (turbines) => {
	const { data, error } = useSWR(
		turbines ? ["/turbineData", turbines] : null,
		() => fetchTurbineData(turbines),
		{ revalidateOnFocus: false }
	);

	return {
		turbineData: data,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useTurbineData;
