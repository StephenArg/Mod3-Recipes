let debounce = _.debounce

function slapRecipeOnDOM(recipe){
    let div = document.createElement("div")
    div.innerHTML = `<h3>${recipe.name}</h3> <img src="${recipe.imageURL}" width="350" height="300"> <h3>Ingredients: </h3>
    <ul class="ingredient-container" >No ingredients listed.</ul> <h3>Directions: </h3> <div class="howTo-container">No Instructions. What kind of recipe is this?</div>`
    div.className = "recipe-card"
    div.dataset.id = recipe.id
    if (recipe.recipeIngredients.length > 0){
        let ingredientContainer = div.querySelector(".ingredient-container")
        ingredientContainer.innerText = ""
        recipe.recipeIngredients.forEach(i => {
        let li = document.createElement("li")
        li.innerText = `${i.amount} ${i.units} --- ${i.ingredient.name}`
        ingredientContainer.append(li)
        })
    }
    if (recipe.steps.length > 0){
        let howToContainer = div.querySelector(".howTo-container")
        howToContainer.innerText = ""
        recipe.steps.forEach(step => {
            let lilDiv = document.createElement("div")
            let lilPic = document.createElement("img")
            let lilStep = document.createElement("h4")
            lilPic.src = step.imageURL
            lilPic.width = "45"
            lilPic.height = "41"
            lilStep.innerText = step.howTo
            lilDiv.append(lilPic)
            lilDiv.append(lilStep)
            howToContainer.append(lilDiv)
        })
    }
    recipeContainer.append(div)
}

function parseRecipesByName(recipes, searchValue){
    recipeContainer.innerHTML = ""
    let resultRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(searchValue.toLowerCase()))
    resultRecipes.forEach(slapRecipeOnDOM)
}

function parseRecipesByIngredient(recipes, searchValue){
    recipeContainer.innerHTML = ""
    let resultRecipes = []
    if (searchValue === ""){
        recipes.forEach(slapRecipeOnDOM)
    } else {
    recipes.forEach(recipe => {
        for (ingredient of recipe.ingredients){
            if (ingredient.name.toLowerCase().includes(searchValue.toLowerCase())){
                resultRecipes.push(recipe)
            }
        }
    })
    resultRecipes.forEach(slapRecipeOnDOM)
   }
}


let recipeContainer = document.querySelector("#recipe-container")
let newRecipeBtn = document.querySelector("#new-recipe")
let searchRecipe = document.querySelector("#search-recipe")
let searchIngredient = document.querySelector("#search-ingredient")
let createUserBtn = document.querySelector("#create-user")

fetch("http://localhost:3000/recipes")
.then(res => res.json())
.then(recipes => recipes.forEach(slapRecipeOnDOM))

newRecipeBtn.addEventListener("click", function(e){
    let formContainer = document.querySelector("#form-container")
    formContainer.innerHTML = ""
    let form = document.createElement("FORM")
    form.id = "new-recipe-form"
    form.innerHTML = `
    <h3>Recipe Name</h3>
    <input type="text" class="form-inputs" name="name"/>
    
    <h3>Image URL</h3>
    <input type="text" name="imageURL" class="form-inputs"/>

    <h3>Recipe Author</h3>
    <input type="text" name="user" class="form-inputs"/>

    <h3>Ingredients:</h3>
    <ul id="form-ingredients-container">
        <li><input type="ingredient" name="ingredients" class="form-ingredients form-inputs" placeholder="Add one ingredient here."/></li>
    </ul>
    <button type="button" id="form-add-ingredient">Add Ingredient</button>
    <h3>Recipe Steps:</h3>
    <ul id="form-steps-container">
        <div>
            <li><input type="text" name="stepURL" class="form-step-urls form-inputs" placeholder="Add image URL for step here."/></li>
            <textarea class="form-steps form-inputs" name="step" type="textarea" form="new-recipe-form" name="howTo" placeholder="Add recipe step instructions here."></textarea>
        </div>
    </ul>
    <button type="button" id="form-add-step">Add Step</button>
    <br/>
    <br/>
    <input type="submit" value="Submit"> </input>
    `
    let formAddIngredient = form.querySelector("#form-add-ingredient")
    let formAddStep = form.querySelector("#form-add-step")

    formAddIngredient.addEventListener('click', function(e){
        e.stopPropagation()
        let formIngredientsContainer = form.querySelector("#form-ingredients-container")
        let newInput = document.createElement("li")
        newInput.innerHTML = `<input type="ingredient" name="ingredients" class="form-ingredients form-inputs" placeholder="Add one ingredient here."/>`
        formIngredientsContainer.append(newInput)
    })

    formAddStep.addEventListener('click', function(e){
        e.stopPropagation()
        let formStepsContainer = form.querySelector("#form-steps-container")
        let newInput = document.createElement("div")
        newInput.innerHTML = `<li><input type="text" name="stepURL" class="form-step-urls form-inputs" placeholder="Add image URL for step here."/></li>
        <textarea class="form-steps form-inputs" type="textarea" form="new-recipe-form" name="step" placeholder="Add recipe step instructions here."></textarea>`
        formStepsContainer.append(newInput)
    })

    form.addEventListener("submit", function(e){
        e.preventDefault()
        e.stopPropagation()
        
        let ingredientsValues = form.querySelectorAll(".form-ingredients")
        let ingredientNames = []

        if (ingredientsValues.length > 0){
        ingredientsValues.forEach(i => {
            ingredientNames.push(i.value)
        })
      }

        let stepUrlValues = form.querySelectorAll(".form-step-urls")
        let stepValues = form.querySelectorAll(".form-steps")
        let stepURLs = []
        let steps = []


        if (stepUrlValues.length > 0){
            stepUrlValues.forEach(k => {
                stepURLs.push(k.value)
            })
        }

        if (stepValues.length > 0){
            stepValues.forEach(k => {
                steps.push(k.value)
            })
        }


        let newRecipe = {
            "name" : e.target.name.value,
            "imageUrl" : e.target.imageURL.value,
            "userID" : 3,
            "ingredients" : ingredientNames,
            "stepURL" : stepURLs,
            "step" : steps
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

        // let ingredientsValues = form.querySelectorAll(".form-ingredients")
        // let usedIngredients = []
        // let newIngredients = []
        // let ingredientIDs = []

        // fetch("http://localhost:3000/ingredients")
        // .then(res => res.json())
        // .then(ingredients => {
        //     ingredients.forEach(ingredient => {
        //     ingredientsValues.forEach(i => {
        //         if (i.value.toLowerCase() === ingredient.name.toLowerCase()){
        //             usedIngredients.push(i.value.toLowerCase())
        //             ingredientIDs.push(ingredient.id)
        //         }
        //     })
        //    }
        //   )
        //   ingredientsValues.forEach(i => {
        //     if (usedIngredients.includes(i.value.toLowerCase())){}
        //      else {newIngredients.push(i.value)}
        //    })

        //    newIngredients.forEach(i => {
        //     let newIngr ={
        //         "name": i
        //     }
        //     fetch("http://localhost:3000/ingredients", {
        //         method: "POST",
        //         headers: {
        //         "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(newIngr)
        //     })
        //     .then(res => res.json())
        //     .then(ing => {ingredientIDs.push(ing.id)})
        //   })

       })
        

        

        // fetch("http://localhost:3000/recipes", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(newRecipe)
        // })
        // .then(res => res.json())
        // .then(slapRecipeOnDOM)
    // })
    formContainer.append(form)
})

searchRecipe.addEventListener("click", function(e){
    e.stopPropagation()
    let formContainer = document.querySelector("#form-container")
    formContainer.innerHTML = ""
    let form = document.createElement("FORM")
    form.id = "recipe-search-form"
    form.innerHTML = `<input id="recipe-search-bar" type="text" name="search" placeholder="Search by Recipe Name"/>`
    form.addEventListener('keyup', debounce(function(e){
        e.preventDefault()
        let searchValue = e.target.value
        fetch("http://localhost:3000/recipes")
        .then(res => res.json())
        .then(recipes => parseRecipesByName(recipes, searchValue))
    }, 350))
    formContainer.append(form)
})

searchIngredient.addEventListener('click', function(e){
    e.stopPropagation()
    let formContainer = document.querySelector("#form-container")
    formContainer.innerHTML = ""
    let form = document.createElement("FORM")
    form.id = "recipe-search-form"
    form.innerHTML = `<input id="recipe-search-bar" type="text" name="search" placeholder="Search by Ingredient Name"/>`
    form.addEventListener('keyup', debounce(function(e){
        e.preventDefault()
        let searchValue = e.target.value
        fetch("http://localhost:3000/recipes")
        .then(res => res.json())
        .then(recipes => parseRecipesByIngredient(recipes, searchValue))
    }, 350))
    formContainer.append(form)

})

createUserBtn.addEventListener('click', function(e){
    e.stopPropagation()
    let formContainer = document.querySelector("#form-container")
    formContainer.innerHTML = ""
    let form = document.createElement("FORM")
    form.id = "new-user-form"
    form.innerHTML = `
    <h3>New User's Name</h3>
    <input type="text" class="form-inputs" name="name"/>

    <h3>User Image URL</h3>
    <input type="text" class="form-inputs" name="url"/>
    <br/>
    <input type="submit" value="Submit"> </input>
    `

    form.addEventListener('submit', function(e){
        e.preventDefault()
        e.stopPropagation()
        
        let newUser = {
            "name": e.target.name.value,
            "imageURL": e.target.url.value
        }
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
        formContainer.innerHTML = "<h3>User Created</h3>"
    })
    formContainer.append(form)
})