class Comparison
  attr_accessor :lang1Text, :lang2Text
  attr_reader :lang1, :lang2
  MAX_CHARACTERS = 10_000

  def initialize(lang1Text, lang2Text, lang1, lang2)
    @lang1Text = lang1Text
    @lang2Text = lang2Text
    @lang1 = lang1
    @lang2 = lang2

    sanitize_html
    translate
    clean
  end

  def clean
    destroy_headers
    split_p
    delete_n
    comb_words
  end

  def sanitize_html
    self.lang1Text = Sanitize.fragment(self.lang1Text, :elements => ['p', 'h2'])
    self.lang2Text = Sanitize.fragment(self.lang2Text, :elements => ['p', 'h2'])
    self.lang1Text = remove_disambiguation(self.lang1Text)
    self.lang2Text = remove_disambiguation(self.lang2Text)
  end

  def split_p
    self.lang1Text = self.lang1Text.split("<p>").map { |fragment| fragment.split("</p>") }.flatten
    self.lang2Text = self.lang2Text.split("<p>").map { |fragment| fragment.split("</p>") }.flatten
  end

  def delete_n
    self.lang1Text = self.lang1Text.reject { |fragment| fragment[/\n/]}
    self.lang2Text = self.lang2Text.reject { |fragment| fragment[/\n/]}
  end

  def comb_words
    self.lang1Text = self.lang1Text.map { |str| delete_punc(str) }
    self.lang2Text = self.lang2Text.map { |str| delete_punc(str) }
  end

  def delete_punc(str)
    UnicodeUtils.each_word(str).map { |w| w }.select { |w| w[/\p{word}+/]}.join(" ")
  end

  def destroy_headers
    self.lang1Text.gsub!(h2_regex, "")
    self.lang2Text.gsub!(h2_regex, "")
  end

  def h2_regex
    /<h2>[\w|\s]+<\/h2>/
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
