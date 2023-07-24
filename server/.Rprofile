source("renv/activate.R")

# https://github.com/grantmcdermott/renv-rspm
## Set default package source by operating system, so that we automatically pull
## in pre-built binary snapshots, rather than building from source.

## For Linux and Windows users, we'll use RStudio Package Manager (RSPM).
if (Sys.info()[["sysname"]] %in% c("Linux", "Windows")) {
    options(repos = c(
        RSPM = "https://packagemanager.rstudio.com/all/latest",
        CRAN = "https://cran.rstudio.com/"
    ))
} else {
    ## For Mac users, we'll default to installing from CRAN/MRAN instead, since
    ## RSPM does not yet support Mac binaries.
    options(repos = c(
        RSPM = "https://packagemanager.rstudio.com/all/latest",
        CRAN = "https://cran.rstudio.com/"
    ))
    # options(renv.config.mran.enabled = TRUE) ## TRUE by default
}
options(renv.config.repos.override = getOption("repos"))
