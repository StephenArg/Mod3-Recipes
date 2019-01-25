class Recipe < ApplicationRecord
  belongs_to :user
  has_many :recipeIngredients
  has_many :ingredients, through: :recipeIngredients
  has_many :steps
end
