Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV["twitter_id"], ENV["twitter_secret"]
end
