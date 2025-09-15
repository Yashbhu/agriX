#!/bin/bash
#
# Setup script for SupplyChain multi-contract chaincode on Fabric test-network
#

# Change these variables if needed
CC_NAME="supplychain"
CC_SRC_PATH="./chaincode"
CC_RUNTIME_LANGUAGE="node"
CC_VERSION="1.0"
CC_SEQUENCE=1
CHANNEL_NAME="mychannel"

echo "===== Packaging chaincode ====="
peer lifecycle chaincode package ${CC_NAME}.tar.gz \
  --path ${CC_SRC_PATH} \
  --lang ${CC_RUNTIME_LANGUAGE} \
  --label ${CC_NAME}_${CC_VERSION}

echo "===== Installing chaincode on peer0.org1 ====="
peer lifecycle chaincode install ${CC_NAME}.tar.gz

echo "===== Query installed chaincodes ====="
peer lifecycle chaincode queryinstalled

# Capture package ID from queryinstalled
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "${CC_NAME}_${CC_VERSION}" | awk -F "[, ]+" '{print $3}')
echo "PACKAGE_ID is ${PACKAGE_ID}"

echo "===== Approving chaincode for org1 ====="
peer lifecycle chaincode approveformyorg \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CC_NAME} \
  --version ${CC_VERSION} \
  --package-id ${PACKAGE_ID} \
  --sequence ${CC_SEQUENCE} \
  --tls \
  --cafile $ORDERER_CA

echo "===== Check commit readiness ====="
peer lifecycle chaincode checkcommitreadiness \
  --channelID ${CHANNEL_NAME} \
  --name ${CC_NAME} \
  --version ${CC_VERSION} \
  --sequence ${CC_SEQUENCE} \
  --output json

echo "===== Commit chaincode definition ====="
peer lifecycle chaincode commit \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CC_NAME} \
  --version ${CC_VERSION} \
  --sequence ${CC_SEQUENCE} \
  --tls \
  --cafile $ORDERER_CA \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles $PEER0_ORG1_CA

echo "===== Query committed chaincode ====="
peer lifecycle chaincode querycommitted --channelID ${CHANNEL_NAME} --name ${CC_NAME}

echo "===== Chaincode deployed successfully! ====="
