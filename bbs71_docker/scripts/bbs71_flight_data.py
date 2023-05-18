from datetime import timedelta,datetime
import time
from pymongo import MongoClient
import pandas as pd

start_time = time.monotonic()
client = MongoClient("mongodb://localhost:27017/")
db = client['bbs71_db']
col = db["flights"]

ruta_archivo = r"/home/vagrant/BBS71/spark_app/Flights.csv"
df = pd.read_csv(ruta_archivo,nrows=700000)

bloques = [df[i:i+2000] for i in range(0, 600000, 2000)]

for bloque in bloques:
    flights = []
    for i, row in bloque.iterrows():
        flight_date_str = row["FlightDate"]
        flight_date = datetime.strptime(flight_date_str, "%Y-%m-%d")
        flight_number = "{} {}".format(row['IATA_Code_Operating_Airline'], row['Flight_Number_Marketing_Airline'])
        
        flight = {
            "departure":{
                "airport":{
                    "origin":row["Origin"],
                    "originAirportID": int(row["OriginAirportID"]),
                    "originCityName":row["OriginCityName"].split(',')[0]
                },
                "crsDepTime": row["CRSDepTime"],
                "depTime": row["DepTime"],
                "depDelay": float(row["DepDelay"]),
                "depDel15": float(row["DepDel15"]),
                "wheelsOff": row["WheelsOff"],
                "taxiOut": float(row["TaxiOut"])
            },
            "arrival":{
                "airport":{
                    "dest":row["Dest"],
                    "destAirportID":int(row["DestAirportID"]),
                    "destCityName":row["DestCityName"].split(',')[0]
                },
                "crsArrTime": row["CRSArrTime"],
                "arrTime": row["ArrTime"],
                "arrDelay": float(row["ArrDelay"]),
                "arrDel15": float(row["ArrDel15"]),
                "wheelsOn": row["WheelsOn"],
                "taxiIn": float(row["TaxiIn"])
            },
            "aircraft":{
                "tailNumber":row["Tail_Number"]
            },
            "airline":{
                "name":row["Airline"],
                "iata":row["IATA_Code_Operating_Airline"]
            },
            "route":{
                "from":{
                    "origin":row["Origin"],
                    "originAirportID": int(row["OriginAirportID"])
                },
                "to":{
                    "dest":row["Dest"],
                    "destAirportID": int(row["DestAirportID"])
                },
                "distance": float(row["Distance"]),
                "crsElapsedTime": row["CRSElapsedTime"],
                "actualElapsedTime": row["ActualElapsedTime"]
            },
            "flightInfo":{
                "flightDate": flight_date,
                "isCancelled": row["Cancelled"],
                "isDiverted": row["Diverted"],
                "airTime": row["AirTime"],
                "flightNumber": flight_number
            }
        }
        flights.append(flight)

    # inserta todos los documentos del bloque en la base de datos
    result = col.insert_many(flights)
    print(f"Inserción de {len(result.inserted_ids)} documentos completada.")

end_time = time.monotonic()
print(timedelta(seconds=end_time - start_time))