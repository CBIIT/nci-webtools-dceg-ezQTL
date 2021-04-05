FROM centos:8.3.2011

RUN dnf -y update \
    && dnf -y install \
        dnf-plugins-core \
        epel-release \
        glibc-langpack-en \
    && dnf -y module enable nodejs:14 \
    && dnf -y install \
        gcc-c++ \
        make \
        nodejs \
        python3 \
        bzip2 \
        bzip2-devel \
        libcurl-devel \
        openssl-devel \
        zlib-devel \
        xz-devel \
        git \
        libxml2-devel \
        readline-devel \
        lapack-devel \
        blas-devel \
        gsl-devel \
        gmp-devel \
        mpfr-devel \
    && dnf clean all

# install emerald
RUN cd /tmp \
    && git clone https://github.com/statgen/emeraLD.git \
    && cd emeraLD \
    && git checkout fix/macos-compile \
    && make \
    && cd ./bin && mv ./emeraLD /usr/local/bin

# install htslib
RUN cd /tmp \
    && curl -L https://github.com/samtools/htslib/releases/download/1.12/htslib-1.12.tar.bz2 | tar xj \
    && cd htslib-1.12 \
    && ./configure --enable-libcurl --prefix=/tmp/htslib-1.12 \
    && make && make install \
    && cd ./bin && mv * /usr/local/bin

# install bcftools
RUN cd /tmp \
    && curl -L https://github.com/samtools/bcftools/releases/download/1.12/bcftools-1.12.tar.bz2 | tar xj \
    && cd bcftools-1.12 \
    && ./configure --enable-libcurl --prefix=/tmp/bcftools-1.12  \
    && make && make install \
    && mv ./bcftools /usr/local/bin

# install ecaviar
RUN cd /tmp \
    && git clone https://github.com/fhormoz/caviar.git \
    && cd caviar/CAVIAR-C++ \
    && make clean && make \
    && mv ./eCAVIAR /usr/local/bin

# install R packages
RUN Rscript -e "Sys.setenv(MAKEFLAGS = '-j2'); install.packages(c('jsonlite', 'tidyverse', 'data.table', 'devtools'), repos='https://cloud.r-project.org/')"

# install Hyprcoloc R package
RUN Rscript -e "require(devtools); install_github('jrs95/hyprcoloc', build_opts = c('--no-resave-data', '--no-manual'), build_vignettes = TRUE);"

RUN mkdir -p /deploy/server /deploy/logs

WORKDIR /deploy/server

# use build cache for npm packages
COPY server/package*.json /deploy/server/

RUN npm install

# copy the rest of the application
COPY . /deploy/

CMD npm start