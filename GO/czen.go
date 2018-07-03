package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type Person struct {
	Gender       string `json:"gender"`
	Name         string `json:"name"`
	Lastname     string `json:"lastname"`
	Citizenship  string `json:"citizenship"`
}

func (smartContract *SmartContract) Init(APIstub shim.ChaincodeStubInterface) peer.Response {

	persons := []Person{
		Person{Gender: "Male", Name: "John", Lastname: "Smith", Citizenship: "UK"},
		Person{Gender: "Male", Name: "Steve", Lastname: "McDonald", Citizenship: "USA"},
		Person{Gender: "Female", Name: "Lena", Lastname: "Greenwood", Citizenship: "CA"},
		Person{Gender: "Female", Name: "Mary", Lastname: "Porter", Citizenship: "AU"},
	}
	fmt.Println(persons)

	i := 0
	for i < len(persons) {
		fmt.Println("i is ", i)
		personsAsBytes, _ := json.Marshal(persons[i])
		APIstub.PutState("PER"+strconv.Itoa(i), personsAsBytes)
		fmt.Println("Added", persons[i])
		i = i + 1
	}
	
	return shim.Success(nil)
}

func (smartContract *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) peer.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()

	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryPerson" {
		return smartContract.queryPerson(APIstub, args)
	} else if function == "initLedger" {
		return smartContract.initLedger(APIstub)
	} else if function == "createPerson" {
		return smartContract.createPerson(APIstub, args)
	} else if function == "queryAllPersons" {
		return smartContract.queryAllPersons(APIstub)
	} else if function == "changeCitzenship" {
		return smartContract.changeCitizenship(APIstub, args)
	}

	return shim.Error("Invalid Chaincode function name.")
}

func (smartContract *SmartContract) queryPerson(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	personAsBytes, _ := APIstub.GetState(args[0])

	return shim.Success(personAsBytes)
}

func (smartContract *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) peer.Response {
	fmt.Println("inside initLedger")
	persons := []Person{
		Person{Gender: "Male", Name: "John", Lastname: "Smith", Citizenship: "UK"},
		Person{Gender: "Male", Name: "Steve", Lastname: "McDonald", Citizenship: "USA"},
		Person{Gender: "Female", Name: "Lena", Lastname: "Greenwood", Citizenship: "CA"},
		Person{Gender: "Female", Name: "Mary", Lastname: "Porter", Citizenship: "AU"},
	}
	fmt.Println(persons)

	i := 0
	for i < len(persons) {
		fmt.Println("i is ", i)
		personsAsBytes, _ := json.Marshal(persons[i])
		APIstub.PutState("PER"+strconv.Itoa(i), personsAsBytes)
		fmt.Println("Added", persons[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (smartContract *SmartContract) createPerson(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	var person = Person{Gender: args[1], Name: args[2], Lastname: args[3], Citizenship: args[4]}

	personAsBytes, _ := json.Marshal(person)
	APIstub.PutState(args[0], personAsBytes)

	return shim.Success(nil)
}

func (smartContract *SmartContract) queryAllPersons(APIstub shim.ChaincodeStubInterface) peer.Response {

	startKey := "PER0"
	endKey := "PER999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllPersons:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (smartContract *SmartContract) changeCitizenship(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	personAsBytes, _ := APIstub.GetState(args[0])
	person := Person{}

	json.Unmarshal(personAsBytes, &person)
	person.Citizenship = args[1]

	personAsBytes, _ = json.Marshal(person)
	APIstub.PutState(args[0], personAsBytes)

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Chaincode
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Chaincode: %s", err)
	}
}
