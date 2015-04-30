class ComparisonsController < ApplicationController
  MAX_CHARACTERS = 10_000
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
    thousands, hundreds = sanitized_2.length.divmod(MAX_CHARACTERS)
    if thousands == 0
      translation = translator.translate(sanitized_2, from: lang2, to: lang1)
    else
      translation = ""
      0.upto(thousands - 1) do |section_index|
        translation += translator.translate(sanitized_2[(section_index * MAX_CHARACTERS)...(section_index + 1) * MAX_CHARACTERS], from: lang2, to: lang1)
      end
      translation += translator.translate(sanitized_2[-hundreds..-1], from: lang2, to: lang1)
    end

    hash = { s1: sanitized_1, s2: translation, l1: lang1, l2: lang2 }
    render json: hash
  end
end
