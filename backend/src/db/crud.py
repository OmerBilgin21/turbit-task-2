from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

from src.schemas.turbine import Turbine, TurbineOut

from .get_db import get_db

TURBINE_DATA_COLLECTION_NAME = "turbineData"
TURBINE_COLLECTION_NAME = "turbines"


async def get_collection(collection_name: str) -> AsyncIOMotorCollection:
	"""Get the database collection.

	Args:
		collection_name (str): The name of the collection.

	Returns:
		AsyncIOMotorCollection: The collection.
	"""
	db = get_db()
	return db[collection_name]


async def retrieve_turbines() -> list[Turbine]:
	"""Retrieve turbines

	Returns:
		list[Turbine]: list of turbines
	"""
	turbinec = await get_collection(TURBINE_COLLECTION_NAME)
	return await turbinec.find({}).to_list(length=None)


async def retrieve_turbine_data(turbine_id: ObjectId) -> list[TurbineOut]:
	"""Return turbine data

	Args:
		turbine_id (ObjectId): id of given item

	Returns:
		list[dict]: list of turbine data
	"""
	turbinedc = await get_collection(TURBINE_DATA_COLLECTION_NAME)
	return await turbinedc.find({"turbineId": turbine_id}).to_list(length=None)
