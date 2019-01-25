class RecipesController < ApplicationController
  def index
    @recipes = Recipe.all
    render json: @recipes
  end

  def create
    recipe = Recipe.create(name: params["name"], imageURL: params["imageUrl"], user_id: params["userID"])

    ingredient_ids = []

    params["ingredients"].each do |i|
      ingredient = Ingredient.create(name: i)
      ingredient_ids.push(ingredient.id)
    end

    ingredient_ids.each do |id|
      RecipeIngredient.create(recipe_id: recipe.id, ingredient_id: id)
    end

    count = 0

    while (count < (params["stepURL"].length)) do
      Step.create(imageURL: params["stepURL"][count], howTo: params["step"][count], recipe_id: recipe.id)
      count += 1
    end

    render json: recipe
  end
end
