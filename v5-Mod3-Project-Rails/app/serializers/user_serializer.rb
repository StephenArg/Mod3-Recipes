class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :imageURL
  has_many :recipes
end
