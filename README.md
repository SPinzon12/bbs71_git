# BBS-71 - Blackbird
## Desc
Blackbird es una aplicación web que proporciona un dashboard de información detallada sobre vuelos y aerolíneas que operan en los aeropuertos. La aplicación lee información de dos colecciones de MongoDB que contienen datos sobre vuelos, como la ciudad de origen y destino, si ya despegó, si aterrizó o si se canceló. La aplicación está diseñada para ser utilizada por dos tipos de usuarios: aeropuertos y aerolíneas. Los aeropuertos pueden ver información detallada sobre los vuelos que operan en sus instalaciones, incluyendo qué aerolíneas están activas en el aeropuerto. Las aerolíneas pueden ver información sobre los vuelos que operan en los aeropuertos que les interesan, lo que les permite tomar decisiones informadas sobre sus operaciones y programación de vuelos. Con Blackbird, los usuarios pueden obtener fácilmente una visión general de la actividad y tomar decisiones informadas basadas en los datos.
## Instalacion
Para el funcionamiento de este proyecto se utilizará Docker, que es una plataforma de contenedores que permite empaquetar una aplicación junto con todas sus dependencias en un contenedor virtualizado que se puede ejecutar en cualquier sistema operativo.
Para instalarlo puedes usar los siguientes comandos:<br>
#### 1. Instala paquetes para permitir que APT use un repositorio sobre HTTPS:
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
## Configuracion
Para configurar el contenedor Docker del proyecto, es necesario conocer los archivos Dockerfile que se han utilizado para crear las imágenes del contenedor. En este proyecto, se han creado varios Dockerfiles que contienen las instrucciones para construir diferentes imágenes del contenedor Docker, cada una con su propia configuración y dependencias específicas. A continuación, se presenta una breve descripción y captura de cada uno de los Dockerfiles utilizados en el proyecto.
##### Dockerfile app

##### Dockerfile Backend

##### Dockerfile Database

##### Dockerfile Haproxy

##### Docker-compose

## Paso a Paso


