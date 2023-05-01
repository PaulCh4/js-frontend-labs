let form = document.getElementById("create__form");
let taskList = document.querySelector(".task-list");
let msg = document.getElementById("msg");

let moveSubmite = document.getElementById("move");
let addSubmite = document.getElementById("add");

let addInput = document.getElementById("create__footer__input");


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

  const updateApp = ()=>{
    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.exists) {

                    dataCards = doc.data().dataCards;
                    cardsDataFailed = doc.data().cardsDataFailed;
                    cardsDataComplited = doc.data().cardsDataComplited;

                    createFormCard();
                    createFormCard_Failed()
                    createFormCard_Complited()
                    }
            });
        }
  })


}






//////////////////////////////////////////////////////////////////////////////////

// ---- ADD TO CREATE----

addSubmite.addEventListener("click",(e)=>{
    e.preventDefault()

    formAddValidation()
})

let formAddValidation = ()=>{
    if(addInput.value === ""){
        msg.innerHTML = "Post cannot be blank -xxx-";
    }
    else if(taskList.querySelectorAll(".task").length < 8){
        msg.innerHTML = '';

        acceptData();
    } 
    else {
        msg.innerHTML = "НИЗЯ МНОГА!";
    }
}; 

let data = [];
let acceptData = ()=> {     
    data.push({
        text: addInput.value
    })
    console.log(data);
    
    createTask();
};

let createTask = ()=>{
    let lastTaskData = data[data.length - 1];

    let newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerHTML = `
        <span class="description">${lastTaskData.text}</span>
        <button id="delete" onClick="deletePost(this)"><i class="material-icons" id="delete__icon">delete</i></button>
    `;

    newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
    });

    taskList.appendChild(newTask);
    addInput.value = '';
};

let deletePost = (e)=>{
    data.splice(e.parentElement.id, 1)
    e.parentElement.remove();
};








///////////////////////////////////////////////////////////////////////////////////

// ---- MOVE TO IN-PROGRESS----

let formProgress = document.getElementById("main__in-progress__form");
let cardList= document.querySelector(".main__in-progress");

let doneSubmite = document.getElementById("done");
let doneRemoveSubmite = document.getElementById("remove-done");

let moveInput = document.getElementById("create__header__input");


moveSubmite.addEventListener("click",(e)=>{
    e.preventDefault()

    formMoveValidation()
})

let formMoveValidation = ()=>{
    if(moveInput.value === ""){
        msg.innerHTML = "Post cannot be blank -xxx-";
    }
    else if(taskList.innerHTML.trim() === ''){
        msg.innerHTML = "Надо чет заполнить";
    }
    else{
        msg.innerHTML = '';

        moveData();
    } 
};

//!!!!!!!!!
let dataCards = [];
const moveData = () => {
    console.log("dataCards: " + dataCards + " data: " + data)

    let checked = new Array(data.length).fill(false)

    dataCards.push({
        title: moveInput.value,
        cards: data,
        checked: checked
    });


    auth.onAuthStateChanged(user => {
        
        // if (user) {
        //   // Сохранение данных списка в Firestore для текущего пользователя
        //   db.collection('users').doc(user.uid).set({
        //     dataCards: dataCards
        //   }, { merge: true });

        //   db.collection('users').doc(user.uid).get().then(doc => {
        //     if (doc.exists) {
        //       console.log(doc.data());
        //     }
        //   });
        // }
        
        if (user) {
            // Добавление нового элемента в конец списка в Firestore для текущего пользователя
            db.collection('users').doc(user.uid).update({
                dataCards: firebase.firestore.FieldValue.arrayUnion(dataCards[dataCards.length - 1])
            });
          }
      });
    
    console.log(">>" + dataCards[0].checked)

    createFormCard();
}
let createCard = (cardData)=>{
    return cardData.cards.map((card, index) => {
        if (cardData.checked[index] === true) {
            return `
                <div class="card" draggable="false">
                    <input type="checkbox" name="option1" value="1" checked> 
                    <span class="description">${card.text}</span>
                </div>
            `;
        } else {
            return `
                <div class="card" draggable="false">
                    <input type="checkbox" name="option1" value="1" unchecked> 
                    <span class="description">${card.text}</span>
                </div>
            `;
        }
    }).join("");
}

//###FIREBASE
let createFormCard = () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            

            cardList.innerHTML=`<h2 class="title title_in-progress">In Progress</h2>`
            dataCards.forEach(cardData => {
                cardList.insertAdjacentHTML('beforeend', `
                        <form action="" id="main__in-progress__form">
                            <header id="main__in-progress__header">
                            <h3 class="title title_task">${cardData.title}</h3>
                            <button class="remove-done" onClick="doneFailed(this)"><i onClick="" class="material-icons" id="remove-done__icon">remove_done</i></button>
                            </header>
                            <section class="cards cards_in-progress">
                            ${createCard(cardData)}
                            </section>
                            <footer id="main__in-progress__footer">
                            <button class="done" onClick="doneComplited(this)"><i class="material-icons" id="done__icon">done_all</i></button>
                            </footer>
                        </form>
                `);

                const form = document.querySelector('#main__in-progress__form');
                const doneButton = form.querySelector('.done');
                const removeDoneButton = form.querySelector('.remove-done');

                doneButton.addEventListener("click",(e)=>{
                    e.preventDefault()    
                })
                removeDoneButton.addEventListener("click",(e)=>{
                    e.preventDefault()    
                    console.log("<!>")
                })

                doneButton.style.backgroundColor = ''; 

                clearTaskList();
                moveInput.value = '';
                addInput.value = '';
                data = [];
                
            });
            checkboxLogic();
            
            }
        });
}
function clearTaskList() {
    const taskList = document.querySelector('.task-list');

    taskList.innerHTML = '';
    msg.innerHTML = "";
}












///////////////////////////////////////////////////////////////////////////////////

// ---- CHECKBOX ----




let checkboxLogic = () => {
    document.querySelectorAll('.cards_in-progress').forEach((cards) => {
        const checkboxes = cards.querySelectorAll('input[type="checkbox"]');
        const form = cards.parentElement;

        const doneButton = form.querySelector('.done');

        const allChecked = [...checkboxes].every(checkbox => checkbox.checked);
        if (allChecked) {
            doneButton.style.backgroundColor = 'white';
        } else {
            doneButton.style.backgroundColor = '';
        }

        checkboxes.forEach((checkbox) => {




            checkbox.addEventListener('click', (e) => {
                const clickedCard = e.target.closest('.card');
                if (clickedCard) {

                    const cardsList = document.querySelectorAll('.cards_in-progress');
                    const clickedCard222 = e.target.closest('.cards_in-progress');
                    const cardIndex222 = Array.from(cardsList).indexOf(clickedCard222);

                    const cardIndex = Array.from(cards.children).indexOf(clickedCard);

                    const updateCardState = (cardIndex, checkboxIndex) => {
                        console.log("dataCards: " + dataCards.checked + " data: " + data + "||"+cardIndex+" "+checkboxIndex)
                     
                        dataCards[cardIndex].checked[checkboxIndex] = !dataCards[cardIndex].checked[checkboxIndex];
                        console.log("1||  " + dataCards[0].checked)
                    }
                    updateCardState(cardIndex222, cardIndex)

                    console.log("2||  " + dataCards[0].checked)                 
                    auth.onAuthStateChanged(user => {
                        if (user) {
                        db.collection('users').doc(user.uid).set({
                                dataCards: dataCards
                            }, { merge: true });
                        }
                        console.log("3||  " + dataCards[0].checked)
                    });
                }
                






                const allChecked = [...checkboxes].every(checkbox => checkbox.checked);
                if (allChecked) {
                    doneButton.style.backgroundColor = 'white';
                } else {
                    doneButton.style.backgroundColor = '';
                }
            });




            
        });
    });
}







///////////////////////////////////////////////////////////////////////////////////

// ---- MOVE TO FAILED ----

let cardListFailed = document.querySelector(".main__failed");


let doneFailed = ((e)=>{
    console.log(e)
    
    const cardsList = document.querySelectorAll('#main__in-progress__form');
    const clickedCard = e.closest('#main__in-progress__form');
    const cardIndex = Array.from(cardsList).indexOf(clickedCard);

    moveToFailed(e, cardIndex)
})

let cardsDataFailed = [];
const moveToFailed = (e, cardIndex) => {
  const cardData = dataCards.splice(cardIndex, 1)[0];
  cardsDataFailed.push(cardData);

  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('users').doc(user.uid).set({
            dataCards: dataCards,
            cardsDataFailed: cardsDataFailed,
        }, { merge: true });
      }
  });
  

  //console.log("cardsDataFailed|e: "+e+" |faled: "+cardsDataFailed+"|complited: "+cardsDataCompleted)
  e.parentElement.parentElement.remove();
  createFormCard()

  createFormCard_Failed();
}
let createFormCard_Failed = () => {

    auth.onAuthStateChanged(user => {
        if (user) {
            
            
            cardListFailed.innerHTML=`<h2 class="title title_failed">Failed</h2> `
            cardsDataFailed.forEach(cardData => {
                cardListFailed.insertAdjacentHTML('beforeend', 
                    `
                    <form action="" id="main__failed__form">
                        <header id="main__failed__header">
                            <h3 class="title title_task">${cardData.title}</h3>
                            <button type="button" class="remove-done" onClick="deleteCards(this)" ><i class="material-icons" id="remove-done__icon">remove</i></button>
                        </header>

                        <section class="cards cards_failed">
                            ${createCard_Failed(cardData)}
                        </section>        
                    </form>
                `);
                

                moveInput.value = '';
                addInput.value = '';
            });

            
        }
    });
    }

let createCard_Failed = (cardData) => {
    console.log(":::" + cardData.checked);

    return cardData.cards.map((card, index) => {
        if (cardData.checked[index] === true) {
            return `
                <div class="card" draggable="false">
                    <input type="checkbox" name="option1" value="1" checked disabled> 
                    <span class="description" style="color: #c29d7fbe; text-decoration: line-through">${card.text}</span>
                </div>
            `;
        } else {
            return `
                <div class="card" draggable="false">
                    <input type="checkbox" name="option1" value="1" unchecked disabled> 
                    <span class="description" style="color: red;">${card.text}</span>
                </div>
            `;
        }
    }).join("");
}


    










///////////////////////////////////////////////////////////////////////////////////

// ---- MOVE TO COMPLITED ----

let cardListComplited = document.querySelector(".main__complited");


let doneComplited = ((e)=>{
    console.log(e)
    
    if(e.style.backgroundColor == 'white'){
        const cardsList = document.querySelectorAll('#main__in-progress__form');
        const clickedCard = e.closest('#main__in-progress__form');
        const cardIndex = Array.from(cardsList).indexOf(clickedCard);
        
        console.log("e.closest: " + clickedCard + " Index: "+ cardIndex + " Ca: "+ cardList)
        console.log(clickedCard)
        console.log(cardList)
        moveToComplited(e, cardIndex)
    }
})

let cardsDataComplited = [];
const moveToComplited = (e, cardIndex) => {
  const cardData = dataCards.splice(cardIndex, 1)[0];
  cardsDataComplited.push(cardData);

  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('users').doc(user.uid).set({
            dataCards: dataCards,
            cardsDataFailed: cardsDataFailed,
            cardsDataComplited: cardsDataComplited,
        }, { merge: true });
      }
  });

  //console.log(e)
  e.parentElement.parentElement.remove();
  createFormCard()

  createFormCard_Complited();
}


let createFormCard_Complited = () => {

    auth.onAuthStateChanged(user => {
        if (user) {
            
            
            cardListComplited.innerHTML=`<h2 class="title title_complited">Complited</h2> `
            cardsDataComplited.forEach(cardData => {
                cardListComplited.insertAdjacentHTML('beforeend',
                `
                <form action="" id="main__complited__form">
                    <header id="main__complited__header">
                        <h3 class="title title_task">${cardData.title}</h3>
                        <button type="button" class="remove-done" onClick="deleteCards(this)" ><i class="material-icons" id="remove-done__icon">remove</i></button>
                    </header>

                    <section class="cards cards_complited">
                        ${createCard_Complited(cardData)}
                    </section>        
                </form>
    `       );
    
            moveInput.value = '';
            addInput.value = '';

        });

            
    }
});
}

let createCard_Complited = (cardData)=>{
    return  cardData.cards.map(card => 
        `
        <div class="card" draggable="false">
            <input type="checkbox" name="option1" value="1" checked disabled> 
            <span class="description" style="color: green; text-decoration: line-through;">${card.text}</span>
        </div>
        `).join(""); //id="myCheckbox" 
    }











///////////////////////////////////////////////////////////////////////////////////

// ---- DELETE CARDS FROM _----

let deleteCards = ((e)=>{
    //console.log("deleteCards|e: "+e+" |faled: "+cardsDataFailed+"|complited: "+cardsDataCompleted)
    
    if (e.closest('.main__failed')) {

        const cardsList = document.querySelectorAll('#main__failed__form');
        const clickedCard = e.closest('#main__failed__form');
        const cardIndex = Array.from(cardsList).indexOf(clickedCard);

        cardsDataFailed.splice(cardIndex, 1)[0];
        auth.onAuthStateChanged(user => {
            if (user) {
              db.collection('users').doc(user.uid).set({
                cardsDataFailed: cardsDataFailed
              }, { merge: true });
            }
          });

    } else if (e.closest('.main__complited')) {

        const cardsList = document.querySelectorAll('#main__complited__form');
        const clickedCard = e.closest('#main__complited__form');
        const cardIndex = Array.from(cardsList).indexOf(clickedCard);

        cardsDataComplited.splice(cardIndex, 1)[0];
        auth.onAuthStateChanged(user => {
            if (user) {
              db.collection('users').doc(user.uid).set({
                dataCards: dataCards,
                cardsDataFailed: cardsDataFailed,
                cardsDataComplited: cardsDataComplited,
              }, { merge: true });
            }
          });
    }


    //console.log("|e: "+e+" |faled: "+cardsDataFailed+"|complited: "+cardsDataCompleted)
    console.log(e)
    e.parentElement.parentElement.remove();
})














///////////////////////////////////////////////////////////////////////////////////

// ---- DRAG&DROP ----

    const draggables = document.querySelectorAll(".task");
    const droppables = document.querySelectorAll(".task-list");


draggables.forEach((task)=>{
    task.addEventListener("dragstart", ()=> {
        task.classList.add("is-dragging")
    })
    task.addEventListener("dragend", ()=> {
        task.classList.remove("is-dragging")
    })
});

droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        const bottomTask = insertAboveTask(zone, e.clientY);
        const curTask = document.querySelector(".is-dragging");
        if (!bottomTask) {
            zone.appendChild(curTask);
        } else {
            zone.insertBefore(curTask, bottomTask);
        }
    });
    zone.addEventListener("drop", (e) => {
        data=[];
        const tasks = zone.querySelectorAll(".task")
        tasks.forEach(task =>{
            data.push({
                text: task.querySelector(".description").textContent
            })
        })
    });
});

const insertAboveTask = (zone, mouseY) => {
    const els = zone.querySelectorAll(".task:not(.is-dragging)")

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
        const { top } = task.getBoundingClientRect();

        const offset = mouseY - top;

        if(offset < 10 && offset > closestOffset){ 
            closestOffset = offset;
            closestTask = task;
        }
    })

    return closestTask;
}


///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


(()=>{
    // data = JSON.parse(localStorage.getItem("data"))||[];
    // createTask();
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //       // Пользователь залогинен
    //       console.log("USER!!!")
    //       console.log(user);
    //       console.log(user.uid);
    //     } else {
    //       // Пользователь не залогинен
    //       console.log("Пользователь не залогинен");
    //     }
    //   });

      updateApp()
})()
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



//#######FIREBASE
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
const logOut = () => {
    auth.signOut()
    .then(()=>{
        console.log("done log OUT")
    })
    .catch((err)=>{

    })

    window.location.assign('auth.html')
  }




