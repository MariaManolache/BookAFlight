let credentials = {
    userName: "Mihai",
    password: "safePassword"
}


//utile
let base_url = 'http://localhost:3000/'
let requestOptions = {
    method: 'GET',
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer'
}

//register
document.getElementById("register").addEventListener("click", register)

function register(e) {
    e.preventDefault()
    let data = {}
    data.emailAddress = document.getElementById("emailAddress").value
    data.password = document.getElementById("password").value

    let localRequestOptions = {...requestOptions}
    localRequestOptions.method = "POST"
    localRequestOptions.body = JSON.stringify(data)

    fetch(base_url + 'register', localRequestOptions)
}

//login
document.getElementById("login").addEventListener("click", login)

function login(e) {
    console.log ('sunt aici')
    e.preventDefault()
    let data = {}
    data.emailAddress = document.getElementById("loginEmailAddress").value
    data.password = document.getElementById("loginPassword").value

    let localRequestOptions = {...requestOptions}
    localRequestOptions.method = "POST"
    localRequestOptions.body = JSON.stringify(data)

    fetch(base_url + 'login', localRequestOptions)
    .then ((res) => {
        console.log('am primit raspuns', res)
        return (res.json())
    })
    .then((res) => {
        console.log('tokenul tau este ', res)
        localStorage.setItem('token', res.token)
    })
}


// populam lista de to-dos

fetch(base_url, requestOptions)
.then((res) => 
{
    if (res.status === 200) {
        console.log()
        return res.json()
    }

    else console.log('a aparut o eroare')
})
.then((res) => {
    if(res === undefined) {
        console.log('serverul nu a returnat nimic')
    } else{
        res.forEach((elem)=>{
            addRoomToUI(elem)
        })
    }
})


// adaugare to-do
document.getElementById("submit").addEventListener("click", addRoom)

function addRoom(event) {
    event.preventDefault()
    let newRoom = {}
    newRoom.roomName = document.getElementById("roomName").value
    newRoom.roomType = document.getElementById("type").value
    newRoom.id = null

    // const addRoomPromise = new Promise((resolve, reject) => {
    //     setTimeout(()=> {
    //         newRoom.id = (db.length != 0) ? Math.max(...db.map((el) => el.id)) + 1 : 0
    //         db.push(newRoom)
    //         resolve(newRoom)
    //     },0)
        
        
    // })
    // .then((res) => {
    //     addRoomToUI(res)        
    // })

    let localRequestOptions = {...requestOptions}
    localRequestOptions.method = "POST"
    localRequestOptions.body = JSON.stringify(newRoom)

    localRequestOptions.headers.Authorization = localStorage.getItem('token')

    fetch(base_url + 'rooms', localRequestOptions).then((res) => {
        if (res.status === 200) {
            console.log()
            let db=res.json().then((res)=>{
              db=res.db
              console.log(db)
              addRoomToUI(db[db.length - 1])
            //   const resRoom2 = dbFirebase.collection('rooms').doc('room2').set(db[1]);
            })
        
        }})
    

}

function addRoomToUI(elem) {
    let room = document.createElement("li")
    
    console.log(elem.roomName)
    let roomContainer = document.createElement("div")
    let roomName = document.createTextNode(elem.roomName)
    roomContainer.appendChild(roomName)

    room.appendChild(roomContainer)
    let roomType = document.createElement("div")
    let roomTypeText = document.createTextNode("Type: " + elem.roomType)
    roomType.appendChild(roomTypeText)
    room.appendChild(roomType)

    let deleteRoomButton = document.createElement("button")
    let deleteRoomButtonText = document.createTextNode("Delete")
    deleteRoomButton.appendChild(deleteRoomButtonText)
    deleteRoomButton.id = "DEL_BTN_" + elem.id
    deleteRoomButton.className = "DEL_BTN"
    deleteRoomButton.addEventListener("click", deleteToDo)
    room.appendChild(deleteRoomButton)

    let updateRoomButton = document.createElement("button")
    let updateRoomButtonText = document.createTextNode("Update")
    updateRoomButton.appendChild(updateRoomButtonText)
    updateRoomButton.id = "UPT_BTN_" + elem.id
    room.appendChild(updateRoomButton)

    room.id = elem.id
    room.className = "room"


    document.getElementById("myRooms").appendChild(room)
    document.getElementById("info").innerText = ""
}

// stergere to-do
let delButtons = Array.from(document.getElementsByClassName("DEL_BTN"))

delButtons.forEach((elem) => {
    elem.addEventListener("click", deleteToDo)
})

function deleteToDo(e) {
    if (checkCredentials(credentials.userName, credentials.password) === "authorized"){
        let id = e.target.id.split("_")[2]

        const deteleToDoPromise = new Promise ((resolve, reject) => {
        setTimeout(() => {
            db = db.filter((elem) => elem.id != id)
            resolve(id)
        }, 0)
        })
        .then ((res) => {
            document.getElementById(res).remove()
            if (document.querySelectorAll("li.room").length === 0) {
                document.getElementById("info").innerText = "Nu ai niciun to-do activ"
            }

    })

    } else console.log("nu ai voie sa efectuezi aceasta operatie")


    

}

// autentificare / autorizare 

function checkCredentials(userName, password) {

    let token = "notAuthorized"

    if (userName === "Mihai" && password === "safePassword") {
        token = "authorized"
    }

    return token
}