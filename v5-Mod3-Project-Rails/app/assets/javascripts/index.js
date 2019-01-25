let debounce = _.debounce

function slapRecipeOnDOM(recipe){
    console.log(recipe)
    let div = document.createElement("div")
    div.innerHTML = `<h3>${recipe.name}</h3> <img src="${recipe.imageURL}" width="350" height="300">
    <h4>${recipe.ingredients}</h4> <h4 class="howTo_text">${recipe.howTo}</h4>`
    div.className = "recipe-card"
    div.dataset.id = recipe.id
    recipeContainer.append(div)
}

function parseRecipesByName(recipes, searchValue){
    recipeContainer.innerHTML = ""
    let resultRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(searchValue.toLowerCase()))
    resultRecipes.forEach(slapRecipeOnDOM)
}


let recipeContainer = document.querySelector("#recipe-container")
let newRecipeBtn = document.querySelector("#new-recipe")
let searchRecipe = document.querySelector("#search-recipe")
let searchIngredient = document.querySelector("#search-ingredient")

fetch("http://localhost:3000/recipes")
.then(res => res.json())
.then(recipes => recipes.forEach(slapRecipeOnDOM))

newRecipeBtn.addEventListener("click", function(e){
    let formContainer = document.querySelector("#form-container")
    formContainer.innerHTML = ""
    let form = document.createElement("FORM")
    form.id = "new-recipe-form"
    form.innerHTML = `
    <input type="text" name="name" placeholder="name"/>
    <br/>
    <input type="text" name="imageURL" placeholder="imageURL"/>
    <br/>
    <input type="text" name="ingredients" placeholder="ingredients (separate ingredients by spaces)"/>
    <br/>
    <textarea> form="new-recipe-form" name="howTo" placeholder="How to make this meal."</textarea>
    <input> type="submit" value="Submit" </input>
    `
    form.addEventListener("submit", function(e){
        e.stopPropagation()
        let i = e.target.ingredients.split(" ")
        let newRecipe = {
            "name" : e.target.name,
            "imageUrl" : e.target.imageURL,
            "userID" : 7,
            "howTo" : e.target.howTo,
            "ingredients" : i
        }
        fetch("http://localhost:3000/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newRecipe)
        })
        .then(res => res.json())
        .then(slapRecipeOnDOM)
    })
    formContainer.append(form)
})

searchRecipe.addEventListener("click", function(e){
    e.stopPropagation()
    let formContainer = document.querySelector("#form-container")
    formContainer.innerHTML = ""
    let form = document.createElement("FORM")
    form.id = "recipe-search-form"
    form.innerHTML = `<input id="recipe-search-bar" type="text" name="search" placeholder="Search by Recipe Name"/>`
    count = 1
    form.addEventListener('keyup', debounce(function(e){
        e.preventDefault()
        let searchValue = e.target.value
        fetch("http://localhost:3000/recipes")
        .then(res => res.json())
        .then(recipes => parseRecipesByName(recipes, searchValue))
    }, 500))
    formContainer.append(form)
})