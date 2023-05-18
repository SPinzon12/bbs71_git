import json
import calendar
import sys
import paho.mqtt.client as mqtt
from pymongo import MongoClient
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count

# Crea una sesión de Spark
spark = SparkSession.builder.appName("BBS71App").getOrCreate()
spark.sparkContext.setLogLevel("OFF")

# Lee el archivo CSV con los datos de los vuelos
print("Comenzando a leer los archivos CSV...")
df = spark.read.csv(sys.argv[1], header=True, inferSchema=True)
print("Archivos CSV leídos correctamente.")

# Conectarse a la instancia local de MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["bbs71_db"]
print("Conectado a la base de datos")

# Seleccionar la colección que deseas utilizar
stats_col = db["flight_stats"]
# Limpiar la variable stats
stats_col.update_many({}, {"$set": {"stats": {}}})

# Configuración del cliente MQTT
mqtt_broker_host = "192.168.100.2"  # dirección del broker Mosquitto
mqtt_broker_port = 1884  # puerto del broker Mosquitto


# Callback que se ejecuta cuando se conecta al broker MQTT
def on_connect(client, userdata, flags, rc):
    print("Conectado al broker MQTT con código de resultado " + str(rc))
    client.subscribe("airport_airline_stats")  # suscripción a un topic específico


# Callback que se ejecuta cuando se recibe un mensaje MQTT
def on_message(client, userdata, msg):
    message = json.loads(msg.payload.decode())
    if message["type"] == "airline":
        airline_id = message['id']
        print(f"Received message from airline {airline_id}")
        # Filtrar los vuelos de la aerolínea recibida y que no estén cancelados ni desviados
        airline_flights = df.filter(df.IATA_Code_Operating_Airline == airline_id)
        num_total_flights = airline_flights.filter((df.Cancelled == 0) & (df.Diverted == 0)).count()
        # Filtrar los vuelos cancelados de la aerolínea recibida
        flights_cancelled = airline_flights.filter(df.Cancelled == 1)
        num_flights_cancelled = flights_cancelled.count()
        # Obtener los diferentes Tail_Number
        num_airplanes = airline_flights.select("Tail_Number").distinct().rdd.flatMap(lambda x: x).collect()
	# Count vuelo retrasado por aerolínea
        flights_delay = airline_flights.filter(df.DepDel15 == 1)
        num_flights_delay = flights_delay.count()
        # Count total de vuelos en temporada de vacaciones
        month = airline_flights.filter(df.Month == '06')
        num_total_flights_hs = month.count()
	# Se obtiene el mes con mayor cantidad de vuelos programados
        result = airline_flights.groupBy('Month').agg(count('*').alias('TotalFlights')).orderBy(col('TotalFlights').desc()).first()
        num_result = result['TotalFlights']
        month_max_flights = result['Month']
        month_name_max_flights = calendar.month_name[month_max_flights]
        stats ={
    	    "total_flights": num_total_flights,
    	    "flights_cancelled": num_flights_cancelled,
    	    "tail_numbers": len(num_airplanes),
    	    "flights_delay": num_flights_delay,
    	    "flights_holidaySeason": num_total_flights_hs,
            "flights_max_month": {"month": month_name_max_flights, "num_flights": num_result}
        }
        print(stats)
        stats_col.update_one({'user_id': airline_id}, {'$set': {'stats': stats}})
        print(f"Updated stats for airline {airline_id}")
    else:
        airport_id = message['id']
        print(f"Received message from airport {airport_id}")
        # total de llegadas al aeropuerto
        total_arrivals = df.filter(col("DestAirportID") == airport_id).filter((col("Cancelled") == 0) & (col("Diverted") == 0)).count()
        # total de salidas del aeropuerto
        total_departures = df.filter(col("OriginAirportID") == airport_id).filter((col("Cancelled") == 0) & (col("Diverted") == 0)).count()
        # total de vuelos cancelados que involucran al aeropuerto
        total_cancelled_flights = df.filter(((col("OriginAirportID") == airport_id) | (col("DestAirportID") == airport_id)) & (col("Cancelled") == 1)).count()
        # total de vuelos atrasados que salen del aeropuerto
        total_delay = df.filter(col("OriginAirportID") == airport_id).filter((col("DepDel15") == 1)).count()
        # total de vuelos durante la temporada de vacaciones (junio)
        total_flights_holiSeason = df.filter(((col("OriginAirportID") == airport_id) | (col("DestAirportID") == airport_id))).filter(col('Month') == '06').count()
        # mes en el que se realizan la mayoría de los vuelos que involucran al aeropuerto
        months_flights = df.filter(((col("OriginAirportID") == airport_id) | (col("DestAirportID") == airport_id))).groupBy('Month').agg(count('*').alias('TotalFlights')).orderBy(col('TotalFlights').desc()).first()
        num_result = months_flights['TotalFlights']
        month_max_flights = months_flights['Month']
        month_name_max_flights = calendar.month_name[month_max_flights]
        
        # estadísticas finales
        stats ={
            "total_arrivals": total_arrivals,
            "total_departures": total_departures,
            "flights_cancelled": total_cancelled_flights,
            "total_flights_delay": total_delay,
            "total_flights_hs": total_flights_holiSeason,
            "flight_max_month": {"month": month_name_max_flights, "num_flights": num_result}
        }
        stats_col.update_one({'user_id': airport_id}, {'$set': {'stats': stats}})
        print(stats)
        print(f"Updated stats for airport {airport_id}")


# Crea un cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(mqtt_broker_host, mqtt_broker_port)

# Inicia la recepción de mensajes MQTT
mqtt_client.loop_forever()

