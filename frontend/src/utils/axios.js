import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
	baseURL: API_URL,
	timeout: 1000,
});

export const getTurbines = async () => {
	return await api({
		method: "get",
		url: "/turbines",
	});
};

export const getTurbineData = async (turbineId) => {
	return await api({
		method: "get",
		url: `${turbineId}/data`,
	});
};
