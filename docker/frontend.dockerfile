FROM public.ecr.aws/amazonlinux/amazonlinux:2023 AS builder

RUN dnf -y update \
    && dnf -y install \
    make \
    nodejs24 \
    && dnf clean all

WORKDIR /client

COPY client/package*.json /client/

RUN npm ci

ARG CACHE_BUST
COPY client /client/

RUN npm run build

FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    httpd \
    && dnf clean all

# Add custom httpd configuration
COPY docker/ezqtl.conf /etc/httpd/conf.d/ezqtl.conf

COPY --from=builder /client/dist /var/www/html/ezqtl

WORKDIR /var/www/html

EXPOSE 80
EXPOSE 443

CMD rm -rf /run/httpd/* /tmp/httpd* \
    && exec /usr/sbin/httpd -DFOREGROUND