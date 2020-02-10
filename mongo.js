const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log("Not enough arguments passed")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://vapsolon:${password}@cluster0-pftkv.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
    console.log("Phonebook:")
    Person.find({})
    .then(result =>{
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
    })
}
else if(process.argv.length === 5){
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person({
        name: newName,
        number: newNumber,
    })

    person.save().then(response => {
        console.log("Added person " + newName + " with number " + newNumber + " to the phonebook");
        mongoose.connection.close();
    })
}
else{
    console.log("Incorrect number of arguments passed (" + (process.argv.length-2) + "). Please pass either just a password or a password, a name and a number")
    mongoose.connection.close();
    process.exit(1)
}