require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/public'

get '/' do
  File.open('public/index.html', File::RDONLY)
end

get '/mixes' do
  File.open('public/mixes.html', File::RDONLY)
end

use Rack::SslEnforcer if ENV['RACK_ENV'] == 'production'
run Sinatra::Application
