class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :name, :imageURL
  has_many :steps
  has_many :recipeIngredients
  has_many :ingredients, through: :recipeIngredients
end
