class WelcomeController < ApplicationController
  skip_before_action :require_login
  respond_to :html, :json

  def landing
    # @current_user = Poet.find(session[:poet_id]) if session[:poet_id]
    @poems = Poem.order("positive_update ASC")
    @poets = Poet.all
  end
end