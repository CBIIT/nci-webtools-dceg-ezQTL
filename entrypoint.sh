#!/bin/bash

# create ncianalyis user
useradd -u 4004 ncianalysis

# change ownership of deployment directory
chown -R ncianalysis:ncianalysis /deploy

# set default password for rstudio server user
echo ncianalysis | passwd --stdin ncianalysis

# start rstudio server
rstudio-server start

cd /deploy

npm start