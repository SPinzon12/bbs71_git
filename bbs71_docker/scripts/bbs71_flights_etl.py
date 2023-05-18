import pandas as pd
from datetime import datetime

# Función para convertir un valor entero en formato de 24 horas
def convert_to_24h_format(x):
    try:
        return datetime.time(datetime.strptime(str(int(x)).zfill(4), '%H%M')).strftime('%H:%M')
    except (ValueError, TypeError):
        return "00:00"

# Función para convertir minutos en formato HH:MM
def convert_to_hours(mins):
    hours = mins // 60
    minutes = mins % 60
    return f"{hours:02d}:{minutes:02d}"

# Ruta del archivo de datos
ruta_archivo = r"/home/vagrant/BBS71/spark_app/Combined_Flights_2021.csv"

# Lista de columnas a utilizar
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
    'Flight_Number_Marketing_Airline'
]

# Lee el archivo CSV de datos y utiliza las columnas especificadas
df = pd.read_csv(ruta_archivo, nrows=700000, usecols=cols, parse_dates=['FlightDate'])

# Convierte la columna "DepDelay" a entero si el vuelo no ha sido cancelado o desviado
df["DepDelay"] = df.apply(lambda row: int(row["DepDelay"]) if (row['Diverted'] != 1 and row['Cancelled'] != 1) else row["DepDelay"], axis=1)
df["CRSDepTime"] = df["CRSDepTime"].astype(str).apply(convert_to_24h_format)
df['DepTime'] = df.apply(lambda row: convert_to_24h_format(int(row['DepTime'])) if (row['Diverted'] != 1 and row['Cancelled'] != 1) else row['DepTime'], axis=1)
df["WheelsOff"] = df.apply(lambda row: convert_to_24h_format(int(row["WheelsOff"])) if (row['Diverted'] != 1 and row['Cancelled'] != 1) else row["WheelsOff"], axis=1)
df['ArrDelay'] = df.apply(lambda row: int(row['ArrDelay']) if (row['Diverted'] != 1 and row['Cancelled'] != 1) else row['ArrDelay'], axis=1)
df["CRSArrTime"] = df["CRSArrTime"].astype(str).apply(convert_to_24h_format)
df['ArrTime'] = df.apply(lambda row: convert_to_24h_format(int(row['ArrTime'])) if (row['Diverted'] != 1 and row['Cancelled'] != 1) else row['ArrTime'], axis=1)
df["WheelsOn"] = df.apply(lambda row: convert_to_24h_format(int(row["WheelsOn"])) if (row['Diverted'] != 1 and row['Cancelled'] != 1) else row["WheelsOn"], axis=1)
df["AirTime"] = df.apply(lambda row: convert_to_hours(int(row["AirTime"])) if (row['Diverted'] != 1 and row['Cancelled'] != 1) else row["AirTime"], axis=1)
df["CRSElapsedTime"] = df["CRSElapsedTime"].astype(int).apply(convert_to_hours)
df['ActualElapsedTime'] = df.apply(lambda row: convert_to_hours(int(row['ActualElapsedTime'])) if (row['Diverted'] != 1 and row['Cancelled'] != 1) else row['ActualElapsedTime'], axis=1)

# Crea una nueva variable para guardar el DataFrame modificado
df_mod = df.copy()

# Exporta el DataFrame modificado a un archivo CSV
df_mod.to_csv('Flights.csv', index=False)

# Imprime el DataFrame modificado
print(df_mod)



