import { initializeApp} from 'firebase/app'
import {
    getFirestore, collection,
    doc, onSnapshot,
    query, increment,
    getDoc, updateDoc
} from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4iFQLdPdNAAyHLhZQHDF5Cf82s5dCDi0",
  authDomain: "criednow.firebaseapp.com",
  projectId: "criednow",
  storageBucket: "criednow.appspot.com",
  messagingSenderId: "453628719875",
  appId: "1:453628719875:web:8eeb0ebd3bedc81877ef36",
  measurementId: "G-P3B2JEZ5CD"
};
// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

//collection ref
const colRef = collection(db, 'cry')

//queries
const q = query(colRef)

// real time collection data
  onSnapshot(q, (snapshot) => { // vagy colRef
    let cry = []
    snapshot.docs.forEach((doc) => {
        cry.push({ ...doc.data(), id: doc.id })
    })
    console.log(cry)
  })


// get single document
const docRef = doc(db, 'cry', 'master')

onSnapshot(docRef, (doc) => {
    refreshData(doc.data().now, doc.data().sum)
})

// updating a document
const updateForm = document.querySelector('.add')

let sumchange = true
let nowchange = true
function changesum() {
  if(sumchange == true) {
    sumchange = false
    return 1;
  } else if ( sumchange == false) {
    sumchange = true;
    return 0;
  } 
}
function changenow() {
  if(nowchange == true) {
    nowchange = false
    document.getElementById("changetext").innerHTML = "I calmed down"
    document.getElementById("stat").style.display = "block";
    movedown()
    return 1;
  } else if ( nowchange == false) {
    nowchange = true;
    document.getElementById("changetext").innerHTML = "I'm feeling stressed"
    document.getElementById("stat").style.display = "none";
    document.getElementById("weglad").style.display = "block"
    setTimeout(() => {
      document.getElementById("weglad").style.display = "none"
     }, 2000);
     moveup()
    return -1;
  } 
}

updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'cry', 'master')

  updateDoc(docRef, {
    now: increment(changenow()),
    sum: increment(changesum())
  })
  .then(() => {
    updateForm.reset()
  })
})



function refreshData( now, sum) {
    let text = "It's okay";
    if( now != 0) {
      text += ", you are not alone! " + now + "   people also feel  a little bit under the weather now.\n" 
    } else { text += "!\n"}
    text += "Altogether we felt like this " + sum + " times."  
    document.getElementById('stat').innerHTML = text;
}

function moveup() {
    document.getElementById("changetext").style.bottom = "50%";
}

function movedown() {
  document.getElementById("changetext").style.bottom = "0%";
}