var firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDK78KeL6Dum61vpMmSRhtAC2MB-CYT0A0",
  authDomain: "todo-7cc5e.firebaseapp.com",
  projectId: "todo-7cc5e",
  storageBucket: "todo-7cc5e.appspot.com",
  messagingSenderId: "336722703037",
  appId: "1:336722703037:web:b517c4d593e12a028f7dd4"
})

var db = firebaseApp.firestore();
var auth = firebaseApp.auth();
var usersCollection = db.collection('users');

const register = () => {
  auth.signOut()
  .then(()=>{
      console.log("done log OUT")
  })
  .catch((err)=>{

  })
}

const login = () => {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  console.log(email, password)
  auth.signInWithEmailAndPassword(email, password)
  .then((res)=>{
    console.log(res.user)

    window.location.assign('index.html')
  })
  .catch((err)=>{
    alert(err.code)

    console.log(err.code)
    console.log(err.message)
  })
}

(()=>{
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // Пользователь залогинен
        console.log("USER!!!")
        console.log(user);
      } else {
        // Пользователь не залогинен
        console.log("Пользователь не залогинен");
      }
    });
})()