#!/bin/bash
mongo --eval 'db.leaks.insert({correo:"test@test.com",passwd:"pass"});'
