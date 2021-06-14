let addToy = false;

const API_DATABASE_URL = "http://localhost:3000/toys"
  

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  const renderToy = (toyObj) => {
    const cardDiv = document.createElement("div")
    cardDiv.classList.add("card")
      cardDiv.id = toyObj.id
      cardDiv.innerHTML = `
          <h2>${toyObj.name}</h2>
          <img src=${toyObj.image} class="toy-avatar" />
          <p>${toyObj.likes} Likes </p>
          <button data-id="${toyObj.id}" class="like-btn">Like <3</button>
          `
      const collectionDiv = document.querySelector("#toy-collection")
      collectionDiv.append(cardDiv)
  }
  const renderAllTheToys = (toyArray) => {
    toyArray.forEach(toyObj => { renderToy(toyObj) } )
  }

  fetch(API_DATABASE_URL)
  .then(response => response.json())
  .then(fetchedArray => { console.log(fetchedArray);
  
    renderAllTheToys(fetchedArray)
  });

  const newToyForm = document.querySelector(".add-toy-form")

    newToyForm.addEventListener("submit", event =>{ event.preventDefault(); 
        
        const toyName = event.target.name.value
        const toyImage = event.target.image.value
          const submit = event.target.submit
            console.log("submitted data", submit)


        fetch(API_DATABASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({ 
            "name": toyName,
            "image": toyImage,
            "likes": 0
          })
        })
        .then(response => response.json())
        .then(theThingWePostedButFromTheServer => renderToy(theThingWePostedButFromTheServer) )

    });



    const allCards = document.querySelector("#toy-collection")
    allCards.addEventListener("click", event =>{ event.preventDefault(); 
      if (event.target.matches(".like-btn")) {
        const pTagOfLikes = event.target.closest(".card").querySelector("p")   

        const likeCount = parseInt(pTagOfLikes.textContent)
        const newLikes = likeCount + 1
        
        const id = event.target.dataset.id

        const bodyObj = {

          likes: newLikes

        }
        fetch(`${API_DATABASE_URL}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj),
        })
        .then(r => r.json())
        .then(updatedToy => {

          console.log(updatedToy)
          pTagOfLikes.textContent = `${newLikes} Likes`
        })  
      }
    })


});