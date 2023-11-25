#!/bin/bash

git pull
go get -u
gofumpt -l -w ../
go mod tidy

(cd ./website && ncu -u && npm i)
