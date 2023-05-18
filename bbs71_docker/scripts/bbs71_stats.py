import pymongo

# Conectarse a la instancia local de MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")

# Seleccionar la base de datos que deseas utilizar
db = client["bbs71_db"]

# Seleccionar la colección que deseas utilizar
flights_col = db["flights"]
users_col = db["users"]
stats_col = db["flight_stats"]

# Realizar una operación en la colección
# result = collection.find_one()


data = [doc for doc in users_col.find({})]
# routes = airline.aggregate(pipeline)
for doc in data:
    entity = stats_col.find_one({'user_id': doc["user_id"]})
    if entity is None:
        if doc["type"] == 'airline':
            iata = doc["user_id"]
            pipeline_match = {"$match": {"airline.iata": iata}}
        else:
            airportID = int(doc["user_id"])
            pipeline_match = {
                "$match": {
                    "$or": [
                        {"departure.airport.originAirportID": airportID},
                        {"arrival.airport.destAirportID": airportID}
                    ]
                }
            }
        pipeline = [
            # Buscamos los vuelos que tienen como origen o destino el aeropuerto dado
            pipeline_match,
            # Agrupamos por las rutas de origen y destino
            {
                "$group": {
                    "_id": {
                        "origin": "$route.from.origin",
                        "dest": "$route.to.dest",
                        "originCityName": "$departure.airport.originCityName",
                        "destCityName": "$arrival.airport.destCityName",
                        "distance": "$route.distance",
                    },
                    "countCancelled": {
                        "$sum": {"$cond": [{"$eq": ["$flightInfo.isCancelled", True]}, 1, 0]}
                    },
                    "countDiverted": {
                        "$sum": {"$cond": [{"$eq": ["$flightInfo.isDiverted", True]}, 1, 0]}
                    },
                    "countNonCancelledNonDiverted": {
                        "$sum": {
                            "$cond": [
                                {
                                    "$and": [
                                        {"$ne": ["$flightInfo.isCancelled", True]},
                                        {"$ne": ["$flightInfo.isDiverted", True]},
                                    ]
                                },
                                1,
                                0,
                            ]
                        },
                    },
                },
            },
            # Proyectamos los datos relevantes y realizamos el lookup en la misma colección
            {
                "$project": {
                    "origin": "$_id.origin",
                    "dest": "$_id.dest",
                    "count": "$countNonCancelledNonDiverted",
                    "cancelled": "$countCancelled",
                    "diverted": "$countDiverted",
                    "originCityName": "$_id.originCityName",
                    "destCityName": "$_id.destCityName",
                    "distance": "$_id.distance",
                    "_id": 0,
                },
            },
            {
                "$sort": {"count": -1},
            },
            {
                "$limit": 30,
            },
            {'$lookup': {
                'from': 'flights',
                'let': {
                    'origin': '$origin',
                    'dest': '$dest'
                },
                'pipeline': [
                    {'$match': {
                        '$expr': {
                            '$and': [
                                {'$eq': ['$route.from.origin', '$$origin']},
                                {'$eq': ['$route.to.dest', '$$dest']},
                                {'$ne': ['$route.actualElapsedTime', float('nan')]}
                            ]
                        }
                    }},
                    {'$addFields': {
                        'crsElapsedTimeInMinutes': {
                            '$let': {
                                'vars': {
                                    'parts': {'$split': ['$route.crsElapsedTime', ':']},
                                    'hours': {
                                        '$toInt': {
                                            '$arrayElemAt': [
                                                {'$split': [
                                                    '$route.crsElapsedTime', ':']}, 0
                                            ]
                                        }
                                    },
                                    'minutes': {
                                        '$toInt': {
                                            '$arrayElemAt': [
                                                {'$split': [
                                                    '$route.crsElapsedTime', ':']}, 1
                                            ]
                                        }
                                    }
                                },
                                'in': {'$add': [{'$multiply': ['$$hours', 60]}, '$$minutes']}
                            }
                        }
                    }},
                    {'$addFields': {
                        'actualElapsedTimeInMinutes': {
                            '$let': {
                                'vars': {
                                    'parts': {'$split': ['$route.actualElapsedTime', ':']},
                                    'hours': {
                                        '$toInt': {
                                            '$arrayElemAt': [
                                                {'$split': [
                                                    '$route.actualElapsedTime', ':']}, 0
                                            ]
                                        }
                                    },
                                    'minutes': {
                                        '$toInt': {
                                            '$arrayElemAt': [
                                                {'$split': [
                                                    '$route.actualElapsedTime', ':']}, 1
                                            ]
                                        }
                                    }
                                },
                                'in': {'$add': [{'$multiply': ['$$hours', 60]}, '$$minutes']}
                            }
                        }
                    }},
                    {'$group': {
                        '_id': {
                            'origin': '$route.from.origin',
                            'dest': '$route.to.dest'
                        },
                        'avgActualElapsedTime': {'$avg': '$actualElapsedTimeInMinutes'},
                        'avgCrsElapsedTime': {'$avg': '$crsElapsedTimeInMinutes'}
                    }},
                    {'$project': {
                        '_id': 0,
                        'avgActElapsedTime': {'$round': ['$avgActualElapsedTime', 0]},
                        'avgCrsElapsedTime': {'$round': ['$avgCrsElapsedTime', 0]}
                    }}
                ],
                'as': 'routeInfo'
            }}]
        routes = flights_col.aggregate(pipeline)
        stats_col.insert_one({
                'user_id': doc["user_id"],
                'type': doc["type"],
                "routes": list(routes),
                "stats": {}
            })
    print(entity)
    print("\n")
    



