import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

import main
from src.db.crud import retrieve_turbines
from src.schemas.turbine import Turbine, TurbineOut

# ruff: noqa: S311, S101, PLR2004, PERF203

client = TestClient(app=main.app)


# because I'm only testing get endpoints,
# I did not use a mock db
def test_get_turbines() -> None:
	"""Test of /turbines endpoint"""
	response = client.get("/turbines")
	assert response.status_code == 200
	for data in response.json():
		try:
			Turbine(**data)
		except ValidationError as e:
			pytest.fail("Validation error at /turbines", e)


@pytest.mark.asyncio()
async def test_get_turbine_data() -> None:
	"""Test of /{turbine_id}/data endpoint"""
	turbine = await retrieve_turbines()
	turbine_id = str(turbine[0]["_id"])
	response = client.get(f"/{turbine_id}/data")

	assert response.status_code == 200
	for data in response.json():
		try:
			TurbineOut(**data)
		except ValidationError as e:
			pytest.fail("Validation error at /{turbine_id}/data", e)
