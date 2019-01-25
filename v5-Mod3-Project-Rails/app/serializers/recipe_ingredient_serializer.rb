class RecipeIngredientSerializer < ActiveModel::Serializer
  attributes :id, :amount, :units, :ingredient
end
