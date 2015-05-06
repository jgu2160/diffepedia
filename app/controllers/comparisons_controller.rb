class ComparisonsController < ApplicationController
  def new
  end

  def create
    comparison = Comparison.new(params[:comparison][:lang1Text], params[:comparison][:lang2Text], params[:comparison][:lang1], params[:comparison][:lang2])
    comparison.analyze_texts
    render json: comparison.result
  end
end
