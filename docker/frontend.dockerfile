FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
 && dnf -y install \
    gcc-c++ \
    httpd \
    make \
    nodejs \
    npm \
 && dnf clean all

# Add custom httpd configuration
COPY docker/ezqtl.conf /etc/httpd/conf.d/ezqtl.conf

RUN mkdir /client

WORKDIR /client

COPY client/package*.json /client/

RUN npm install --legacy-peer-deps 

COPY client /client/

RUN npm run build \
    && mv /client/build /var/www/html/ezqtl

WORKDIR /var/www/html

EXPOSE 80
EXPOSE 443

CMD rm -rf /run/httpd/* /tmp/httpd* \
 && exec /usr/sbin/httpd -DFOREGROUND