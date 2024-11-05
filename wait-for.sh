#!/bin/sh

# wait-for.sh script to wait for a specific host and port to be available
host="$1"
shift
cmd="$@"

until nc -z "$host" 80; do
  echo "Waiting for $host to become available..."
  sleep 2
done

exec $cmd
