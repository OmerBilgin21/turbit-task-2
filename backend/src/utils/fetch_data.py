from asyncio import run
from pathlib import Path

import pandas as pd
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

CSV_1 = Path(Path.cwd(), "Turbine1.csv")
CSV_2 = Path(Path.cwd(), "Turbine2.csv")


def get_db() -> AsyncIOMotorClient:
	"""Get the database client.

	Returns
		MongoClient: The database client.
	"""
	client = AsyncIOMotorClient(host="localhost", port=27017)
	return client["turbit-t2"]


# ruff: noqa: ERA001
def read_csv() -> tuple[pd.DataFrame]:
	"""Reads and returns csv data

	Returns:
		tuple[pd.DataFrame]: DataFrame tuple
	"""
	# second row seemed to be the units of the headers and
	# it was abcent situationally (e.g. status)
	# Therefore I skipped the second row while reading/writing to db
	csv_1_read = pd.read_csv(CSV_1, delimiter=";", skiprows=[1])
	csv_2_read = pd.read_csv(CSV_2, delimiter=";", skiprows=[1])
	return csv_1_read, csv_2_read


def adjust_data(data: pd.DataFrame, id_to_assign: ObjectId) -> list[dict]:
	"""Adjust DataFrame data"""
	data_list = data.to_dict(orient="records")
	new_list = []
	for row in data_list:
		newd = {}
		for key, val in row.items():
			new_key = key
			new_val = val
			should_not_touch = ("Dat/Zeit", "turbineId")

			if isinstance(key, str):
				new_key = key.strip()

			if (
				isinstance(new_val, str)
				and "," in new_val
				and new_key not in should_not_touch
			):
				new_val = new_val.replace(",", ".")

			newd[new_key] = (
				float(new_val) if new_key not in should_not_touch else new_val
			)
		newd["turbineId"] = id_to_assign
		new_list.append(newd)
	return new_list


async def write_to_db() -> None:
	"""Write DataFrames to db"""
	db = get_db()
	turbinesc = db["turbines"]
	turbinec = db["turbineData"]
	data1, data2 = read_csv()

	data1 = adjust_data(data1, ObjectId())
	data2 = adjust_data(data2, ObjectId())
	await turbinesc.insert_many(
		[
			{"name": "turbine 1", "_id": data1[0]["turbineId"]},
			{"name": "turbine 2", "_id": data2[0]["turbineId"]},
		],
	)
	await turbinec.insert_many(data1)
	await turbinec.insert_many(data2)


run(write_to_db())
