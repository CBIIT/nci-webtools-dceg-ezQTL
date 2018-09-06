library(magrittr)
set.seed(512)
do.call(rep, list(input)) %>% 
  strsplit(NULL) %>% 
  sapply(sample) %>% 
  apply(2, paste, collapse = "")