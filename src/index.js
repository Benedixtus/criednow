import { initializeApp} from 'firebase/app'
import {
    getFirestore, collection,
    doc, onSnapshot,
    query, where,
    getDoc, addDoc, serverTimestamp
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

let now = new Date();
let today = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0)
console.log(now)
console.log(today)

//queries
const q = query(colRef, where('today', '>', today) )


// real time collection data
onSnapshot(q, (snapshot) => { // vagy colRef
    let cry = []
    snapshot.docs.forEach((doc) => {
        cry.push({ ...doc.data(), id: doc.id })
    })
    console.log(cry.length)
  })

// get single document
const docRef = doc(db, 'cry', 'master')

onSnapshot(docRef, (doc) => {
    refreshData(doc.data().now, doc.data().sum)
})

// updating a document
const updateForm = document.querySelector('.add')


updateForm.addEventListener('submit', (e) => {
  e.preventDefault()


  addDoc(colRef, {
    today: serverTimestamp(),
    now : valami.length

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

