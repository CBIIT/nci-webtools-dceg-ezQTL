FROM ncidockerhub.nci.nih.gov/docker-linux-poc/centos-base-image:1.0

RUN dnf -y update \
    && dnf -y install \
    dnf-plugins-core \
    epel-release \
    glibc-langpack-en \
    && dnf -y module enable nodejs:14 \
    && dnf -y install \
    gcc-c++ \
    httpd \
    make \
    nodejs \
    && dnf clean all

# Add custom httpd configuration
COPY docker/ezqtl.conf /etc/httpd/conf.d/ezqtl.conf

RUN mkdir /client

WORKDIR /client

COPY client/package*.json /client/

RUN npm install

COPY client /client/

RUN npm run build \
    && mv /client/build /var/www/html/ezqtl

WORKDIR /var/www/html

EXPOSE 80
EXPOSE 443

CMD rm -rf /run/httpd/* /tmp/httpd* \
    && exec /usr/sbin/apachectl -DFOREGROUND