# 🐧 BBS-71 - Blackbird
Blackbird es una aplicación web que proporciona un dashboard de información detallada sobre vuelos y aerolíneas que operan en los aeropuertos. La aplicación lee información de dos colecciones de MongoDB que contienen datos sobre vuelos, como la ciudad de origen y destino, si ya despegó, si aterrizó o si se canceló. La aplicación está diseñada para ser utilizada por dos tipos de usuarios: aeropuertos y aerolíneas. Los aeropuertos pueden ver información detallada sobre los vuelos que operan en sus instalaciones, incluyendo qué aerolíneas están activas en el aeropuerto. Las aerolíneas pueden ver información sobre los vuelos que operan en los aeropuertos que les interesan, lo que les permite tomar decisiones informadas sobre sus operaciones y programación de vuelos. Con Blackbird, los usuarios pueden obtener fácilmente una visión general de la actividad y tomar decisiones informadas basadas en los datos.
## Instalación
Para el funcionamiento de este proyecto se utilizará Docker, que es una plataforma de contenedores que permite empaquetar una aplicación junto con todas sus dependencias en un contenedor virtualizado que se puede ejecutar en cualquier sistema operativo, tambien usaremos Apache Spark para aprovechar su capacidad de procesamiento distribuido y su capacidad para manejar grandes conjuntos de datos.<br>
Recuerda que como vamos a usar dos maquinas virtuales, ambas necesitaran tener instalados estos elementos.<br>
Para instalarlos puedes usar los siguientes comandos:<br>
### Vagrantfile: 
Para el despligue de este proyecto necesitaremos una maquina virtual Linux Ubuntu 22.04 con una IP en especifico, la `192.168.100.2`, el motivo de esto es porque la configuración del proyecto esta mapeada sobre dicha IP, por lo que usar otra IP diferente podria generar conflictos y pasos innecesarios, y por ende hemos decidido especificarla:<br>
Si aun no tiene Vagrant, puede descargarlo de la pagina oficial:<br> 
https://developer.hashicorp.com/vagrant/downloads?product_intent=vagrant <br>
```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  if Vagrant.has_plugin? "vagrant-vbguest"
    config.vbguest.no_install  = true
    config.vbguest.auto_update = false
    config.vbguest.no_remote   = true
  end
  
  config.vm.define :servidorUbuntu do |servidorUbuntu|
    servidorUbuntu.vm.box = "bento/ubuntu-22.04"
    servidorUbuntu.vm.network :private_network, ip: "192.168.100.2"
    servidorUbuntu.vm.hostname = "servidorUbuntu"
    servidorUbuntu.vm.box_download_insecure=true
    servidorUbuntu.vm.provider "virtualbox" do |v|
      v.cpus = 4
      v.memory = 6144      
    end
  end

  config.vm.define :clienteUbuntu do |clienteUbuntu|
    clienteUbuntu.vm.box = "bento/ubuntu-22.04"
    clienteUbuntu.vm.network :private_network, ip: "192.168.100.3"
    clienteUbuntu.vm.hostname = "clienteUbuntu"
    clienteUbuntu.vm.box_download_insecure=true
  end
  
  config.vm.provider :virtualbox do |vb|
    vb.gui = true
  end
end
```

### Docker:
Necesitaremos Docker en las 2 maquinas de servidorUbuntu y clienteUbuntu.<br>
1. Quitar versiones de docker anteriores:<br>
`sudo apt-get remove docker docker-engine docker.io containerd runc`<br>
y luego  `sudo apt-get update`
2. Instala paquetes para permitir que APT use un repositorio sobre HTTPS: <br>
```
 sudo apt-get install \
 apt-transport-https \
 ca-certificates \
 curl \
 gnupg-agent \
 software-properties-common
 ```
 
3. Agregue la clave GPG oficial de docker:<br>
`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
4. Agregue la clave:<br>
`sudo apt-key fingerprint 0EBFCD88`
5. Agregue repositorio estable:<br>
```
sudo add-apt-repository \
 "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
 $(lsb_release -cs) \
 stable"
 ```
 
6. Instale la ultima version de docker:<br>
`sudo apt-get update`<br>
`sudo apt-get install docker-ce docker-ce-cli containerd.io`
### docker-compose:
1. Instale DockerCompose:<br>
`sudo apt-get install docker-compose-plugin`<br>
2. Cree el archivo ~/.vimrc para trabajar con Yaml:<br>
`vim ~/.vimrc`<br>
3. Agregar la siguiente configuración para trabajar conlos archivos yaml.<br>

```
" Configuracion para trabajar con archivos yaml
au! BufNewFile,BufReadPost *.{yaml,yml} set filetype=yaml foldmethod=indent
autocmd FileType yaml setlocal ts=2 sts=2 sw=2 expandtab
```

### Apache Spark:
 1. Instala paquetes de Java:<br>
`sudo apt install -y openjdk-18-jdk`<br>
 2. Creamos el archivo jdk18.sh para la configuración:<br>
```
cat <<EOF | sudo tee /etc/profile.d/jdk18.sh
export JAVA_HOME=/usr/lib/jvm/java-1.18.0-openjdk-amd64
export PATH=\$PATH:\$JAVA_HOME/bin
EOF
```
3. Despues de este, hacemos:<br>
`source /etc/profile.d/jdk18.sh`
4. Crearemos el dictorio en donde guardaremos los archivos de Spark:<br>
`mkdir labSpark`<br>
`cd labSpark`
5. Descargamos el archivo comprimido de Spark:<br>
`wget https://dlcdn.apache.org/spark/spark-3.4.0/spark-3.4.0-bin-hadoop3.tgz`
6. Y lo descomprimimos:<br>
`tar -xvzf spark-3.4.0-bin-hadoop3.tgz`
7. Luego entramos a `/labSpark/spark-3.3.1-bin-hadoop3/conf` y hacemos una copia del archivo de configuración:<br>
`cp spark-env.sh.template spark-env.sh`<br>
Y introducimos estas instrucciones:<br>
En servidorUbuntu:<br>
```
SPARK_LOCAL_IP=192.168.100.2
SPARK_MASTER_HOST=192.168.100.2
```
En clienteUbuntu:<br>
```
SPARK_LOCAL_IP=192.168.100.3
SPARK_MASTER_HOST=192.168.100.2
```
### Librerias:
1. Editor de texto Vim:<br>
`sudo apt-get install vim -y`<br>
2. Zip y Unzip para descomprimir archivos:<br>
`sudo apt-get install zip unzip -y`<br>
### Pip y librerias de Python:
1. Instalamos PIP y Python:<br>
`sudo apt-get install python3`<br>
`sudo apt-get install pip`
2. Instalamos la libreria Pymogno:<br>
`sudo pip install pymongo`
3. Instalamos la libreria del Broker de mensajeria MQTT:<br>
`sudo pip install paho-mqtt`
4. Instalamos la libreria de PySpark:<br>
`sudo pip install pyspark`
## Configuración
Para configurar el contenedor Docker del proyecto, es necesario conocer los archivos Dockerfile que se han utilizado para crear las imágenes del contenedor. Cuando se descargue dentro de la carpeta `bbs71_git`, tendremos las siguientes subcarpetas `/bbs71_app` en donde se encuentran los archivos de toda la pagina como HTML, CSS y scripts, en `/bbs71_backend` tenemos todo lo relacionado con los microservicios y el apigateway y en `/bbs71_dockerfile` tenemos todos los archivos de la aplicacion incluido el docker-compose para hacer el despliegue, pero de aqui en adelante solo trabajaremos en el directorio de `/bbs71_git/bbs71_docker` el cual contiene las subcarpetas donde estan los archivos necesario para la creacion de cada una de las imagenes del proyecto, las carpetas en cuestion son: `/db` correspondiende a la base de datos de mongodb, `/app` donde se encuentra todos los archivos de nuestra aplicacion web,`/backend` donde estan los microservicios, `/haproxy` donde esta nuestro balanceador, `/mqtt` el broker de mensajeria que usaremos, `/spark_app` donde estan los archivos que usaremos para el procesamiento de spark, dentro de cada carpeta se ha creado el Dockerfile que contienen las instrucciones para construir diferentes imágenes de Docker, cada una con su propia configuración y dependencias específicas. A continuación, se presentara una breve descripción y captura de cada uno de los Dockerfiles en sus repectivas carpetas utilizados en el proyecto.

### bbs71_docker:<br>

#### 1. Docker-compose principal<br>
Este es el docker-compose.yml principal, encargado de desplegar todos los servicios que necesitamos:<br>
```
version: "3"

services:
  mongodb:
    image: mongo:4.0
    restart: always
    volumes:
      - ./db/mongo/data:/data/db
      - ./db/flights.json:/json/flights.json
      - ./db/users.json:/json/users.json
      - ./db/flight_stats.json:/json/flight_stats
    ports:
      - 27017:27017

  api-gateway:
    image: bbs71/api-gateway:0.0
    ports:
      - "3000:3000"
    links:
      - microuser
      - microairlines
      - microairports

  microuser:
    image: bbs71/micro-user:0.0
    links:
      - mongodb

  microairlines:
    image: bbs71/micro-airlines:0.0
    links:
      - mongodb
    depends_on:
      - mqtt

  microairports:
    image: bbs71/micro-airports:0.0
    links:
      - mongodb
    depends_on:
      - mqtt

  app-1:
    image: bbs71/app:0.0
    depends_on:
      - api-gateway
      
  app-2:
    image: bbs71/app:0.0
    depends_on:
      - api-gateway

  haproxy:
    image: bbs71/haproxy:0.0
    ports:
      - "1080:80"
    links:
      - app-1
      - app-2

  mqtt:
    image: eclipse-mosquitto
    restart: always
    volumes:
      - ./mqtt/mosquitto/config:/mosquitto/config
      - ./mqtt/mosquitto/data:/mosquitto/data
      - ./mqtt/mosquitto/log:/mosquitto/log
    ports:
      - 1883:1883
      - 9001:9001
```
En el docker-compose se definen las imagenes de cada uno de los servicios y los parametros que se van a usar, para este proyecto utilizamos los siguientes servicios:

#### 2. /db:

##### Mongodb:<br>
Es una imagen ya construida y disponible en Docker Hub de la base de datos mongodb, a la cual, se le aplico volumenes con el fin de copiar la data en archivos .json dentro de contenedor, ya que necesitaremos que la conexion de mongo con los demas servicios se expuso el puerto 27017, cabe recalcar que este servicio solo podra ser ejecuta dentro de la maquina de 'servidorUbuntu'.<br>
<br>
```
version: '3'

services:
    mongodb:
        image: mongo:4.0
        restart: always
        container_name: mongodb
        volumes:
            - ./mongo/data:/data/db
            - ./flights.json:/json/flights.json
            - ./users.json:/json/users.json
            - ./flight_stats.json:/json/flight_stats.json
        ports:
            - 27017:27017
```
Aqui creamos el contenedor de mongo sacado de dockerhub, al cual le aplicaremos volumenes con los archivos .json, los cuales deben de estar dentro del contenedor.<br>

#### 3. /backend:
Aqui se encuentran los 3 microservicios y el apigetway, para la creacion de la imagen de cada uno ellos se uso el mismo dockerfile, con una ligera diferencia como algunos parametros y lo mas importante el puerto por donde salen, pero en si tienen la misma estructura:<br>
##### Dockerfile de los microservicios y apigateway
```
FROM node:16
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY .env ./

RUN mkdir -p ./src
COPY ./src ./src
EXPOSE 3000
CMD ["node", "./src/index.js"]
```
<br>
Para ejecutar los microservicios de Blackbird, es necesario contar con Nodejs y descargar la librería de NPM. En el WORKDIR se especificará el directorio de trabajo y se copiarán los archivos package.json, que contienen las dependencias que se utilizarán, como Axios, el cual se encargará de monitorear los puertos no expuestos de los otros microservicios.

##### Apigateway:<br>
Es el servicio encargado de tomar los puertos de cada uno de los microservicios (microuser, microairlines y microairports) ya que los microservicios no se comunican entre ellos, y con el fin de no exponer multiples puertos y su vez simplificar la obtencion de los datos, constrimos este apigateway para concentrar las multiples salidas de los 3 puertos en uno solo, que en este caso es el puerto 3000.

##### Microuser:<br>
Este es el microservicio encargado de controlar y autenticar a los usuarios que esten disponibles en la base de datos, estara conectado a la base de datos, y transmitiendo por el puerto 3001.

##### MicroAirlines:<br>
MicroAirlines es el microservicio encargado de gestionar la información relacionada con las aerolíneas y sus tablas de informacion, estara conectado a la base de datos y dependera del broker de mensajeria MQTT, y transmitiendo por el puerto 3002.

##### MicroAirports:<br>
MicroAirports cumple un papel similar a MicroAirlines, solo que su funcion esta dedicada unicamente a los aeropuertos, estara conectado a la base de datos y dependera del broker de mensajeria MQTT, y transmitiendo por el puerto 3003.<br>

#### 4. /app:
App-1 es el servicio encargado de cargar la aplicacion web construida en Vuejs en su version de producción, y con el fin de usar haproxy y realizar el balanceo de carga, hemos realizado una copia de este servicio llamado App-2.<br>
##### Dockerfile de app
```
FROM ubuntu
RUN apt update
RUN apt install -y apache2
RUN apt install -y apache2-utils
RUN apt clean

COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

RUN mkdir -p /var/www/html/blackbird/dist

COPY ./dist /var/www/html/blackbird/dist/
EXPOSE 80
CMD ["apache2ctl", "-D", "FOREGROUND"]
```
En este punto se establecerán los parámetros necesarios para el funcionamiento de nuestra aplicación web. Para ello, se instalará el servidor de Apache (Apache2) y se copiará la configuración de nuestro sitio web dentro del contenedor de la imagen. Finalmente, se creará una carpeta dentro del contenedor que contendrá todos los archivos de nuestro sitio web creado con Vuejs.<br>

#### 5. /haproxy:
Haproxy sera el servicio encargado de balancear entre dos imagenes de nuestra app, permitiendonos tambien ver un informe detallado de el estado de cada una de ellas y el numero de peticiones ejecutadas.<br>
##### Dockerfile de haproxy
```
FROM haproxy:2.3
RUN mkdir -p /run/haproxy/
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
COPY errors/503.http /usr/local/etc/haproxy/errors/503.http
```
##### haproxy.cfg
```
backend web-backend
   balance roundrobin
   stats enable
   stats auth admin:admin
   stats uri /haproxy?stats

   server app-1 app-1:80 check
   server app-2 app-2:80 check

frontend http
  bind *:80
  default_backend web-backend
```
Dentro de dockerfile de Haproxy le damos las intrucciones de usar haproxy:2.3, para despues crear el directorio `/run/haproxy` dentro del contenedor. Por ultimo realizamos la copia de dos archivos, uno para la configuracion del haproxy y el otro para una pagina personalizada del error 503.<br>

#### 6. /mqtt:
MQTT es el broker de mensajeria escogio para ser de intermediario entre nuestra app y el framework de computación distribuida y procesamiento de datos, Apache Spark, encargado de escuchar los topics por donde se transmitiran los datos que luego se convertiran el consultas de PySpark.<br>

##### docker-compose de mqtt
```
version: '3'

services:
  mqtt:
    image: eclipse-mosquitto
    restart: always
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    ports:
      - 1884:1883
      - 9001:9001
```
En este docker-compose al igual que con el de mongodb, hacemos uso de los volumenes para copiar los archivos de configuración de mqtt.<br>
#### 7. /spark_app
Aqui es donde se encuentran los scripts de pyspark para realizar el procesamiento distribuido, uno de ellos es `bbs71_etl.py` encargado de realizar la extración, limpieza y carga del dataset de kaggle y `bbs71_stream.py` encargado de hacer el procesamiento en streaming de Apache Spark, tambien esta sera la carpeta en donde se almacenara el dataset de kaggle `Combined_Flights_2021.csv` y en donde se guardaran posteriormente los .csv con los datos ya transformados.

## Guia
A continuacion daremos el paso a seguir para desplegar de forma exitosa la app de Blackbird (Es recomendable ir preparando otras 2 ventana de cmd, una en la misma maquina de servidor y otra en cliente para realizar algunos pasos a la vez):<br>
1. Primero realizaremos la conexion del Docker Swarm entre servidorUbuntu y clienteUbuntu, y lo haremos de la siguiente forma:
Abrimos la terminal nro 1 de servidorUbuntu y escribimos este comando `sudo docker swarm init --advertise-addr 192.168.100.2` para iniciarlo y nos dara el siguiente comando con el token para realizar el enlace (si se te olvide puedes usar este `sudo docker swarm join-token worker`) y en la terminal de clienteUbuntu lo escribimos:<br> `sudo docker swarm join --token SWMTKN-1-4qt4bp8o1jeakj6xtgfsa62esrgb8mq6fyip25444653jv1c2b-cqdk5hl7yf17xi1a943ntw3zo 192.168.100.2:2377`
2. Luego sera descargar el respositirio de bbs71 en ambas maquinas:<br>
`git clone https://github.com/SPinzon12/bbs71_git`<br>
3. Despues de esto nos dirigimos al directorio `/bbs71_git/bbs71_docker`, y lo que haremos sera descargar el archivo flights.json y el dataset combined_flights_2021.csv que son demasiado pesados para git, lo haremos con el siguiente comando:<br>
`wget https://www.dropbox.com/s/npd87j2k5yxul2r/bbs71_data.zip`
4. Lo siguiente sera descomprimir el archivo .zip con `unzip bbs71_data.zip`, al hacerlo nos dara 2 archivos `Combined_Flights_2021.csv` y `flights.json` los cuales tendremos que mover a directorios diferentes de la siguiente forma:<br>
`mv Combined_Flights_2021.csv ./spark_app/` y `mv flights.json ./db/`<br>
(Recuerda hacer los pasos 2,3 y 4 en ambas maquinas)<br>



5. Necesitamos ir a la carpeta `/bbs71_docker/spark_app` para ejecutar el archivo `bbs71_etl.py` encargado de tomar, transformar y limpiar el dataset (Este proceso puede tardar un tiempo) pero antes vamos a revisar las rutas del archivo y que sean las indicadas (si esta usando el usuario vagrant o root recuerde que las rutas son diferentes)<br>
6. Si todo esta bien, nos dirigimos a `../../../labSpark/spark-3.4.0-bin-hadoop3/sbin` y iniciamos el master y el worker en la maquina de servidorUbuntu:<br>

Master:<br>
`./start-master.sh`<br>
Worker:<br>
`./start-worker.sh spark://192.168.100.2:7077`<br>

7. Luego nos dirigimos a `/labSpark/spark-3.4.0-bin-hadoop3/bin` y una vez dentro ejecutamos el siguiente comando:<br>
`./spark-submit --master spark://192.168.100.2:7077 /home/vagrant/bbs71_git/bbs71_docker/spark_app/bbs71_etl.py "/home/vagrant/bbs71_git/bbs71_docker/spark_app/Combined_Flights_2021.csv" "/home/vagrant/bbs71_git/bbs71_docker/spark_app/flights"` (este proceso puede tardar un rato)<br>
Cuando termine nos debe generar una carpeta `flights` en el directorio `/bbs71_git/bbs71_docker/spark_app/` con todos los csv resultado `bbs71_etl.py`, como por ejemplo:<br>
```
part-00000-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  part-00009-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv
part-00001-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  part-00010-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv
part-00002-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  part-00011-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv
part-00003-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  part-00012-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv
part-00004-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  part-00013-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv
part-00005-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  part-00014-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv
part-00006-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  part-00015-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv
part-00007-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  part-00016-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv
part-00008-4a73310c-a9aa-4590-9e8f-c260dbf2a0ee-c000.csv  _SUCCESS
```

8. Luego en la terminal nro2 de servidorUbuntu lo que haremos es ir a `/bbs71_docker/db` he iniciamos el docker compose de la base de datos de con el fin de subir los json:<br>
`docker compose up -d`<br>

9. Una vez hecho esto, entraremos al contenedor de mongo con el fin de subir los archivos .json al cluster de mongo y para ello usaremos los comandos:<br> 
Para visualizar el ID del contenedor usamos:<br>
`docker ps`<br>
Deberia mostrarnos algo asi, y copiamos el `CONTAINER ID`:<br>
```
root@vagrant:~/bbs71_git/bbs71_docker/db# docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                                           NAMES
8867c3571a3b   mongo:4.0   "docker-entrypoint.s…"   5 seconds ago   Up 4 seconds   0.0.0.0:27017->27017/tcp, :::27017->27017/tcp   mongodb
```
Ahora entramos en el contenedor:<br>
`docker exec -it <id del contenedor> /bin/bash`<br>
Y navegamos al directorio `/json` y ejecutaremos los siguientes comandos para subirlos al cluster:<br>
Estos comandos importan los archivos .json especificando el nombre de la base de datos, el nombre de la colección, el archivo y el tipo de archivo.<br>
`mongoimport --db bbs71_db --collection flights --type json --file /json/flights.json --jsonArray`<br>
`mongoimport --db bbs71_db --collection users --type json --file /json/users.json --jsonArray`<br>
`mongoimport --db bbs71_db --collection flight_stats --type json --file /json/flight_stats.json --jsonArray`<br>
Una vez hecho esto ya podemos salir del contenedor con `exit`.
10. Cuando el codigo este corriendo, ahora podemos detener el contenedor de mongo de la terminal nro2 con `docker ps` para verlo y `docker stop <id del contenedor>` para detenerlo.<br>

La dejamos ahi corriendo mientras realizamos los siguientes pasos.

11. Ya casi para finalizar una vez hecho los pasos anteriores ahora si ya podemos desplegar la aplicación entera usando Docker Swarm, para ello nos devolvemos a  `/bbs71_git/bbs71_docker` donde se encuentra el archivo docker-compose.yml y lo ejecutamos usando Swarm:<br>
`sudo docker stack deploy -c docker-compose.yml bbs71`<br>
este comando creará y ejecutará los contenedores de Docker necesarios para cada servicio especificado en el archivo docker-compose.yml y usara los recursos de ambas maquinas.<br>

11. Y volvemos a la terminal cmd nro1 de servidorUbuntu, luego nos dirigimos a `/labSpark/spark-3.4.0-bin-hadoop3/bin` y una vez dentro ejecutamos el siguiente comando:<br>
`./spark-submit --master spark://192.168.100.2:7077 /home/vagrant/bbs71_git/bbs71_docker/spark_app/bbs71_stream.py "/home/vagrant/bbs71_git/bbs71_docker/spark_app/flights/*csv"`<br>
Nos debe de salir: <br>
```
Comenzando a leer los archivos CSV...
Archivos CSV leídos correctamente.
Conectado a la base de datos
```

13. Ya con todo corriendo nos dirigimos a nuestro navegador de preferencia y colocamos en la barra de busqueda la ip `192.168.100.2` con el puerto `1080` de Haproxy.

14. Tambien podemos ver las estadisticas de haproxy accediendo por `192.168.100.2:1080/haproxy?stats`.<br>
Usuario:<br>
`admin`<br>
Contraseña:<br>
`admin`<br>
15. Para loguearse en nuestra app hemos colocado 4 ejemplos de usuarios, 2 de aeropuerto y otros 2 de aerolinea:

##### Aeropuertos:
1. Usuario:<br>
`BNA`<br>
Contraseña:<br>
`10693`<br>

2. Usuario:<br>
`ROA`<br>
Contraseña:<br>
`14574`<br>
#### Aerolineas:
1. Usuario:<br>
`Horizon_Air`<br>
Constraseña:<br>
`QX`<br>
2. Usuario:<br>
`Delta_Air`<br>
Constraseña:<br>
`DL`<br>


