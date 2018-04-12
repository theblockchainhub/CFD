/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getParticipantRegistry getAssetRegistry getFactory */

/**
 * A shipment has been received by an importer
 * @param {org.cfd01.shipping.auction.ShipmentReceived} shipmentReceived - the ShipmentReceived transaction
 * @transaction
 */
async function payOut(shipmentReceived) {  // eslint-disable-line no-unused-vars

    const contract = shipmentReceived.shipment.contract;
    const shipment = shipmentReceived.shipment;
    let payOut = contract.unitPrice;

    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'ARRIVED';

        // find the lowest temperature reading
    if (shipment.temperatureReadings) {
        // sort the temperatureReadings by centigrade
        shipment.temperatureReadings.sort(function (a, b) {
            return (a.centigrade - b.centigrade);
        });
        const lowestReading = shipment.temperatureReadings[0];
        const highestReading = shipment.temperatureReadings[shipment.temperatureReadings.length - 1];
        let penalty = 0;
        console.log('Lowest temp reading: ' + lowestReading.centigrade);
        console.log('Highest temp reading: ' + highestReading.centigrade);

        // does the lowest temperature violate the contract?
        if (lowestReading.centigrade < contract.minTemperature) {
            penalty += (contract.minTemperature - lowestReading.centigrade) * contract.minPenaltyFactor;
            console.log('Min temp penalty: ' + penalty);
        }

        // does the highest temperature violate the contract?
        if (highestReading.centigrade > contract.maxTemperature) {
            penalty += (highestReading.centigrade - contract.maxTemperature) * contract.maxPenaltyFactor;
            console.log('Max temp penalty: ' + penalty);
        }
        
        // apply any penalities
        payOut += payOut * (penalty/100);
    }
    
    console.log('Payout: ' + payOut);
    contract.shipper.accountBalance -= payOut;
    contract.insurer.accountBalance -= payOut;

    console.log('Shipper: ' + contract.shipper.$identifier + ' new balance: ' + contract.shipper.accountBalance);
    console.log('Insurer: ' + contract.insurer.$identifier + ' new balance: ' + contract.insurer.accountBalance);

    // update the grower's balance
    const shipperRegistry = await getParticipantRegistry('org.cfd01.shipping.auction.Shipper');
    await shipperRegistry.update(contract.shipper);

    // update the importer's balance
    const insurerRegistry = await getParticipantRegistry('org.cfd01.shipping.auction.Insurer');
    await insurerRegistry.update(contract.insurer);

    // update the state of the shipment
    const shipmentRegistry = await getAssetRegistry('org.cfd01.shipping.auction.Shipment');
    await shipmentRegistry.update(shipment);
}

/**
 * A temperature reading has been received for a shipment
 * @param {org.cfd01.shipping.auction.TemperatureReading} temperatureReading - the TemperatureReading transaction
 * @transaction
 */
async function temperatureReading(temperatureReading) {  // eslint-disable-line no-unused-vars

    const shipment = temperatureReading.shipment;

    console.log('Adding temperature ' + temperatureReading.centigrade + ' to shipment ' + shipment.$identifier);

    if (shipment.temperatureReadings) {
        shipment.temperatureReadings.push(temperatureReading);
    } else {
        shipment.temperatureReadings = [temperatureReading];
    }

    // add the temp reading to the shipment
    const shipmentRegistry = await getAssetRegistry('org.cfd01.shipping.auction.Shipment');
    await shipmentRegistry.update(shipment);
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.cfd01.shipping.auction.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'org.cfd01.shipping.auction';

    // create the insurer
    const insurer = factory.newResource(NS, 'Insurer', 'insurer@email.com'); 
    insurer.address = "insurerAddress";
    insurer.accountBalance = 0;

    // create the shipper
    const shipper = factory.newResource(NS, 'Shipper', 'shipper@email.com');
    shipper.address = "shipperAddress";
    shipper.accountBalance = 0;

    // create the contract
    const contract = factory.newResource(NS, 'Contract', 'CON_001');
    contract.insurer = shipper;
    contract.shipper = insurer;
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    contract.unitPrice = 100000; // pay 50 cents per unit
    contract.minTemperature = 2; // min temperature for the cargo
    contract.maxTemperature = 10; // max temperature for the cargo
    contract.minPenaltyFactor = 5; // we reduce the price by 20 cents for every degree below the min temp
    contract.maxPenaltyFactor = 5; // we reduce the price by 10 cents for every degree above the max temp

    // create the shipment
    const shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    shipment.type = 'MONALISA';
    shipment.status = 'IN_TRANSIT';

    // add the insurers
    const importerRegistry = await getParticipantRegistry(NS + '.Insurer');
    await importerRegistry.addAll([insurer]);

    // add the shippers
    const shipperRegistry = await getParticipantRegistry(NS + '.Shipper');
    await shipperRegistry.addAll([shipper]);

    // add the contracts
    const contractRegistry = await getAssetRegistry(NS + '.Contract');
    await contractRegistry.addAll([contract]);

    // add the shipments
    const shipmentRegistry = await getAssetRegistry(NS + '.Shipment');
    await shipmentRegistry.addAll([shipment]);
}
