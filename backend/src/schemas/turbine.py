from datetime import datetime, timezone
from typing import Any

from pydantic import Field

from .oid import Oid
from .out import Out


class TurbineOut(Out):
	Dat_Zeit: str = Field(alias="Dat/Zeit")
	Wind: str
	Rotor: str
	Leistung: str
	Azimut: str
	Prod_1: float = Field(alias="Prod. 1")
	Prod_2: float = Field(alias="Prod. 2")
	BtrStd_1: float = Field(alias="BtrStd 1")
	BtrStd_2: float = Field(alias="BtrStd 2")
	Gen1_minus: str = Field(alias="Gen1-")
	Lager: str
	Aussen: str = Field(alias="Außen")
	GetrT: str = Field(alias="GetrT")
	Status: float
	Spann: str
	Spann_1: str = Field(alias="Spann.1")
	Spann_2: str = Field(alias="Spann.2")
	Strom_minus: str = Field(alias="Strom-")
	Strom_minus_1: str = Field(alias="Strom-.1")
	Strom_minus_2: str = Field(alias="Strom-.2")
	CosPh: str
	Abgabe: float
	Bezug: float
	KH_Zahl1: float = Field(alias="KH-Zähl1")
	KH_Zahl2: float = Field(alias="KH-Zähl2")
	KH_DigiE: float = Field(alias="KH-DigiE")
	KH_DigiI: float = Field(alias="KH-DigiI")
	KH_Ana_1: float = Field(alias="KH-Ana-1")
	KH_Ana_2: float = Field(alias="KH-Ana-2")
	KH_Ana_3: float = Field(alias="KH-Ana-3")
	KH_Ana_4: float = Field(alias="KH-Ana-4")


class TurbineData(TurbineOut, Out):
	turbineId: Oid


class Turbine(Out):
	name: str
