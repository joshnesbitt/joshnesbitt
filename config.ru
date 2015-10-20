require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/public'

before do
  host = ENV['APP_HOST']
  is_production = ENV['RACK_ENV'] == 'production'
  is_primary_host = request.host == host

  if is_production && (!request.ssl? || !is_primary_host)
    redirect("https://#{host}#{request.path_info}")
  end
end

get '/' do
  File.open('public/index.html', File::RDONLY)
end

get '/mixes' do
  File.open('public/mixes.html', File::RDONLY)
end

run Sinatra::Application
