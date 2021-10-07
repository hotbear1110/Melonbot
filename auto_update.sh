#! /bin/sh

# This script auto pulls from github and triggers a reset.txt file for the service 'phusion passenger' running on the server.

# Crontab configuration when clock hits 00:00, 00:30, 01:00, 01:30
#
# */30 * * * * 
#
#

pull_from_git() {
    echo "Trying to pull from git..."

    # If it updated
    if git pull | grep 'Already up-to-date' > /dev/null
    then
        echo "No new updates..."
    else
        # This tells phusion passenger to restart the application
        touch ./tmp/restart.txt

        # Log to a file
        echo "Bot updated at $(date) with hash $(git rev-parse --short HEAD)" >> ./logs/update 

    fi
}


pull_from_git