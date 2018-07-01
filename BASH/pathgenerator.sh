#!/usr/bin/bash
#usage: sh list.sh listfiles.txt
filename="$1"
while read -r line
do
    path="$line"
    echo "\"$path\","
done < "$1"