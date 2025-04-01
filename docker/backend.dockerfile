FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    gcc-c++ \
    make \
    nodejs \
    npm \
    R-4.1.3 \
    bzip2 \
    bzip2-devel \
    libcurl-devel \
    cairo \
    cairo-devel \
    openssl-devel \
    pkg-config \
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
    python3 \
    python3-devel \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    tar \
    && dnf clean all

# install python packages
RUN pip3 install scipy pandas numpy tensorflow boto3

RUN mkdir -p /deploy/server /deploy/logs

WORKDIR /deploy/server

# install R packages with renv
COPY server/renv.lock /deploy/server/
COPY server/.Rprofile /deploy/server/
COPY server/renv/activate.R /deploy/server/renv/
COPY server/renv/settings.dcf /deploy/server/renv/

RUN R -e "\
    options(\
    renv.config.repos.override = 'https://packagemanager.posit.co/cran/__linux__/rhel9/latest', \
    Ncpus = parallel::detectCores() \
    ); \
    renv::restore();"

# use build cache for npm packages
COPY server/package*.json /deploy/server/

RUN npm install

# install emerald
RUN cd /tmp \
    && git clone https://github.com/statgen/emeraLD.git \
    && cd emeraLD/bin \
    && chmod 755 emeraLD \
    && mv emeraLD /usr/local/bin

# install htslib
RUN cd /tmp \
    && curl -L https://github.com/samtools/htslib/releases/download/1.16/htslib-1.16.tar.bz2 | tar xj \
    && cd htslib-1.16 \
    && ./configure --enable-libcurl --prefix=/tmp/htslib-1.16 \
    && make && make install \
    && cd ./bin && mv * /usr/local/bin

# install bcftools
RUN cd /tmp \
    && curl -L https://github.com/samtools/bcftools/releases/download/1.16/bcftools-1.16.tar.bz2 | tar xj \
    && cd bcftools-1.16 \
    && ./configure --enable-libcurl --prefix=/tmp/bcftools-1.16  \
    && make && make install \
    && mv ./bcftools /usr/local/bin

# install ecaviar
RUN cd /tmp \
    && git clone https://github.com/fhormoz/caviar.git \
    && cd caviar/CAVIAR-C++ \
    && g++ ecaviar.cpp PostCal.cpp Util.cpp -std=c++98 -I ./armadillo/include/ -DARMA_DONT_USE_WRAPPER -llapack -lblas -lgslcblas -lgsl -o ./eCAVIAR \
    && mv ./eCAVIAR /usr/local/bin

# install system fonts
RUN cd /tmp; git clone https://github.com/xtmgah/SigProfilerPlotting; cp /tmp/SigProfilerPlotting/fonts/* /usr/share/fonts; fc-cache -fv;

# copy the rest of the application
ARG CACHE_BUST
COPY . /deploy/

CMD npm start
