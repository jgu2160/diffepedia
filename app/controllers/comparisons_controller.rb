class ComparisonsController < ApplicationController
  def new
  end

  def create
    article = Article.where(lang_1_url: params[:lang1URL], lang_2_url: params[:lang2URL]).first
    if article
      render json: article.result
    else
      comparison = Comparison.new(params[:comparison][:lang1Text], params[:comparison][:lang2Text], params[:comparison][:lang1], params[:comparison][:lang2], params[:lang1URL], params[:lang2URL])
      comparison.analyze_texts
      article = comparison.save_article
      render json: article.result
    end
  end
end
