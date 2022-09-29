FROM public.ecr.aws/amazonlinux/amazonlinux:2022

RUN dnf -y update \
 && dnf -y install \
    gcc-c++ \
    make \
    nodejs \
    npm \
    R \
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

# FROM quay.io/centos/centos:stream8

# RUN dnf -y update \
#     && dnf -y install \
#     dnf-plugins-core \
#     epel-release \
#     glibc-langpack-en \
#     && dnf config-manager --set-enabled powertools \
#     && dnf -y module enable nodejs:14 \
#     && dnf -y install \
#     gcc-c++ \
#     make \
#     nodejs \
#     R \
#     bzip2 \
#     bzip2-devel \
#     libcurl-devel \
#     cairo \
#     cairo-devel \
#     openssl-devel \
#     pkg-config \
#     zlib-devel \
#     xz-devel \
#     git \
#     libxml2-devel \
#     readline-devel \
#     lapack-devel \
#     blas-devel \
#     gsl-devel \
#     gmp-devel \
#     mpfr-devel \
#     # v8-devel \
#     && dnf clean all

# # install python3
# RUN dnf -y install \
#     python3 \
#     python3-devel

# install python packages
RUN pip3 install scipy pandas numpy tensorflow boto3

RUN mkdir -p /deploy/server /deploy/logs

WORKDIR /deploy/server

# install renv
RUN Rscript -e "install.packages('renv', repos = 'https://cloud.r-project.org/')"

# install R packages
COPY server/renv.lock /deploy/server/

RUN Rscript -e "renv::restore()"

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
    && g++ ecaviar.cpp PostCal.cpp Util.cpp -std=c++98 -I ./armadillo/include/ -DARMA_DONT_USE_WRAPPER -llapack -lblas -lgslcblas -lgsl -o ./eCAVIAR \
    && mv ./eCAVIAR /usr/local/bin

# install system fonts
RUN cd /tmp; git clone https://github.com/xtmgah/SigProfilerPlotting; cp /tmp/SigProfilerPlotting/fonts/* /usr/share/fonts; fc-cache -fv;

# copy the rest of the application
COPY . /deploy/

CMD npm start