Rails.application.routes.draw do
  get '/auth/:provider/callback', to: "sessions#create"
  get '/session', to: "sessions#index"
  root "comparisons#new"
  resources :comparisons
  resources :user_articles
end
