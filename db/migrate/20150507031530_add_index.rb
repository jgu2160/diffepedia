class AddIndex < ActiveRecord::Migration
  def change
    add_index :articles, :lang_1_url
    add_index :articles, :lang_2_url
  end
end
