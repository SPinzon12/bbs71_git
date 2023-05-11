FROM ubuntu
RUN apt update
RUN apt install -y apache2
RUN apt install -y apache2-utils
RUN apt clean

COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

# Crear la carpeta blackbird/dist
RUN mkdir -p /var/www/html/blackbird/dist

COPY ./dist /var/www/html/blackbird/dist/
EXPOSE 80
CMD ["apache2ctl", "-D", "FOREGROUND"]

