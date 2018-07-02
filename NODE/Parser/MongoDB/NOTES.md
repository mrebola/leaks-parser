ssh root@x.x.x.x

# Notes
__Count files__
find ../breaches/BreachCompilation/data | sort | wc -l

__Run parser__

find ./data | sort | node parser2.js

find ../breaches/BreachCompilation/data | sort | node parser.js
find ../breaches/BreachCompilation/data | sort | node --prof parser.js

/mnt/volume_200gb_parsing_breaches/breaches_parser

/root/.nvm/versions/node/v8.11.2

## Performance

### Waiting for each call one by one

It sucks!

## Validate this accounts
Processing buffered query
SAVE:  { email: '00-0001@mail.ru', pass: 'qwertz' } 99 100
SAVE:  { email: '00-0001@mail.ru;qwert',
  pass: '00-0001@mail.ru;qwertz' } 100 100
Reached MAX Concurrency, buffering query
Query success
Processing buffered query
