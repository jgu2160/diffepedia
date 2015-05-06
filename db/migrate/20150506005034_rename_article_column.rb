class RenameArticleColumn < ActiveRecord::Migration
  def change
    rename_column :articles, :url, :lang_1_url
  end
end
