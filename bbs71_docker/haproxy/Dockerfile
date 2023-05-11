FROM haproxy:2.3
RUN mkdir -p /run/haproxy/
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
COPY errors/503.http /usr/local/etc/haproxy/errors/503.http
