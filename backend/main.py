from datetime import datetime

import uvicorn
from bson import ObjectId
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.db.crud import retrieve_turbine_data, retrieve_turbines
from src.schemas.turbine import Turbine, TurbineOut

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/turbines", response_model=list[Turbine])
async def get_turbines() -> list[Turbine]:
	"""Returns turbines

	Returns:
		list[Turbine]: _description_
	"""
	return await retrieve_turbines()


@app.get("/{turbine_id}/data", response_model=list[TurbineOut])
async def get_turbine_data(turbine_id: str) -> list[TurbineOut]:
	"""Returns turbine data

	Args:
		turbine_id (str): id of given item

	Returns:
		list[TurbineOut]: list of data of a turbine
	"""
	res = await retrieve_turbine_data(turbine_id=ObjectId(turbine_id))

	updated = [
		{
			**item,
			"Dat/Zeit": datetime.strptime(  # noqa: DTZ007
				item["Dat/Zeit"],
				"%d.%m.%Y, %H:%M",
			).isoformat(),
		}
		for item in res
	]
	return sorted(updated, key=lambda x: datetime.fromisoformat(x["Dat/Zeit"]))


if __name__ == "__main__":
	uvicorn.run(
		"main:app",
		host="0.0.0.0",
		port=8000,
		reload=True,
		log_level="info",
	)
