require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/public'

get '/' do
  File.open('public/index.html', File::RDONLY)
end
