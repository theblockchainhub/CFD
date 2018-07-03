/**
 * Init Ledger
 * @param {org.cfd02.capstone.InitLedgerTransaction} initLedgerTr 
 * @transaction
 */
async function InitLedger(initLedgerTr) { 

    const namespace = 'org.cfd02.capstone';
    const personRegistry = await getParticipantRegistry(namespace + '.Person');
    const factory = getFactory();

   const persons1 = factory.newResource(namespace, 'Person', 'John.Smith@gmail.com');
    persons1.firstName ='John';
    persons1.lastName ='Smith';
    persons1.gender ='Male';
    persons1.citizenship ='UK';

  const persons2 = factory.newResource(namespace, 'Person', 'Steve.McDonald@outlook.com');
    persons2.firstName ='Steve';
    persons2.lastName ='McDonald';
    persons2.gender ='Male';
    persons2.citizenship ='USA';
  
   const persons3 = factory.newResource(namespace, 'Person', 'Lena.Greenwood@gmail.com');
    persons3.firstName ='Lena';
    persons3.lastName ='Greenwood';
    persons3.gender ='Female';
    persons3.citizenship ='CA';

   const persons4 = factory.newResource(namespace, 'Person', 'Mary.Porter@yahoo.com');
    persons4.firstName ='Mary';
    persons4.lastName ='Porter';
    persons4.gender ='Female';
    persons4.citizenship ='AU';
  
   try{
     
     await personRegistry.addAll([persons1,persons2,persons3,persons4]);
     
    } catch(err) {
        console.log("ERROR:InitLedger " + err);  
    }
}

/**
 * Init Ledger
 * @param {org.cfd02.capstone.AddPersonTransaction} addtr 
 * @transaction
 */
async function Addperson(addtr) { 
  
   const namespace = 'org.cfd02.capstone';
  
   // Get the asset registry for the participant.
   const personRegistry = await getParticipantRegistry(namespace + '.Person');
  
   const factory = getFactory();
  
   const persons = factory.newResource(namespace, 'Person', addtr.emailId);
    persons.firstName =addtr.firstName;
    persons.lastName =addtr.lastName;
    persons.gender =addtr.gender;
    persons.citizenship =addtr.citizenship;
  
  try{
     await personRegistry.add(persons);
  
     // Emit an event for the added person.
     let event = getFactory().newEvent(namespace, 'AddPersonEvent');
       event.emailId = addtr.emailId
       event.fullName =   persons.firstName +' ' + persons.lastName;
      emit(event);
  
     } catch(err) {
        console.log("ERROR:Addperson " + err);  
     }
}

/**
 * Init Ledger
 * @param {org.cfd02.capstone.GetAllPerson}  getAll
 * @transaction
*/
async function GetAllPerson(getAll) { 
  
    console.log("::GetAllPerson");
  
    const namespace = 'org.cfd02.capstone';
     // Get the asset registry for the participant.
    const personRegistry = await getParticipantRegistry(namespace + '.Person');
   try{
    const  persons = await personRegistry.getAll();
  
    for (var n = 0; n < persons.length; n++)
    {
        var person = persons[n];
        console.log("### id " + person.emailId+" fname: " + person.firstName);

        let   event = getFactory().newEvent(namespace, 'GetAllPersonEvent');
          event.emailId = person.emailId;
        emit(event);
    }
    } catch(err) {
        console.log("ERROR:GetAllPerson " + err);  
    }
   
}

/**
 * Init Ledger
 * @param {org.cfd02.capstone.ChangeCitizenship} citizen 
 * @transaction
*/
async function ChangeCitizenship( citizen) { 
  
    const namespace = 'org.cfd02.capstone';
  
     // Get the asset registry for the participant.
    const personRegistry = await getParticipantRegistry(namespace + '.Person');
  
    console.log("Select person with Id: " + citizen.emailId);
    try {
         const person = await personRegistry.get(citizen.emailId);
        // Save the old value of the asset.
        const oldValue = person.citizenship;

        // Update the asset with the new value.
        person.citizenship = citizen.newCitizenship;
        try {
         // Update the asset in the asset registry.
         await personRegistry.update(person);          
        } catch(err) {
          console.log("ERROR:Updating registry " + err);
        }
      } catch(err) {
        console.log("ERROR:serCitizenship " + err);  
     }
}


/**
 * Init Ledger
 * @param {org.cfd02.capstone.SelectByCitizenship} citizen 
 * @transaction
*/
async function SelectByCitizenship( citizen) { 
  
    const namespace = 'org.cfd02.capstone';
  
     // Get the asset registry for the participant.
    const personRegistry = await getParticipantRegistry(namespace + '.Person');
  
    const persons = await query( 'selectPersonByCitizenship' , { 'citizenship': citizen.citizenship});
    try {
      for (var n = 0; n < persons.length; n++) {
       const person = persons[n];
       console.log("### id " + person.emailId+" fname: " + person.firstName);

         let   event = getFactory().newEvent(namespace, 'SelectByCitizenshipEvent');
            event.emailId = person.emailId;
          emit(event);
       };
              
     } catch(err) {
        console.log("ERROR:SelectByCitizenship " + err);  
     }
}

/**
 * Init Ledger
 * @param {org.cfd02.capstone.FindPersonByName} name 
 * @transaction
*/
async function FindPersonByName( name) { 
  
    const namespace = 'org.cfd02.capstone';
  
     // Get the asset registry for the participant.
    const personRegistry = await getParticipantRegistry(namespace + '.Person');

    const persons = await query( 'selectPersonByName' , { 'fname': name.firstName , 'lname': name.lastName });
    try {
      for (var n = 0; n < persons.length; n++) {
       const person = persons[n];
       console.log("### id " + person.emailId+" fname: " + person.firstName);

         let   event = getFactory().newEvent(namespace, 'FindPersonByNameEvent');
            event.firstName = person.firstName;
            event.lastName = person.lastName;
          emit(event);
       };
              
     } catch(err) {
        console.log("ERROR:FindPersonByName " + err);  
     }
}
