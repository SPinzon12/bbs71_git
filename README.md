# 🐧 BBS-71 - Blackbird
Blackbird es una aplicación web que proporciona un dashboard de información detallada sobre vuelos y aerolíneas que operan en los aeropuertos. La aplicación lee información de dos colecciones de MongoDB que contienen datos sobre vuelos, como la ciudad de origen y destino, si ya despegó, si aterrizó o si se canceló. La aplicación está diseñada para ser utilizada por dos tipos de usuarios: aeropuertos y aerolíneas. Los aeropuertos pueden ver información detallada sobre los vuelos que operan en sus instalaciones, incluyendo qué aerolíneas están activas en el aeropuerto. Las aerolíneas pueden ver información sobre los vuelos que operan en los aeropuertos que les interesan, lo que les permite tomar decisiones informadas sobre sus operaciones y programación de vuelos. Con Blackbird, los usuarios pueden obtener fácilmente una visión general de la actividad y tomar decisiones informadas basadas en los datos.
## Instalación
Para el funcionamiento de este proyecto se utilizará Docker, que es una plataforma de contenedores que permite empaquetar una aplicación junto con todas sus dependencias en un contenedor virtualizado que se puede ejecutar en cualquier sistema operativo, tambien usaremos Apache Spark para aprovechar su capacidad de procesamiento distribuido y su capacidad para manejar grandes conjuntos de datos.<br>
Recuerda que como vamos a usar dos maquinas virtuales, ambas necesitaran tener instalados estos elementos.<br>
Para instalarlos puedes usar los siguientes comandos:<br>
### Vagrantfile: 
Para el despligue de este proyecto necesitaremos una maquina virtual Linux Ubuntu 22.04 con una IP en especifico, la `192.168.1002`, el motivo de esto es porque la configuración del proyecto esta mapeada sobre dicha IP, por lo que usar otra IP diferente podria generar conflictos y pasos innecesarios, y por ende hemos decidido especificarla:<br>
`# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  if Vagrant.has_plugin? "vagrant-vbguest"
    config.vbguest.no_install  = true
    config.vbguest.auto_update = false
    config.vbguest.no_remote   = true
  end

  config.vm.define :clienteUbuntu do |clienteUbuntu|
    clienteUbuntu.vm.box = "bento/ubuntu-22.04"
    clienteUbuntu.vm.network :private_network, ip: "192.168.100.3"
    clienteUbuntu.vm.hostname = "clienteUbuntu"
    clienteUbuntu.vm.box_download_insecure=true
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
  
  config.vm.provider :virtualbox do |vb|
    vb.gui = true
  end
end`<br>

### Docker:
#### 1. Instala paquetes para permitir que APT use un repositorio sobre HTTPS:<br>
`sudo apt-get install \
 apt-transport-https \
 ca-certificates \
 curl \
 gnupg-agent \
 software-properties-common`
#### 2. Agrega la clave GPG oficial de Docker:<br>
`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
#### 3. Instala Docker Community Edition:<br>
`sudo apt-get install docker-ce docker-ce-cli containerd.io`
### Apache Spark:
#### 1. Instala paquetes de Java:<br>
`sudo apt install -y openjdk-18-jdk`<br>
#### 2. Creamos el archivo jdk18.sh para la configuración:<br>
`cat <<EOF | sudo tee /etc/profile.d/jdk18.sh
export JAVA_HOME=/usr/lib/jvm/java-1.18.0-openjdk-amd64
export PATH=\$PATH:\$JAVA_HOME/bin
EOF`<br>
Despues de este, hacemos:<br>
`source /etc/profile.d/jdk18.sh`
#### 3. Crearemos el dictorio en donde guardaremos los archivos de Spark:
`mkdir labSpark`<br>
Descargamos el archivo comprimido de Spark:<br>
`wget https://dlcdn.apache.org/spark/spark-3.4.0/spark-3.4.0-bin-hadoop3.tgz`
Y lo descomprimimos:<br>
`tar -xvzf spark-3.4.0-bin-hadoop3.tgz`
### Github y Git LFS:
Ya que github no nos permite subir archivos csv que sobrepasen las 100Mb, hemos utilizado git lfs que es una herramienta de git para este tipo de archivos:<br>
Primero instalamos git:<br> 
`apt install git`<br>
Luego instalamos git lfs:<br>
`apt install git-lfs`<br>
### MQTT:
Instalamos la libreria del Broker de mensajeria MQTT:<br>
`pip install paho-mqtt`
### Pip y libreria de pymongo:
Instalamos PIP y PyMongo:<br>
`apt-get install pip`
`pip install pymongo`

## Configuración
Para configurar el contenedor Docker del proyecto, es necesario conocer los archivos Dockerfile que se han utilizado para crear las imágenes del contenedor. Trabajaremos principalmente en el directorio `/bbs71-git/bbs71_docker` el cual contiene las subcarpetas donde estan los archivos necesario para la creacion de cada una de las imagenes del proyecto, las carpetas en cuestion son: `db` correspondiende a la base de datos de mongodb, `app` donde se encuentra todos los archivos de nuestra aplicacion web, `haproxy` donde esta nuestro balanceador, `mqtt` el broker de mensajeria que usaremos, `a`, dentro de cada u se han creado varios Dockerfiles que contienen las instrucciones para construir diferentes imágenes del contenedor Docker, cada una con su propia configuración y dependencias específicas. A continuación, se presentara una breve descripción y captura de cada uno de los Dockerfiles en sus repectivas carpetas utilizados en el proyecto.

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

#### Apigateway:<br>
Es el servicio encargado de tomar los puertos de cada uno de los microservicios (microuser, microairlines y microairports) ya que los microservicios no se comunican entre ellos, y con el fin de no exponer multiples puertos y su vez simplificar la obtencion de los datos, constrimos este apigateway para concentrar las multiples salidas de los 3 puertos en uno solo, que en este caso es el puerto 3000.

#### Microuser:<br>
Este es el microservicio encargado de controlar y autenticar a los usuarios que esten disponibles en la base de datos, estara conectado a la base de datos y dependera del broker de mensajeria MQTT.

#### MicroAirlines:<br>
MicroAirlines es el microservicio encargado de gestionar la información relacionada con las aerolíneas y sus tablas de informacion, estara conectado a la base de datos y dependera del broker de mensajeria MQTT.

#### MicroAirports:<br>
MicroAirports cumple un papel similar a MicroAirlines, solo que su funcion esta dedicada unicamente a los aeropuertos, estara conectado a la base de datos y dependera del broker de mensajeria MQTT.<br>
![](https://i.imgur.com/tbCxBH1.png)<br>
Para ejecutar los microservicios de Blackbird, es necesario contar con Nodejs y descargar la librería de NPM. En el WORKDIR se especificará el directorio de trabajo y se copiarán los archivos package.json, que contienen las dependencias que se utilizarán, como Axios, el cual se encargará de monitorear los puertos no expuestos de los otros microservicios.

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
A continuacion daremos el paso a seguir para desplegar de forma exitosa la app de Blackbird:<br>
1. Primero sera descargar el respositirio de bbs71:<br>
`git clone https://github.com/SPinzon12/bbs71_git`<br>
2. Despues de esto nos dirigimos al directorio `/bbs71-git/bbs71_docker/db`, lo que haremos sera terminar de descargar el archivo flights.json que es demasiado pesado para git, con el siguiente comando:<br>
`git lfs pull`<br>
Luego lo que haremos sera ejecutar unicamente el docker compose de la base de datos de con el fin de crear la carpeta 'mongo' dentro del directorio y subir los json:<br>
`docker compose up -d`<br>
3. Una vez hecho esto, entraremos al contenedor de mongo con el fin de subir los archivos .json al cluster de mongo y para ello usaremos el comando:<br> 
`docker exec -it <id del contenedor> /bin/bash`<br>
Y navegamos al directorio `/json` y ejecutaremos los siguientes comandos para subirlos al cluster:<br>
`mongoimport --db bbs71_db --collection flights --type json --file /json/flights.json --jsonArray`<br>
`mongoimport --db bbs71_db --collection users --type json --file /json/users.json --jsonArray`<br>
`mongoimport --db bbs71_db --collection flight_stats --type json --file /json/flight_stats.json --jsonArray`<br>
4. Una vez hecho esto ya podemos salir del contenedor y verificaremos que en `/bbs71_docker/db` este creada la carpeta`mongo`, si es asi ya podemos detener el contenedor de mongo con `docker ps` para verlo y `docker stop <id del contenedor>` para detenerlo.<br>
5. Ahora nos devolvemos a `/bbs71_git/bbs71_docker` donde se encuentra el archivo docker-compose.yml y lo ejecutamos:<br>
`docker compose up -d`<br>
este comando creará y ejecutará los contenedores de Docker necesarios para cada servicio especificado en el archivo docker-compose.yml.<br>
7. Ya con todo corriendo nos dirigimos a nuestro navegador de preferencia y colocamos en la barra de busqueda la ip `192.168.100.2` con el puerto `1080` de Haproxy.


