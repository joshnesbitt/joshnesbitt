require 'sinatra'

set :views, settings.root + '/views'
set :public_folder, File.dirname(__FILE__) + '/public'

before do
  host = ENV['APP_HOST']
  is_production = ENV['RACK_ENV'] == 'production'
  is_primary_host = request.host == host

  if is_production && (!request.ssl? || !is_primary_host)
    redirect("https://#{host}#{request.path_info}")
  end
end

not_found do
  erb :not_found
end

get '/' do
  @title = 'Software Engineer'
  erb :index
end

get '/mixes' do
  @title = 'Mixes'
  erb :mixes
end

run Sinatra::Application
