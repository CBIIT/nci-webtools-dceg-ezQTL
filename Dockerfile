FROM centos:latest


RUN yum -y update \
 && yum -y groupinstall "Development Tools" \
 && curl -sL https://rpm.nodesource.com/setup_10.x | bash - \
 && yum -y install \
    epel-release \
 && yum -y install \
    dos2unix \
    httpd \
    httpd-devel \
    libxml2-devel \
    openssl-devel \
    libcurl-devel \
    nodejs \
    readline-devel \
    R \
    R-devel \
    https://centos7.iuscommunity.org/ius-release.rpm \
    https://download2.rstudio.org/rstudio-server-rhel-1.1.456-x86_64.rpm

# Set CRAN respository
RUN { \
    echo "local({"                                         ;\
    echo "    r <- getOption('repos')"                     ;\
    echo "    r['CRAN'] <- 'https://cloud.r-project.org/'" ;\
    echo "    options(repos = r)"                          ;\
    echo "})"                                              ;\
} | tee -a "/usr/lib64/R/library/base/R/Rprofile"

RUN R -e "install.packages(c(\
    'data.table', \
    'tidyverse', \
    'hrbrthemes', \
    'scales', \
    'ggrepel', \
    'forcats', \
    'jsonlite' \       
));"

RUN pushd tmp \
 && git clone -b fix/macos-compile https://github.com/statgen/emeraLD.git emerald \
 && pushd emerald \
 && make \
 && cp bin/* /usr/bin/

RUN mkdir /deploy

COPY . /deploy

WORKDIR /deploy

RUN npm install \
 && chmod 755 entrypoint.sh \
 && dos2unix entrypoint.sh

CMD ./entrypoint.sh
# CMD pwd