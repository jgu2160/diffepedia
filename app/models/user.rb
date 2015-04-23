class User < ActiveRecord::Base
  has_many :user_articles
  has_many :articles, through: :user_articles

  def self.find_or_create_by_auth(auth)
    user = User.where(uid: auth["uid"]).first_or_create
    user.tap { |u| u.update_attributes name: auth["info"]["nickname"], image_url: auth["info"]["image"] }
  end
end
