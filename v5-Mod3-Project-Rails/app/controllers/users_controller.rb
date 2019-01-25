class UsersController < ApplicationController
  def create
    User.create(name: params["name"], imageURL: params["imageURL"])
  end
end
