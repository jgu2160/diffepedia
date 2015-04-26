require 'rails_helper'

RSpec.describe Article, type: :model do
  let(:article) { Article.new(url: "https://en.wikipedia.org/wiki/Land_speed_record_for_rail_vehicles") }
  let(:article_2) { Article.new(url: "https://zh-min-nan.wikipedia.org/wiki/Hûn") }
  let(:invalid_article) { Article.new(url: "https://not_valid_path.wikipedia.org/wiki/not_valid_article") }

  it { should have_many :user_articles}
  it { should have_many :users}

  it 'validates the correct format' do
    expect(article).to be_valid
  end

  it 'validates the correct format' do
    expect(article_2).to be_valid
  end

  it 'invalidates the incorrect format' do
    expect(invalid_article).not_to be_valid
  end
end
