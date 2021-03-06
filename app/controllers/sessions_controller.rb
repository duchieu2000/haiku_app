class SessionsController < ApplicationController
  skip_before_action :require_login, only: [:create]
  respond_to :json, :html

  def create
    poet = Poet.find_by_provider_and_uid(auth["provider"], auth["uid"]) || Poet.create_with_omniauth(auth)
    session[:poet_id] = poet.id

    redirect_to root_path
  end

  def destroy
    session[:poet_id] = nil
    redirect_to root_path
  end

  protected

  def auth
    request.env['omniauth.auth']
  end
end