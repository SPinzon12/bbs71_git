# BBS-71 - Blackbird
## Desc
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
`FROM ubuntu
RUN apt update
RUN apt install -y apache2
RUN apt install -y apache2-utils
RUN apt clean

COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

RUN mkdir -p /var/www/html/blackbird/dist

COPY ./dist /var/www/html/blackbird/dist/
EXPOSE 80
CMD ["apache2ctl", "-D", "FOREGROUND"]`
## Paso a Paso

