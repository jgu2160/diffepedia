class Comparison
  attr_accessor :lang1Text, :lang2Text
  attr_reader :lang1, :lang2, :unique1, :unique2
  MAX_CHARACTERS = 10_000

  def initialize(lang1Text, lang2Text, lang1, lang2)
    @lang1Text = lang1Text
    @lang2Text = lang2Text
    @lang1 = lang1
    @lang2 = lang2
  end

  def analyze_texts
    sanitize_html
    translate
    clean
    difference
    score_both_texts
  end

  def difference
    split_lang1 = self.lang1Text.map do |paragraph|
      paragraph.split(" ")
    end.flatten

    split_lang2 = self.lang2Text.map do |paragraph|
      paragraph.split(" ")
    end.flatten

    @unique1 = (split_lang1 - split_lang2)
    @unique2 = (split_lang2 - split_lang1)
  end

  def clean
    split_on_headers
    delete_n_and_p
    comb_words
  end

  def sanitize_html
    self.lang1Text = Sanitize.fragment(self.lang1Text, :elements => ['p', 'h2'])
    self.lang2Text = Sanitize.fragment(self.lang2Text, :elements => ['p', 'h2'])
    self.lang1Text = remove_disambiguation(self.lang1Text)
    self.lang2Text = remove_disambiguation(self.lang2Text)
  end

  def delete_n_and_p
    self.lang1Text = self.lang1Text.map { |fragment| fragment.gsub(/(<p>|<\/p>)/, " ") }
    self.lang1Text = self.lang1Text.map { |fragment| fragment.gsub(/\n/, " ") }
    self.lang2Text = self.lang2Text.map { |fragment| fragment.gsub(/(<p>|<\/p>)/, " ") }
    self.lang2Text = self.lang2Text.map { |fragment| fragment.gsub(/\n/, " ") }
  end

  def comb_words
    self.lang1Text = self.lang1Text.map { |str| delete_punc(str) }
    self.lang2Text = self.lang2Text.map { |str| delete_punc(str) }
  end

  def delete_punc(str)
    UnicodeUtils.each_word(str).map { |w| w }.select { |w| w[/\p{word}+/]}.join(" ")
  end

  def split_on_headers
    self.lang1Text = self.lang1Text.split(h2_regex)
    self.lang2Text = self.lang2Text.split(h2_regex)
  end

  def h2_regex
    /<h2>.+?<\/h2>/
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

  def score_both_texts
    self.lang1Text = score_words(self.lang1Text, unique1)
    self.lang2Text = score_words(self.lang2Text, unique2)
  end

  def score_words(text, unique_words)
    corpus = text.map do |paragraph|
      TfIdfSimilarity::Document.new(paragraph, library: :narray)
    end

    model = TfIdfSimilarity::TfIdfModel.new(corpus)

    tfidf_by_term = Hash.new(0)
    word_count = Hash.new(0)

    corpus.each do |paragraph|
      unique_words.each do |word|
        tfidf_by_term[word] += model.tfidf(paragraph, word)
        word_count[word] += 1
      end
    end

    tfidf_average = {}

    tfidf_by_term.each do |key,_|
      tfidf_average[key] = tfidf_by_term[key] / word_count[key]
    end

    tfidf_average.sort_by{|_,tfidf| -tfidf}.map { |a| a[0]}.join(" ")
  end
end
