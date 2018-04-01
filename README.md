# Deploying a Multi-Org Network

> **Work of:** Ilyas Bakouch, Westley Hubert and Marilyn Finnie.

## Verifying cards have been succefully added

[Imgur](https://i.imgur.com/3BEH1FP.png)
![Verifying cards have been succefully added](https://i.imgur.com/3BEH1FP.png)

## Importing the cards to the business network

![Importing the cards to the business network](https://i.imgur.com/bp0ngY4.png)

## Starting the Network

Using the endorsement policy, and giving `Alice` and `Bob` ability to interact with the network by specifying their certificates.

![Image of Yaktocat](https://i.imgur.com/y7XZAZI.png)
  

## Users
- The organization `Org1` is configured with a user named `Admin@org1.example.com`. This user is an administrator.
- The organization `Org2` is configured with a user named `Admin@org2.example.com`. This user is an administrator.

## Channel
A channel named  `mychannel`  has been created. All four peer nodes -  `peer0.org1.example.com`,  `peer1.org1.example.com`,  `peer0.org2.example.com`, and  `peer1.org2.example.com`  have been joined to this channel.

## Files and Folder

```
composer/byfn-network.json
```

- Contains the **connection profile** describing this fabric network which were given to two users `alice`  and  `bob`  to customize for their organization.  CA certificate for the peer nodes for `Org1` and `Org2` have been included.

```
composer/org1/*
```
- Contains files for `Org1`
	- The admin certificate `Admin@org1.example.com-cert.pem`
	- The customized connection profile for org1 `byfn-network-org1.json`
	- The private key `f7b4d8d0e84a0ea959cd079c23991aac7f695059030e600aeb2e300bdf78929f_sk`

```
composer/org2/*
```
- Contains files for `Org2`
	- The admin certificate `Admin@org2.example.com-cert.pem`
	- The customized connection profile for org1 `byfn-network-org2.json`
	- The private key `9ff7015384764cbc7211cd7fde5220c8ea4fda9a214ec229f3fdd014909eb935_sk`

```
composer/endorsement-policy.json
```
- Contains the endorsement policy stating that both `Org1` and `Org2` must endorse transactions in the business network before they can be committed to the blockchain. If `Org1` or `Org2` do not endorse transactions, or disagree on the result of a transaction, then the transaction will be rejected by the business network.

```
trade-network.bna
```
- The generated archive file ready to be deployed

```
alice@trade-network.card
```
- The business network card that `Alice`, the business network administrator for `Org1`, can use to access the business network.

```
bob@trade-network.card
```
- The business network card that `Bob`, the business network administrator for `Org2`, can use to access the business network.

## Network components

The following network is made up of several components:

-   Two peer nodes for  `Org1`, named  `peer0.org1.example.com`  and  `peer1.org1.example.com`.
    -   The request port for  `peer0`  is 7051.
    -   The event hub port for  `peer0`  is 7053.
    -   The request port for  `peer1`  is 8051.
    -   The event hub port for  `peer1`  is 8053.
-   A single CA (Certificate Authority) for  `Org1`, named  `ca.org1.example.com`.
    -   The CA port is 7054.
-   Two peer nodes for  `Org2`, named  `peer0.org2.example.com`  and  `peer1.org2.example.com`.
    -   The request port for  `peer0`  is 9051.
    -   The event hub port for  `peer0`  is 9053.
    -   The request port for  `peer1`  is 10051.
    -   The event hub port for  `peer1`  is 10053.
-   A single CA (Certificate Authority) for  `Org2`, named  `ca.org2.example.com`.
    -   The CA port is 8054.
-   A single orderer node, named  `orderer.example.com`.
    -   The orderer port is 7050.