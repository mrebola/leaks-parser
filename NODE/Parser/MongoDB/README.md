
1) Install nvm https://github.com/creationix/nvm
2) `nvm install 8.11.2`
3) go to the folder where package.json is and run `npm install`
4) edit parser.json database connection
4) run this command pointing to the data folder
`find ../breaches/BreachCompilation/data | sort | node parser.js`