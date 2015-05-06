class AddColumnsToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :lang_1, :string
    add_column :articles, :lang_2_url, :string
    add_column :articles, :lang_2, :string
    add_column :articles, :lang_1_text, :text
    add_column :articles, :lang_2_text, :text
  end
end
