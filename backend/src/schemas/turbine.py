from pydantic import Field

from .oid import Oid
from .out import Out


class TurbineOut(Out):
	Dat_Zeit: str = Field(alias="Dat/Zeit")
	Wind: float
	Rotor: float
	Leistung: float
	Azimut: float
	Prod_1: float = Field(alias="Prod. 1")
	Prod_2: float = Field(alias="Prod. 2")
	BtrStd_1: float = Field(alias="BtrStd 1")
	BtrStd_2: float = Field(alias="BtrStd 2")
	Gen1_minus: float = Field(alias="Gen1-")
	Lager: float
	Aussen: float = Field(alias="Außen")
	GetrT: float = Field(alias="GetrT")
	Status: float
	Spann: float
	Spann_1: float = Field(alias="Spann.1")
	Spann_2: float = Field(alias="Spann.2")
	Strom_minus: float = Field(alias="Strom-")
	Strom_minus_1: float = Field(alias="Strom-.1")
	Strom_minus_2: float = Field(alias="Strom-.2")
	CosPh: float
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
