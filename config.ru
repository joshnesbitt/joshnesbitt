require 'sinatra'

set :views, settings.root + '/views'
set :public_folder, File.dirname(__FILE__) + '/public'

get '*' do
  erb :index
end

run Sinatra::Application
