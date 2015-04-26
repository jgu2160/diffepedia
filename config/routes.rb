Rails.application.routes.draw do
  get '/auth/:provider/callback', to: "sessions#create"
  root "comparisons#new"
  resources :comparisons
end
