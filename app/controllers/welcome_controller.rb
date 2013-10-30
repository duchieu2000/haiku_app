class WelcomeController < ApplicationController
  skip_before_action :require_login
  respond_to :html, :json

  def index
    @current_user = Poet.find(session[:poet_id]) if session[:poet_id]
    @poems = Poem.all
    @poets = Poet.all
  end
end