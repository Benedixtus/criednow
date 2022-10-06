import { initializeApp} from 'firebase/app'
import {
    getFirestore, collection,
    doc, onSnapshot,
    query, where, updateDoc, deleteDoc,
    getDoc, addDoc, serverTimestamp, increment
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
const colRef = collection(db, 'today')

let now = new Date();
let today = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0)

//queries
const q = query(colRef, where('today', '>', today) )
const stat = query(colRef, where('today', '<', today) )


// real time collection data
onSnapshot(q, (snapshot) => { // vagy colRef
  let today = []
  snapshot.docs.forEach((doc) => {
      today.push({ ...doc.data() })
  })
  console.log(today.length)
  maketoday(today.length)
  refreshToday(today.length)
})



// real time collection data
onSnapshot(stat, (snapshot) => { // vagy colRef
  let today = []
  snapshot.docs.forEach((doc) => {
      today.push({ ...doc.data(),   id: doc.id})
  })
  if(today.length > 0){

    const sumRef = doc(db, 'sum', 'sum_of_all')
    updateDoc(sumRef, {
      count: increment(today.length)
    })
    for(let  i = 0; i < today.length; i++) {
      const deleteRef = doc(db, 'today', today[i].id)
      deleteDoc(deleteRef)
    }
  }
})

// get single document
const docRef = doc(db, 'sum', 'sum_of_all')

onSnapshot(docRef, (doc) => {
      console.log(doc.data().count)   // osszes kiiratas kifejtes
      makesum(doc.data().count)
})

// adding a document
const updateForm = document.querySelector('.add')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    today: serverTimestamp()

})
.then(() => {
    updateForm.reset()
})
})


function refreshAll(ltoday, lsum) {
  let text;
  
  text = "Altogether we felt like this " + (ltoday + lsum) + " times."  
  document.getElementById('all').innerHTML = text;

}

function refreshToday(today) {
  let text = "It's okay";
    if( today != 0) {
      text += ", you are not alone!<br> " + (parseInt(today)+ 1)+ "   people also feel  a little bit under the weather now.\n" 
    } else { text += "!\n"}
  document.getElementById('today').innerHTML = text;
}


function makesum(a) {
  lsum = a;
  console.log("lsum: "+ lsum )
}
function maketoday(a) {
  ltoday = a;
  console.log("ltoday: "+ ltoday )
  refreshAll(ltoday,lsum)
}
let lsum;
let ltoday;
