class Article < ActiveRecord::Base
  has_many :user_articles
  has_many :users, through: :user_articles
  validates :url, format: { with: /https:\/\/[A-Za-z]{2}.wikipedia.org\/wiki\/.+/, message: "only valid wikipedia url"  }
end
