class ComparisonsController < ApplicationController
  def new
  end

  def create
    #code to create comparison metrics here
    render json: comparison_params
  end

  private

  def comparison_params
    params.require(:comparison).permit(:article_1, :article_2)
  end
end
