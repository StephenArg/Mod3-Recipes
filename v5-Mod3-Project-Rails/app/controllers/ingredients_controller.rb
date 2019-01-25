class IngredientsController < ApplicationController
  def index
    @ingredients = Ingredient.all
    render json: @ingredients
  end

  def create
    Ingredient.create(name: params["name"])
  end
end
