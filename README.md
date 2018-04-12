#

Deploying a Multi-Org 3-node Network
With Shipper-Insurer smart contract on Hyperledger Fabric

This capstone submission for CFD01 is a multi organization hyperledger fabric network represented by three organizations developed and built by Edward Johnson and Parvez Raj.

The high-level steps for our entire process are as follows;

Build the multi-org concept using Hyperledger composer for means of demonstrations. This was an optional step, but good practice.
Build the network of three organizations working through and customizing/extending the byfn.sh script
Editing and customizing all yaml and configuration files
Developing the chaincode to be as light and relevant as necessary
Testing and running
Business case

An Auction house has sold an Auction item to a Buyer, who has completed payment, and requests it to be shipped and delivered to their chosen destination in London. The item needs to be packaged, sealed and kept within a temperature range until it arrives at the destination. The shipper takes out a contract with an insurer which will have a fixed price but will increase in price if the temperature goes outside of that range. IOT temperature sensors are packaged with the item to give readings during the journey.

Outputs, files and chaincode

The script outputs showing the steps in the files up.txt and down.txt
Configuration files, keys and generated files are included in this archive.
Organizations named in auctions.cto.
Chaincode is in logic.js

["Build Your First Network"](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html) tutorial.

*NOTE:* After navigating to the documentation, choose the documentation version that matches your version of Fabric

# CFD01
# CFD01
