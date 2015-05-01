class ComparisonsController < ApplicationController
  MAX_CHARACTERS = 10_000
  def new
  end

  def create
    comparison = Comparison.new(params[:comparison][:lang1Text], params[:comparison][:lang2Text], params[:comparison][:lang1], params[:comparison][:lang2])
    render json: comparison.result
  end
end
