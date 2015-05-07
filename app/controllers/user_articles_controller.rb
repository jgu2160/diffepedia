class UserArticlesController < ApplicationController
  def index
    user = User.find_by(id: params[:user_id])
  end

  def create
    article = Article.where(lang_1_url: params[:lang1URL],
                            lang_2_url: params[:lang2URL]).first
    user_article = UserArticle.find_or_create_by(user_id: params[:user_id], article_id: article.id)
    render json: { created: user_article }
  end
end
