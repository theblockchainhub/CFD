/**
 * Trade a marble to a new player
 * @param  {org.cfd.capstone.CashTransaction} cashTransaction - the trade cash transaction
 * @transaction
 */

async function cashTransaction(cashTransaction) {   // eslint-disable-line no-unused-vars
	cashTransaction.cash.owner = cashTransaction.newOwner;
    const assetRegistry = await getAssetRegistry('org.cfd.capstone.Cash');
    await assetRegistry.update(cashTransaction.cash);
  	
  alert('Cash transfer successful');
}

/**
 * Trade a marble to a new player
 * @param  {org.cfd.capstone.MetalTransaction} metalTransaction - the trade metal transaction
 * @transaction
 */

async function metalTransaction(metalTransaction) {   // eslint-disable-line no-unused-vars
	metalTransaction.metal.owner = metalTransaction.newOwner;
    const assetRegistry = await getAssetRegistry('org.cfd.capstone.Metal');
    await assetRegistry.update(metalTransaction.metal);

  alert('Metal transfer successful');
}
