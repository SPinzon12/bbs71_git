# 🐧 BBS-71 - Blackbird
Blackbird es una aplicación web que proporciona un dashboard de información detallada sobre vuelos y aerolíneas que operan en los aeropuertos. La aplicación lee información de dos colecciones de MongoDB que contienen datos sobre vuelos, como la ciudad de origen y destino, si ya despegó, si aterrizó o si se canceló. La aplicación está diseñada para ser utilizada por dos tipos de usuarios: aeropuertos y aerolíneas. Los aeropuertos pueden ver información detallada sobre los vuelos que operan en sus instalaciones, incluyendo qué aerolíneas están activas en el aeropuerto. Las aerolíneas pueden ver información sobre los vuelos que operan en los aeropuertos que les interesan, lo que les permite tomar decisiones informadas sobre sus operaciones y programación de vuelos. Con Blackbird, los usuarios pueden obtener fácilmente una visión general de la actividad y tomar decisiones informadas basadas en los datos.
## Instalación
Para el funcionamiento de este proyecto se utilizará Docker, que es una plataforma de contenedores que permite empaquetar una aplicación junto con todas sus dependencias en un contenedor virtualizado que se puede ejecutar en cualquier sistema operativo, tambien usaremos Apache Spark para aprovechar su capacidad de procesamiento distribuido y su capacidad para manejar grandes conjuntos de datos.<br>
Para instalarlos puedes usar los siguientes comandos:<br>
### Docker
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
### Apache Spark
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

## Configuración
Para configurar el contenedor Docker del proyecto, es necesario conocer los archivos Dockerfile que se han utilizado para crear las imágenes del contenedor. En este proyecto, se han creado varios Dockerfiles que contienen las instrucciones para construir diferentes imágenes del contenedor Docker, cada una con su propia configuración y dependencias específicas. A continuación, se presenta una breve descripción y captura de cada uno de los Dockerfiles utilizados en el proyecto.
##### Dockerfile app
![AHHHH](https://i.imgur.com/1AxW2fc.png)<br>
En este punto se establecerán los parámetros necesarios para el funcionamiento de nuestra aplicación web. Para ello, se instalará el servidor de Apache (Apache2) y se copiará la configuración de nuestro sitio web dentro del contenedor de la imagen. Finalmente, se creará una carpeta dentro del contenedor que contendrá todos los archivos de nuestro sitio web creado con Vuejs.

##### Dockerfile Backend
![](https://i.imgur.com/tbCxBH1.png)<br>
Para ejecutar los microservicios de Blackbird, es necesario contar con Nodejs y descargar la librería de NPM. En el WORKDIR se especificará el directorio de trabajo y se copiarán los archivos package.json, que contienen las dependencias que se utilizarán, como Axios, el cual se encargará de monitorear los puertos no expuestos de los otros microservicios.

##### Dockerfile Haproxy<br>
![](https://i.imgur.com/cqEJ45D.png)<br>
![](https://i.imgur.com/6OHeyR0.png)

#### Docker-compose Mongodb<br>
![]()<br>
#### Docker-compose MQTT<br>
![](https://i.imgur.com/7MxsjlY.png)<br>
##### Docker-compose del proyecto<br>
![](https://i.imgur.com/r0TJAfZ.png)

## Paso a Paso
1. Crearemos un Docker swarm entre 2 maquinas diferentes, con el fin de poder realizar pruebas de balanceo y escalabilidad.
`docker swarm init --advertise-addr 192.168.100.2`<br>
`swarm join --token SWMTKN-1-
4qt4bp8o1jeakj6xtgfsa62esrgb8mq6fyip25444653jv1c2b-cqdk5hl7yf17xi1a943ntw3zo
192.168.100.3:2377`<br>

2. Navega hasta el directorio donde se encuentra el archivo docker-compose.yml, para ejecutar el compose usando swarm necesitaremos ejecutar<br>
el siguiente comando:
`docker stack -c docker-compose.yml bbs71`
este comando creará y ejecutará los contenedores de Docker necesarios para cada servicio especificado en el archivo docker-compose.yml.
3. Y por ultimo escalamos los servicios que queramos:
`docker service scale bbs71_app-1=6`


