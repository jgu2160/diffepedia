class SessionsController < ApplicationController
  def index
    render json: {user_id: current_user.id}
  end

  def create
    auth = request.env["omniauth.auth"]
    user = User.find_or_create_by_auth(auth)
    session[:user_id] = user.id
    redirect_to root_path
  end
end
