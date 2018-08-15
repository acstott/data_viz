#-----------------------------------------------------------------------------
# AWS Honeypot Data Analysis - Geo Location for Map Functionality  
#-----------------------------------------------------------------------------

library(data.table)
honeypot <- read_csv("~/Development/data_viz/input/marx_geo.csv")
honeypot <- data.table(honeypot)

#-----------------------------------------------------------------------------
# Load Globals 
#-----------------------------------------------------------------------------


library(forcats)
library(mongolite)

#-----------------------------------------------------------------------------
# Clean Data 
#-----------------------------------------------------------------------------

# Remove N/A & Extraneous Values 

honeypot <- data.frame(honeypot %>% 
                         filter(!is.na(latitude) & !is.na(longitude),
                                latitude <= 90))

honeypot_data <- data.table(character(length(honeypot$host)),
                              character(length(honeypot$src)),
                              character(length(honeypot$proto)),
                              character(length(honeypot$latitude)),
                              character(length(honeypot$longitude)))

honeypot_data[,1] <- honeypot$host
honeypot_data[,2] <- honeypot$src
honeypot_data[,3] <- honeypot$proto
honeypot_data[,4] <- honeypot$latitude
honeypot_data[,5] <- honeypot$longitude

colnames(honeypot_data) <- c("host", "src", "proto", "latitude", "longitude")

#-----------------------------------------------------------------------------
# Aggregate Data For Further Cleaning
#-----------------------------------------------------------------------------

geo_grouping <- as.data.frame(honeypot_data) %>%
  group_by(latitude, longitude, host, src, proto) %>%
  summarise(count = n())

top_hundred <- data.table(head(sort(geo_grouping$count, decreasing = T), 100))

colnames(top_hundred) <- c("count")

sticky_pot <- inner_join(geo_grouping, top_hundred, by = "count")

#-----------------------------------------------------------------------------
# Write to file
#-----------------------------------------------------------------------------

write.csv(sticky_pot, file = "honeypot.csv") 

#-----------------------------------------------------------------------------
# Write to Mongo 
#-----------------------------------------------------------------------------

honeypot_collection = mongo(collection = "honeyPot", db = "dataViz") # create connection, database and collection
honeypot_collection $insert(sticky_pot)





