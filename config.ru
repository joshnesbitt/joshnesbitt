require 'sinatra'

set :views, settings.root + '/views'
set :public_folder, File.dirname(__FILE__) + '/public'

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
