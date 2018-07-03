# DreamTeamCfd02
 Capstone Project CFDev
 =========
 
Chaincode Name => czen_chaincode

GO Chain
========
/home/ubuntu/fabric-samples/chaincode/fabcar/go
czen.go

Node JS
=======
/home/ubuntu/fabric-samples/fabcar

queryCzen.js
invokeCzen.js
registerUserCzen.js
enrollAdminCzen.js

Network Start Script
====================
/home/ubuntu/fabric-samples/fabcar

startFabricCzen.sh

Couch DB
========
We could actually see the transaction data here..in a more human way
http://ec2-18-222-150-202.us-east-2.compute.amazonaws.com:5984/_utils

Supported Functions
===================
Register admin
--------------
enrollAdminCzen.js

Register User ( czenuser )
-------------
registerUserCzen.js

Create a Person
----------------
node invokeCzen.js createPerson PER40 FEMALE MARY JOE TAIWAN

Change Citizenship
-------------------
node invokeCzen.js changeCitzenship PER0 AUSTRALIA

Query for one PERSON
--------------------
queryCzen.js PER35

Query for ALL Persons in the Network
------------------------------------
queryCzen.js 



Do a clean prior to start attempt
=================================

###clear docker and restart 
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -aq)
docker network prune
