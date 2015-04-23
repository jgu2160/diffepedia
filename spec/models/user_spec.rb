require 'rails_helper'

RSpec.describe User, type: :model do
  it { should have_many :user_articles}
  it { should have_many :articles}
end
