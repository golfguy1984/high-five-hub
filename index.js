//importing the functions we need from firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//creating settings that includes url to DB
const appSettings = {
    databaseURL: "https://realtime-database-68156-default-rtdb.firebaseio.com/"
}

//setting up the initial DB parameters so that we can read and write to it
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsementList")
const fromInDB = ref(database, "fromList")

//grab ahold of the elements we need (what info, how we are sending it, where we are sending it to)
const endorsementEL = document.getElementById('main-input')
const fromEl = document.getElementById('from')
const toEl = document.getElementById('to')
const publishBtn = document.getElementById('publish')
const endorsementListEl = document.getElementById('endorsement-list')


//hookup our publish button
publishBtn.addEventListener('click', () => {
    //set the value of the textarea field to a variable we can use inside this function
    let endorsementValue = endorsementEL.value
    let fromValue = fromEl.value
    let toValue = toEl.value
    let fullPost = {
        sender: fromValue,
        to: toValue,
        message: endorsementValue
    }
    //pushing the value above to the spot in the DB we defined above
    push(endorsementsInDB, fullPost)
    // push(fromInDB, fromValue)
    //calls the clear function to clear out the field 
    clearEndorsementEL()
})

//retrieves our data from the DB (this code runs everytime data is changed in the DB)
onValue(endorsementsInDB, (snapshot) => {
        if (snapshot.exists()) { //checks if anthing exists in the DB
        let itemsArray = Object.entries(snapshot.val()) //if true sets a new array to the values of the database
        
        clearEndorsementListEl() //clear all the items before running the for loop again
        for (let i = 0; i < itemsArray.length; i++) { //itterate over the new items array
            
            let currentEndorsement = itemsArray[i] // 
            let currentEndorsementID = currentEndorsement[0]
            let currentEndorsementValue = currentEndorsement[1].message
            let currentEndorsementFrom = currentEndorsement[1].sender
            let currentEndorsementTo = currentEndorsement[1].to
           
            
            appendEndorsementToEndorsementListEl(currentEndorsement)
        } 
    } else {
        endorsementListEl.innerHTML = "No Endorsements here.....Yet!"
        
    }
})


//clears the endorsement field when the users clicks the button
function clearEndorsementEL() {
    endorsementEL.value = ""
    fromEl.value = ""
    toEl.value = ""
}
//clears the lisit of endorsements to create a new list everytime data changes
function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function appendEndorsementToEndorsementListEl(endorsement) {
    let endorsementID = endorsement[0]
    let endorsementValue = endorsement[1].message
    let endorsementFrom = endorsement[1].sender
    let endorsementTo = endorsement[1].to
    
    // let currentEndorsementID = currentEndorsement[0]
    // let currentEndorsementValue = currentEndorsement[1].message
    // let currentEndorsementFrom = currentEndorsement[1].sender
    
    let wrapper = document.createElement("div")
    let senderEl = document.createElement("h6")
    let newEl = document.createElement("p")
    let toEl = document.createElement("h6")
    wrapper.className = "endorse-wrapper"
    newEl.className = "list-item"
    senderEl.className = "from"
    toEl.className = "to"
    
    senderEl.textContent = `From: ${endorsementFrom}`
    newEl.textContent = endorsementValue
    toEl.textContent = `To: ${endorsementTo}`
    
    wrapper.addEventListener('click', () => {
        //when click the item in the list below finds that item in the DB
        let locationOfEndorsementInDB = ref(database, `endorsementList/${endorsementID}`)
        //then this removes that item
        remove(locationOfEndorsementInDB)
    })
    // adds the new created li into the existing ul
    endorsementListEl.append(wrapper)
    wrapper.appendChild(senderEl)
    wrapper.appendChild(newEl)
    wrapper.appendChild(toEl)
    // endorsementListEl.append(newEl)
}

