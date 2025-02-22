#!/bin/bash

# poll node_info periodically to keep the proxy server alive

# install:
# sudo cp fetch_node_info.sh  /usr/local/bin
# sudo cp fetch-node-info.service /etc/systemd/system
# sudo touch /var/log/node_info.log
# sudo chmod 666 /var/log/node_info.log
#
# sudo systemctl daemon-reload
# sudo systemctl enable fetch-node-info
# sudo systemctl start fetch-node-info

# view log:
# cat /var/log/node_info.log


LOGFILE="/var/log/node_info.log"

while true; do
    echo "$(date) - Fetching node info..." >> $LOGFILE
    curl -L -X GET "https://api-proxy-server-st7z.onrender.com/api/proxy/api/v1/node_info" >> $LOGFILE 2>&1
    echo "" >> $LOGFILE
    sleep 300  # Wait for 5 minutes
done
