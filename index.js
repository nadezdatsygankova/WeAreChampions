import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update, runTransaction } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://listapp-eed51-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const textAreaEl = document.getElementById("textArea-field")
const inputFieldFromEl = document.getElementById("from")
const inputFieldToEl = document.getElementById("to")

const endorsementsListEl = document.getElementById("endorsements")

const formInformation = document.getElementById('contactForm')


formInformation.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  let textAreaValue = textAreaEl.value
  let inputFromValue = inputFieldFromEl.value
  let inputToValue = inputFieldToEl.value
  let count = 0
  let endorsement = { from: inputFromValue, text: textAreaValue, to: inputToValue, count: count };
  push(endorsementsInDB, endorsement)
  formInformation.reset();
}

onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val())
    console.log(itemsArray)
    clearEndorsementsListEl()

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]
      let currentItemID = currentItem[0]
      let currentItemValue = currentItem[1]

      appendItemToListEl(currentItem)
    }
  } else {
    endorsementsListEl.innerHTML = "No items here... yet"
  }

})

function clearEndorsementsListEl() {
  endorsementsListEl.innerHTML = ""
}


function appendItemToListEl(item) {
  let itemID = item[0]
  let itemValue = item[1]
  let newEl = document.createElement("div")
  newEl.className = 'endorsement'
  let newElTitleFrom = document.createElement("h3")

  let newElTitleTo = document.createElement("h3")
  let newElTitleText = document.createElement("p")

  let contFromLike = document.createElement("div")

  let buttonLike = document.createElement('button')
  let imgLike = document.createElement('img')
  let countText = document.createElement("strong")

  newEl.append(newElTitleTo)
  newEl.append(newElTitleText)
  newEl.append(contFromLike)

  contFromLike.append(newElTitleFrom)
  contFromLike.append(buttonLike)
  buttonLike.append(imgLike)
  buttonLike.append(countText)

  newElTitleFrom.textContent = `From ${itemValue.from}`
  newElTitleTo.textContent = `To ${itemValue.to}`
  newElTitleText.textContent = itemValue.text
  contFromLike.className='containerLikeButton'
  buttonLike.className = 'likeButton'
  imgLike.src = './img/❤️.png'
  imgLike.className = 'like'
  countText.textContent = `${itemValue.count}`

  buttonLike.addEventListener('click', () => {

    itemValue.count++;
    let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`)

    update(exactLocationOfItemInDB, {
      count: itemValue.count,
    }).then(() => {
      console.log("Count updated successfully!");
    }).catch((error) => {
      console.error("Count update failed: ", error);
    });
  })


  newEl.addEventListener("dblclick", function () {
    let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`)
    if(confirm("Are you sure you want to delete it?")){
      remove(exactLocationOfItemInDB)
    }

  })
  endorsementsListEl.append(newEl)
}