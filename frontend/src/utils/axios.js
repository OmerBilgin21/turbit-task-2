import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json; charset=utf-8",
	},
});

export const fetcher = (url) => {
	return api.get(url).then((res) => {
		if (!res.data) {
			throw Error(res.data.message);
		}

		return res.data;
	});
};

export const getTurbineData = async (turbineId) => {
	return await api({
		method: "get",
		url: `${turbineId}/data`,
	});
};
