class ComparisonsController < ApplicationController
  def new
  end

  def create
    lang1 = params[:comparison][:lang1]
    lang2 = params[:comparison][:lang2]
    lang1Text = params[:comparison][:lang1Text]
    lang2Text = params[:comparison][:lang2Text]
    sanitized_1 = Sanitize.fragment(lang1Text, :elements => ['p', 'h2'])
    sanitized_2 = Sanitize.fragment(lang2Text, :elements => ['p', 'h2'])
    translator = BingTranslator.new(Figaro.env.bing_id, Figaro.env.bing_secret)

    begin
      sanitized_2 = translator.translate(sanitized_2, from: lang2, to: lang1)
    rescue
      half = sanitized_2.length / 2
      first_half = translator.translate(sanitized_2[0...half], from: lang2, to: lang1)
      second_half = translator.translate(sanitized_2[half..-1], from: lang2, to: lang1)
      sanitized_2 = first_half + second_half
    end

    hash =
      {
      s1: sanitized_1,
      s2: sanitized_2,
      l1: lang1,
      l2: lang2
    }
      render json: hash
  end
end
