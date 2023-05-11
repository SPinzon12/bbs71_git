from datetime import timedelta,datetime
import time
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import certifi
import pandas as pd

start_time = time.monotonic()
try:
    client = MongoClient(
            "mongodb+srv://admin:admin@cluster0.qiha6t5.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=certifi.where())
    print("DB online")
except ConnectionFailure:
    print('Error de conexion')
db = client['bbs71_db']
col = db["flights"]

ruta_archivo = r"C:\Users\sampi\Documents\UAO\semestre_4\Redes\BBS71\db\Flights.csv"
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
















###Version 1

# start_time = time.monotonic()

# ruta_archivo = r"C:\Users\sampi\Documents\UAO\semestre_4\Redes\BBS71\Combined_Flights_2021.csv"
# df = pd.read_csv(ruta_archivo)

# flights_json = []

# with open(ruta_archivo, newline='') as csvfile:
#     reader = csv.DictReader(csvfile)
#     for row in reader:
#         flight = {
#             "departure":{
#                 "airport":{
#                     "origin":row["Origin"],
#                     "originAirportID":row["OriginAirportID"],
#                     "originCityName":row["OriginCityName"]
#                 },
#                 "crsDepTime": row["CRSDepTime"],
#                 "depTime":row["DepTime"],
#                 "depDelay":row["DepDelay"],
#                 "depDel15":row["DepDel15"],
#                 "wheelsOff":row["WheelsOff"],
#                 "taxiOut":row["TaxiOut"]
#             },
#             "arrival":{
#                 "airport":{
#                     "dest":row["Dest"],
#                     "destAirportID":row["DestAirportID"],
#                     "destCityName":row["DestCityName"]
#                 },
#                 "crsArrTime":row["CRSArrTime"],
#                 "arrTime":row["ArrTime"],
#                 "arrDelay":row["ArrDelay"],
#                 "arrDel15":row["ArrDel15"],
#                 "wheelsOn":row["WheelsOn"],
#                 "taxiIn":row["TaxiIn"]
#             },
#             "aircraft":{
#                 "tailNumber":row["Tail_Number"]
#             },
#             "airline":{
#                 "name":row["Airline"],
#                 "iata":row["IATA_Code_Operating_Airline"]
#             },
#             "route":{
#                 "from":{
#                     "origin":row["Origin"],
#                     "originAirportID":row["OriginAirportID"]
#                 },
#                 "to":{
#                     "dest":row["Dest"],
#                     "destAirportID":row["DestAirportID"]
#                 },
#                 "distance":row["Distance"],
#                 "crsElapsedTime":row["CRSElapsedTime"],
#                 "actualElapsedTime":row["ActualElapsedTime"]
#             },
#             "flightInfo":{
#                 "flightDate":row["FlightDate"],
#                 "isCancelled":row["Cancelled"],
#                 "isDiverted":row["Diverted"],
#                 "airTime":row["AirTime"]
#             }
#         }
#         # Agregar el objeto JSON a la lista de objetos JSON
#         flights_json.append(flight)


# try:
#     client = MongoClient(
#             "mongodb+srv://admin:admin@cluster0.qiha6t5.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=certifi.where())
#     print("DB online")
# except ConnectionFailure:
#     print('Error de conexion')
# db = client['bbs71_db']
# col = db["flights_2021"]

# # Insertar los objetos JSON en la colección
# result = col.insert_many(flights_json)

# # Imprimir el número de documentos insertados
# print(f"{len(result.inserted_ids)} documentos insertados")
# end_time = time.monotonic()
# print(timedelta(seconds=end_time - start_time))

# # end_time = time.monotonic()
# # print(timedelta(seconds=end_time - start_time))