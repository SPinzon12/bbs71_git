import bcrypt
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import certifi

try:
    client = MongoClient(
            "mongodb+srv://admin:admin@cluster0.qiha6t5.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=certifi.where())
    print("DB online")
except ConnectionFailure:
    print('Error de conexion')
    
db = client['bbs71_db']
flights_col = db["flights"]
col = db["users"]


# Crear usuarios de aerolineas

pipeline = [
    { 
        "$group": {
            "_id": "$airline.name",
            "code": { "$first": "$airline.iata" }
        }
    }
]


var = flights_col.aggregate(pipeline)

for doc in var:
    name = doc["_id"].split(' ')[:2]
    user_name = "_".join(name)
    aerolinea = col.find_one({'user_id': doc['code']})
    if aerolinea is None:
    # Si no está, se agrega la entrada
    # La contraseña es el código de la aerolínea encriptado con bcrypt
        hashed_password = bcrypt.hashpw(doc['code'].encode('utf-8'), bcrypt.gensalt())
        col.insert_one({
            'user_id': doc['code'],
            'name': doc['_id'],
            'user': user_name,
            'password': hashed_password.decode('utf-8'),
            'type': 'airline'
        })
    print(doc)


#Crear usuarios de aeropuertos

pipeline = [
    {
        "$project": {
            "_id": 0,
            "originAirportName": "$departure.airport.originCityName",
            "originAirportCode": "$departure.airport.origin",
            "originAirportID": "$departure.airport.originAirportID",
            "destAirportName": "$arrival.airport.destCityName",
            "destAirportCode": "$arrival.airport.dest",
            "destAirportID": "$arrival.airport.destAirportID",
        }
    },
    {
        "$group": {
            "_id": {
                "airportName": "$originAirportName",
                "airportCode": "$originAirportCode",
                "airportID": "$originAirportID",
            },
        },
    },
    {
        "$project": {
            "_id": 0,
            "airportName": "$_id.airportName",
            "airportCode": "$_id.airportCode",
            "airportID": "$_id.airportID",
        },
    },
]

result = flights_col.aggregate(pipeline)

for doc in result:
    aeropuerto = col.find_one({'user_id': str(doc['airportID'])})
    if aeropuerto is None:
        hashed_password = bcrypt.hashpw(str(doc["airportID"]).encode('utf-8'), bcrypt.gensalt())
        col.insert_one({
            'user_id': str(doc["airportID"]),
            'name': f"{doc['airportName']} ({doc['airportCode']})",
            'user': str(doc["airportCode"]),
            'password': hashed_password.decode('utf-8'),
            'type': 'airport'
        })
    print(doc)
    
