#-----------------------------------------------------------------------------
# AWS Honeypot Data Analysis - Geo Location for Map Functionality  
#-----------------------------------------------------------------------------

library(data.table)
honeypot <- read_csv("~/Development/data_viz/input/marx-geo.csv")
honeypot <- data.table(honeypot)

#-----------------------------------------------------------------------------
# Load Globals 
#-----------------------------------------------------------------------------

library(ggmap)
library(sf)
library(mapview)
library(ggplot2)
library(forcats)

#-----------------------------------------------------------------------------
# Clean Data 
#-----------------------------------------------------------------------------

honeypot_data <- data.table(as.POSIXct.Date(length(honeypot$datetime)),
                              character(length(honeypot$host)),
                              character(length(honeypot$src)),
                              character(length(honeypot$proto)),
                              character(length(honeypot$latitude)),
                              character(length(honeypot$longitude)))

honeypot_data[,1] <- honeypot$datetime
honeypot_data[,2] <- honeypot$host
honeypot_data[,3] <- honeypot$src
honeypot_data[,4] <- honeypot$proto
honeypot_data[,5] <- honeypot$latitude
honeypot_data[,6] <- honeypot$longitude

colnames(honeypot_data) <- c("timestamp", "host", "src", "proto", "latitude", "longitude")

honeypot_data <- na.omit(honeypot_data)

#-----------------------------------------------------------------------------
# Write to file
#-----------------------------------------------------------------------------

write.csv(honeypot_data, file = "honeypot.csv") 

#-----------------------------------------------------------------------------
# Write to Mongo 
#-----------------------------------------------------------------------------

honeypot_collection = mongo(collection = "honeyPot", db = "dataViz") # create connection, database and collection
honeypot_collection $insert(honeypot_data)




