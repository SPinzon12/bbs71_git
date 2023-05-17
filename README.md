# 🐧 BBS-71 - Blackbird
Blackbird es una aplicación web que proporciona un dashboard de información detallada sobre vuelos y aerolíneas que operan en los aeropuertos. La aplicación lee información de dos colecciones de MongoDB que contienen datos sobre vuelos, como la ciudad de origen y destino, si ya despegó, si aterrizó o si se canceló. La aplicación está diseñada para ser utilizada por dos tipos de usuarios: aeropuertos y aerolíneas. Los aeropuertos pueden ver información detallada sobre los vuelos que operan en sus instalaciones, incluyendo qué aerolíneas están activas en el aeropuerto. Las aerolíneas pueden ver información sobre los vuelos que operan en los aeropuertos que les interesan, lo que les permite tomar decisiones informadas sobre sus operaciones y programación de vuelos. Con Blackbird, los usuarios pueden obtener fácilmente una visión general de la actividad y tomar decisiones informadas basadas en los datos.
## Instalación
Para el funcionamiento de este proyecto se utilizará Docker, que es una plataforma de contenedores que permite empaquetar una aplicación junto con todas sus dependencias en un contenedor virtualizado que se puede ejecutar en cualquier sistema operativo, tambien usaremos Apache Spark para aprovechar su capacidad de procesamiento distribuido y su capacidad para manejar grandes conjuntos de datos.<br>
Recuerda que como vamos a usar dos maquinas virtuales, ambas necesitaran tener instalados estos elementos.<br>
Para instalarlos puedes usar los siguientes comandos:<br>
### Vagrantfile: 
Para el despligue de este proyecto necesitaremos una maquina virtual Linux Ubuntu 22.04 con una IP en especifico, la `192.168.100.2`, el motivo de esto es porque la configuración del proyecto esta mapeada sobre dicha IP, por lo que usar otra IP diferente podria generar conflictos y pasos innecesarios, y por ende hemos decidido especificarla:<br>
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
### DockerCompose:
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
`mkdir labSpark`
5. Descargamos el archivo comprimido de Spark:<br>
`wget https://dlcdn.apache.org/spark/spark-3.4.0/spark-3.4.0-bin-hadoop3.tgz`
6. Y lo descomprimimos:<br>
`tar -xvzf spark-3.4.0-bin-hadoop3.tgz`
### Librerias:
1. Editor de texto Vim:<br>
`apt-get install vim -y`<br>
2. Zip y Unzip para descomprimir archivos:<br>
`apt-get install zip unzip -y`<br>
### Pip y librerias de Python:
1. Instalamos PIP y Python:<br>
`apt-get install python3`<br>
`apt-get install pip`
2. Instalamos la libreria Pymogno:<br>
`pip install pymongo`
3. Instalamos la libreria del Broker de mensajeria MQTT:<br>
`pip install paho-mqtt`

## Configuración
Para configurar el contenedor Docker del proyecto, es necesario conocer los archivos Dockerfile que se han utilizado para crear las imágenes del contenedor. Trabajaremos principalmente en el directorio `/bbs71-git/bbs71_docker` el cual contiene las subcarpetas donde estan los archivos necesario para la creacion de cada una de las imagenes del proyecto, las carpetas en cuestion son: `/db` correspondiende a la base de datos de mongodb, `/app` donde se encuentra todos los archivos de nuestra aplicacion web,`/backend` donde estan los microservicios, `/haproxy` donde esta nuestro balanceador, `/mqtt` el broker de mensajeria que usaremos, `/spark_app` donde estan los archivos que usaremos para el procesamiento de spark, dentro de cada carpeta se ha creado el Dockerfile que contienen las instrucciones para construir diferentes imágenes de Docker, cada una con su propia configuración y dependencias específicas. A continuación, se presentara una breve descripción y captura de cada uno de los Dockerfiles en sus repectivas carpetas utilizados en el proyecto.

### bbs71_docker:<br>

#### 1. Docker-compose principal<br>
Este es el docker-compose.yml principal, encargado de desplegar todos los servicios que necesitamos:<br>
![](https://i.imgur.com/ehSEfSF.png) ![](https://i.imgur.com/M0kbx30.png)<br>
En el docker compose se definen las imagenes de cada uno de los servicios y los parametros que se van a usar, para este proyecto utilizamos los siguientes servicios:

#### 2. /Db:

##### Mongodb:<br>
Es una imagen ya construida y disponible en Docker Hub de la base de datos mongodb, a la cual, se le aplico volumenes con el fin de copiar la data en archivos .json dentro de contenedor, ya que necesitaremos que la conexion de mongo con los demas servicios se expuso el puerto 27017, cabe recalcar que este servicio solo podra ser ejecuta dentro de la maquina de 'servidorUbuntu'.<br>
![](https://i.imgur.com/CACLSJV.png)<br>
Aqui creamos el contenedor de mongo sacado de dockerhub, al cual le aplicaremos volumenes con los archivos .json, los cuales deben de estar dentro del contenedor.<br>

#### 3. /Backend:
Aqui se encuentran los 3 microservicios y el apigetway, para la creacion de la imagen de cada uno ellos se uso el mismo dockerfile, con una ligera diferencia como algunos parametros y lo mas importante el puerto por donde salen, pero en si tienen la misma estructura:<br>
#### Dockerfile de los microservicios y apigateway
![](https://i.imgur.com/tbCxBH1.png)<br>
Para ejecutar los microservicios de Blackbird, es necesario contar con Nodejs y descargar la librería de NPM. En el WORKDIR se especificará el directorio de trabajo y se copiarán los archivos package.json, que contienen las dependencias que se utilizarán, como Axios, el cual se encargará de monitorear los puertos no expuestos de los otros microservicios.

#### Apigateway:<br>
Es el servicio encargado de tomar los puertos de cada uno de los microservicios (microuser, microairlines y microairports) ya que los microservicios no se comunican entre ellos, y con el fin de no exponer multiples puertos y su vez simplificar la obtencion de los datos, constrimos este apigateway para concentrar las multiples salidas de los 3 puertos en uno solo, que en este caso es el puerto 3000.

#### Microuser:<br>
Este es el microservicio encargado de controlar y autenticar a los usuarios que esten disponibles en la base de datos, estara conectado a la base de datos.

#### MicroAirlines:<br>
MicroAirlines es el microservicio encargado de gestionar la información relacionada con las aerolíneas y sus tablas de informacion, estara conectado a la base de datos y dependera del broker de mensajeria MQTT.

#### MicroAirports:<br>
MicroAirports cumple un papel similar a MicroAirlines, solo que su funcion esta dedicada unicamente a los aeropuertos, estara conectado a la base de datos y dependera del broker de mensajeria MQTT.<br>

### 4. /App:
#### App:<br>
App-1 es el servicio encargado de cargar la aplicacion web construida en Vuejs en su version de producción, y con el fin de usar haproxy y realizar el balanceo de carga, hemos realizado una copia de este servicio llamado App-2.<br>
![AHHHH](https://i.imgur.com/1AxW2fc.png)<br>
En este punto se establecerán los parámetros necesarios para el funcionamiento de nuestra aplicación web. Para ello, se instalará el servidor de Apache (Apache2) y se copiará la configuración de nuestro sitio web dentro del contenedor de la imagen. Finalmente, se creará una carpeta dentro del contenedor que contendrá todos los archivos de nuestro sitio web creado con Vuejs.<br>

### 5. /Haproxy:

#### Haproxy:
Haproxy sera el servicio encargado de balancear entre dos imagenes de nuestra app, permitiendonos tambien ver un informe detallado de el estado de cada una de ellas y el numero de peticiones ejecutadas.<br>
![](https://i.imgur.com/cqEJ45D.png)<br>
![](https://i.imgur.com/6OHeyR0.png)<br>
Dentro de dockerfile de Haproxy le damos las intrucciones de usar haproxy:2.3, para despues crear el directorio `/run/haproxy` dentro del contenedor. Por ultimo realizamos la copia de dos archivos, uno para la configuracion del haproxy y el otro para una pagina personalizada del error 503.<br>

### 6. /MQTT:
#### MQTT:
MQTT es el broker de mensajeria escogio para ser de intermediario entre nuestra app y el framework de computación distribuida y procesamiento de datos, Apache Spark, encargado de escuchar los topics por donde se transmitiran los datos que luego se convertiran el consultas de PySpark.<br>
![](https://i.imgur.com/7MxsjlY.png)<br>

## Guia
A continuacion daremos el paso a seguir para desplegar de forma exitosa la app de Blackbird (Es recomendable ir preparando otra ventana de cmd en la misma maquina para realizar algunos pasos a la vez):<br>
1. Primero sera descargar el respositirio de bbs71:<br>
`git clone https://github.com/SPinzon12/bbs71_git`<br>
2. Despues de esto nos dirigimos al directorio `/bbs71-git/bbs71_docker`, y lo que haremos sera descargar el archivo flights.json y el dataset combined_flights_2021.csv que son demasiado pesados para git, lo haremos con el siguiente comando:<br>
`wget https://www.dropbox.com/s/npd87j2k5yxul2r/bbs71_data.zip`
3. Lo siguiente sera descomprimir el archivo .zip con `unzip bbs71_data.zip`, al hacerlo nos dara 2 archivos `Combined_Flights_2021.csv` y `flights.json` los cuales tendremos que mover a directorios diferentes de la siguiente forma:<br>
`mv Combined_Flights_2021.csv ./spark_app/` y `mv flights.json ./db/`<br>
4. Necesitamos ir a la carpeta `/bbs71_docker/spark_app` para ejecutar el archivo `bbs71_etl.py` encargado de tomar, transformar y limpiar el dataset (Este proceso puede tardar un tiempo) pero antes vamos a revisar las rutas del archivo y que sean las indicadas (si esta usando el usuario vagrant o root recuerde que las rutas son diferentes)<br>
Usaremos vim para visualizarlo:<br>
`vim bbs71_etl.py`<br>
Y verificamos que ruta_archivo contenga la ruta adecuada a su usuario, en nuestro caso es `ruta_archivo ="/root/proyecto/bbs71_docker/spark_app/Combined_Flights_2021.csv"` y `...save("/root/proyecto/bbs71_docker/spark_app/flights")` para guardar el archivo.<br>
Si todo esta bien, podemos entonces ejecutar el archivo de python:<br>
`python3 bbs71_etl.py`<br>
6. Luego en la terminal cmd nro2 de la maquina lo que haremos es ir a `/bbs71_docker/db` he iniciamos el docker compose de la base de datos de con el fin de subir los json:<br>
`docker compose up -d`<br>
7. Una vez hecho esto, entraremos al contenedor de mongo con el fin de subir los archivos .json al cluster de mongo y para ello usaremos el comando:<br> 
`docker exec -it <id del contenedor> /bin/bash`<br>
Y navegamos al directorio `/json` y ejecutaremos los siguientes comandos para subirlos al cluster:<br>
Estos comandos suben los archivos .json especificando el nombre de la base de datos, el nombre de la colección, el archivo y el tipo de archivo.<br>
`mongoimport --db bbs71_db --collection flights --type json --file /json/flights.json --jsonArray`<br>
`mongoimport --db bbs71_db --collection users --type json --file /json/users.json --jsonArray`<br>
`mongoimport --db bbs71_db --collection flight_stats --type json --file /json/flight_stats.json --jsonArray`<br>
8. Una vez hecho esto ya podemos salir del contenedor con `exit` para despues dirigirnos a la carpeta `/bbs71_docker/mqtt` con el fin de probar el broker de mensajeria, he iniciamos tambien su docker compose:<br>
`docker compose up -d`<br>
Una vez hecho este paso, volvemos a la terminal cmd nro1 que recordemos debe de estar en la ruta `/bbs71_docker/spark_app`, y realizamos el paso 4 de verificación de rutas pero con el archivo `bbs71_stream.py`.
9. Despues de esto nos dirigimos a `/labSpark/spark-3.4.0-bin-hadoop3/sbin` y iniciamos el master y el worker (en la misma maquina):<br>
Master:<br>
`./start-master.sh`<br>
Worker:<br>
`./start-worker.sh spark://192.168.100.2:7077`<br>
Luego nos dirigimos a `/labSpark/spark-3.4.0-bin-hadoop3/bin` entramos a PySpark con `./pyspark` y una vez dentro ejecutamos el siguiente comando:<br>
`./spark-submit --master spark://192.168.100.3:7077 /home/vagrant/bbs71-git/bbs71_docker/spark_app/bbs71_stream.py`<br>

10. Ya realizado los docker compose up, ahora podemos detener los contenedores de mongo y mqtt con `docker ps` para verlos y `docker stop <id del contenedor>` para detenerlos.<br>
11. Ya casi para finalizar una vez hecho los pasos anteriores ahora si ya podemos desplegar la aplicación entera, para ello nos devolvemos a  `/bbs71_git/bbs71_docker` donde se encuentra el archivo docker-compose.yml y lo ejecutamos:<br>
`docker compose up -d`<br>
este comando creará y ejecutará los contenedores de Docker necesarios para cada servicio especificado en el archivo docker-compose.yml.<br>
12. Ya con todo corriendo nos dirigimos a nuestro navegador de preferencia y colocamos en la barra de busqueda la ip `192.168.100.2` con el puerto `1080` de Haproxy.


