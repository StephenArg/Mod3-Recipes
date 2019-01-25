Rails.application.routes.draw do
  resources :recipes
  resources :users, only: [:create]
end
