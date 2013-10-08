class PoemsController < ApplicationController
  skip_before_action :require_login, except: [:create, :snap, :unsnap]
  respond_to :html, :json

  def index
    respond_with(@poems = Poem.all.reverse)
  end

  def create
    puts '*'* 80
    p params
    poet = Poet.find_by(session[:poet_id])
    @poem = poet.poems.new(poem_params)

    if @poem.save
      # TwitterAPI.new(poet.oauth_token, poet.oauth_secret).tweet(poem.content)
      # redirect_to root_path flash[:success] = "Your word is a sun, when you let it go, it joins the stars"
      respond_with(@poem)
    else
      puts 'bad '* 80
      #@error_message = @poem.errors.messages[:content].join
      # render :index
      respond_with(@poem)
    end
  end

  def snap
    poem = Poem.find(params[:id])
    unless poem.snaps.find_by_poet_id(session[:poet_id])
      poem.snaps.create(poet_id: session[:poet_id])
      poem.snap_count += 1
      poem.save 
    end
    redirect_to root_path
  end

  def unsnap
    poem = Poem.find(params[:id])
    if snap = poem.snaps.find_by_poet_id(session[:poet_id])
      snap.destroy
      poem.snap_count -= 1
      poem.save 
    end
    redirect_to root_path
  end

  private

  def poem_params
    params.require(:poem).permit(:title, :content)
  end
end
