
// let input = document.getElementById("create__footer__checkbox-description");
// let msg = document.getElementById("msg");
// let posts = document.getElementById("posts");
// let footer = document.getElementById("create__footer");

let form = document.getElementById("create__form");
let taskList = document.querySelector(".task-list");
let msg = document.getElementById("msg");

let moveSubmite = document.getElementById("move");
let addSubmite = document.getElementById("add");

let addInput = document.getElementById("create__footer__input");



// ---- ADD ----

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
        <input type="checkbox" name="option1" value="1" class="">
        <span class="description">${lastTaskData.text}</span>
        <button id="delete"><i onClick="" class="material-icons" id="delete__icon">delete</i></button>
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
// let deletePost = (e)=>{

//     e.parentElement.parentElement.remove();
// };

// let updatePost = (e)=>{
//     input.value = e.parentElement.previousElementSibling.innerHTML;
//     deletePost(e)
// };

// ---- MOVE ----

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
    else{
        msg.innerHTML = '';

        moveData();
    } 
};

let dataCards= []
let moveData = ()=>{
    dataCards.push({
        title: moveInput.value,
        cards: data
    })
    console.log(dataCards)

    createFormCard();
}

let createCard = (cardData)=>{
    return  cardData.cards.map(card => 
        `
        <div class="card" draggable="false">
            <input type="checkbox" name="option1" value="1" class="">
            <span class="description">${card.text}</span>
        </div>
        `).join("");
    }



let createFormCard = ()=>{
    let cardData = dataCards[dataCards.length - 1];

    cardList.innerHTML += `
    <form action="" id="main__in-progress__form">
    <header id="main__in-progress__header">
        <h3 class="title title_task">${cardData.title}</h3>
        <button type="submit" id="remove-done"><i onClick="" class="material-icons" id="remove-done__icon">remove_done</i></button>
    </header>

    <section class="cards cards_in-progress">
        ${createCard(cardData)}
    </section>     

    <footer id="main__in-progress__footer">
        <button type="submit" id="done"><i onClick="" class="material-icons" id="done__icon">done_all</i></button>
    </footer>    
</form>
    `;
    

    moveInput.value = '';
    addInput.value = '';
}