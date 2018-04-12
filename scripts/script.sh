#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Build your first network (BYFN) end-to-end test"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${LANGUAGE:="golang"}
: ${TIMEOUT:="10"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=5
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/cfd01.com/orderers/orderer.cfd01.com/msp/tlscacerts/tlsca.cfd01.com-cert.pem

CC_SRC_PATH="../../../chaincode/chaincode_cfd01/node/"
#CC_SRC_PATH="./../../chaincode/fabcar/node/"
if [ "$LANGUAGE" = "go" ]; then
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/chaincode_example02/go/"
fi

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

createChannel() {
	setGlobals 0 1

	if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
                set -x
		peer channel create -o orderer.cfd01.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx >&log.txt
		res=$?
                set +x
	else
				set -x
		peer channel create -o orderer.cfd01.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
		res=$?
				set +x
	fi
	cat log.txt
	verifyResult $res "Channel creation failed"
	echo "===================== Channel \"$CHANNEL_NAME\" is created successfully ===================== "
	echo
}

joinChannel () {
	for org in 1 3; do
	    for peer in 0 1; do
		joinChannelWithRetry $peer $org
		echo "===================== peer${peer}.org${org} joined on the channel \"$CHANNEL_NAME\" ===================== "
		sleep $DELAY
		echo
	    done
	done
}

## Create channel
echo "Creating channel..."
createChannel

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for aktex..."
updateAnchorPeers 0 1
echo "Updating anchor peers for insurex..."
updateAnchorPeers 0 2
echo "Updating anchor peers for shippex..."
updateAnchorPeers 0 3

## Install chaincode on peer0.aktex and peer0.insurex
echo "Installing chaincode on peer0.aktex..."
installChaincode 0 1
echo "Install chaincode on peer0.insurex..."
installChaincode 0 2
echo "Install chaincode on peer0.shippex..."
installChaincode 0 3


# Instantiate chaincode on peer0.insurex
echo "Instantiating chaincode on peer0.insurex..."
instantiateChaincode 0 2

# Instantiate chaincode on peer0.shippex
echo "Instantiating chaincode on peer0.shippex..."
instantiateChaincode 0 3

# Query chaincode on peer0.aktex
echo "Querying chaincode on peer0.aktex..."
chaincodeQuery 0 1 100

# Invoke chaincode on peer0.aktex
echo "Sending invoke transaction on peer0.aktex..."
chaincodeInvoke 0 1

## Install chaincode on peer1.insurex
echo "Installing chaincode on peer1.insurex..."
installChaincode 1 2

# Query on chaincode on peer1.insurex, check if the result is 90
echo "Querying chaincode on peer1.insurex..."
chaincodeQuery 1 2 90

## Install chaincode on peer1.shippex
echo "Installing chaincode on peer1.shippex..."
installChaincode 1 3

# Query on chaincode on peer1.insurex, check if the result is 90
echo "Querying chaincode on peer1.shippex..."
chaincodeQuery 1 3 90

echo
echo "========= All GOOD, BYFN execution completed =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
