#!/bin/bash
dirs=(dummydata dummydata2 dummydata3) #Directories to iterate
for dir in "${dirs[@]}"; do
    echo "PROCESANDO DIRECTORIO: $dir"
    	while read -r line
		do
		    IFS=:
		    set - $line
			echo "Correo: $1 Pass: $2" 
			echo "db.leaks.insert({correo:\"$1\",passwd:\"$2\"});" | mongo
		done < "$dir"
done