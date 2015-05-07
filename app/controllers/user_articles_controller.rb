class UserArticlesController < ApplicationController
  def create
    article = Article.where(lang_1_url: params[:lang1URL], lang_2_url: params[:lang2URL]).first
    UserArticle.create(user_id: params[:user_id], article_id: article.id)
  end
end
