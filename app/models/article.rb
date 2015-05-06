class Article < ActiveRecord::Base
  has_many :user_articles
  has_many :users, through: :user_articles

  def result
    { s1: lang_1_text, s2: lang_2_text, l1: lang_1, l2: lang_2 }
  end
end

