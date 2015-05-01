class Comparison
  attr_accessor :lang1Text, :lang2Text
  attr_reader :lang1, :lang2
  MAX_CHARACTERS = 10_000

  def initialize(lang1Text, lang2Text, lang1, lang2)
    @lang1Text = lang1Text
    @lang2Text = lang2Text
    @lang1 = lang1
    @lang2 = lang2

    sanitize_texts
  end

  def sanitize_texts
    self.lang1Text = Sanitize.fragment(self.lang1Text, :elements => ['p', 'h2'])
    self.lang2Text = Sanitize.fragment(self.lang2Text, :elements => ['p', 'h2'])
    self.lang1Text = remove_disambiguation(self.lang1Text)
    self.lang2Text = remove_disambiguation(self.lang2Text)
  end

  def translate
    translator = BingTranslator.new(Figaro.env.bing_id, Figaro.env.bing_secret)
    thousands, hundreds = lang2Text.length.divmod(MAX_CHARACTERS)
    translation = ""
    if thousands == 0
      translation = translator.translate(self.lang2Text, from: lang2, to: lang1)
    else
      0.upto(thousands - 1) do |section_index|
        translation += translator.translate(self.lang2Text[(section_index * MAX_CHARACTERS)...(section_index + 1) * MAX_CHARACTERS], from: lang2, to: lang1)
      end
      translation += translator.translate(self.lang2Text[-hundreds..-1], from: lang2, to: lang1)
    end
      self.lang2Text = translation
  end

  def result
    { s1: lang1Text, s2: lang2Text, l1: lang1, l2: lang2 }
  end

  def remove_disambiguation(text)
    dis_index = text.index("<p>")
    text[dis_index..-1]
  end

  def score_words

  end
end
