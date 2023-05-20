import sys
from pyspark.sql.functions import col, when, from_unixtime, floor, concat_ws, format_number
from pyspark.sql.types import IntegerType
from pyspark.sql import SparkSession

# Función para convertir un valor entero en formato de 24 horas
def convert_to_24h_format(x):
    try:
        return from_unixtime(x, 'HH:mm')
    except:
        return "00:00"

# Función para convertir minutos en formato HH:MM
def convert_to_hours(mins):
    hours = floor(mins / 60)
    minutes = mins % 60
    return concat_ws(":", format_number(hours, 0), format_number(mins, 0))

# Crea una sesión de Spark
spark = SparkSession.builder.appName("flights").getOrCreate()
spark.sparkContext.setLogLevel("OFF")
# Ruta del archivo de datos
ruta_archivo = sys.argv[1]

# Lee el archivo CSV de datos
df = spark.read.option("header", True).option("inferSchema", True).csv(ruta_archivo)

# Convierte la columna "DepDelay" a entero si el vuelo no ha sido cancelado o desviado
df = df.withColumn("DepDelay", when((col("Diverted") == 0) & (col("Cancelled") == 0), col("DepDelay").cast(IntegerType())).otherwise(col("DepDelay")))
df = df.withColumn("CRSDepTime", from_unixtime(col("CRSDepTime"), 'HH:mm'))
df = df.withColumn("DepTime", when((col("Diverted") == 0) & (col("Cancelled") == 0), convert_to_24h_format(col("DepTime").cast(IntegerType()))).otherwise(col("DepTime")))
df = df.withColumn("WheelsOff", when((col("Diverted") == 0) & (col("Cancelled") == 0), convert_to_24h_format(col("WheelsOff").cast(IntegerType()))).otherwise(col("WheelsOff")))

df = df.withColumn("ArrDelay", when((col("Diverted") == 0) & (col("Cancelled") == 0), col("ArrDelay").cast(IntegerType())).otherwise(col("ArrDelay")))
df = df.withColumn("CRSArrTime", from_unixtime(col("CRSArrTime"), 'HH:mm'))
df = df.withColumn("ArrTime", when((col("Diverted") == 0) & (col("Cancelled") == 0), convert_to_24h_format(col("ArrTime").cast(IntegerType()))).otherwise(col("ArrTime")))
df = df.withColumn("WheelsOn", when((col("Diverted") == 0) & (col("Cancelled") == 0), convert_to_24h_format(col("WheelsOn").cast(IntegerType()))).otherwise(col("WheelsOn")))
df = df.withColumn("AirTime", when((col("Diverted") == 0) & (col("Cancelled") == 0), convert_to_hours(col("AirTime").cast(IntegerType()))).otherwise(col("AirTime")))
df = df.withColumn("CRSElapsedTime", from_unixtime(col("CRSElapsedTime") * 60, 'HH:mm'))
df = df.withColumn("ActualElapsedTime", when((col("Diverted") == 0) & (col("Cancelled") == 0), convert_to_hours(col("ActualElapsedTime").cast(IntegerType()))).otherwise(col("ActualElapsedTime")))

# Columnas que se guardarán en el archivo CSV
cols = [
    'Origin',
    'OriginAirportID',
    'OriginCityName',
    'Dest',
    'DestAirportID',
    'DestCityName',
    'Tail_Number',
    'Airline',
    'IATA_Code_Operating_Airline',
    'Distance',
    'CRSElapsedTime',
    'ActualElapsedTime',
    'FlightDate',
    'Cancelled',
    'Diverted',
    'AirTime',
    'CRSDepTime',
    'DepTime',
    'DepDelay',
    'DepDel15',
    'WheelsOff',
    'TaxiOut',
    'CRSArrTime',
    'ArrTime',
    'ArrDelay',
    'ArrDel15',
    'WheelsOn',
    'TaxiIn',
    'Flight_Number_Marketing_Airline',
    'Month',
    'DayofMonth'
]

# Seleccionar las columnas especificadas y guardar en un nuevo DataFrame
selected_df = df.select(*[col(c) for c in cols])

# Guardar el nuevo DataFrame en formato CSV
selected_df.write.format("csv").option("header", "true").mode("overwrite").save(sys.argv[2])

