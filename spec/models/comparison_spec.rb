require 'rails_helper'

RSpec.describe Comparison, type: :model do
  let(:comparison) { Comparison.new(TEXT1, TEXT2, LANG1, LANG2, "english.com", "french.com" ) }
  it 'should leave h2s and ps' do
    comparison.sanitize_html
    expect(comparison.lang1Text).to match(/<p>/)
    expect(comparison.lang1Text).not_to match(/<span>/)
    expect(comparison.lang1Text).not_to match(/<i>/)
    expect(comparison.lang2Text).to match(/<p>/)
    expect(comparison.lang2Text).not_to match(/<span>/)
  end

  it 'should split based on h2' do
    comparison.sanitize_html
    comparison.split_on_headers
    expect(comparison.lang1Text[0]).to match(/<p>/)
    expect(comparison.lang1Text[0]).not_to match(/<h2>/)
    expect(comparison.lang2Text[0]).to match(/<p>/)
    expect(comparison.lang2Text[0]).not_to match(/<h2>/)
  end

  it 'should delete ps and \ns' do
    comparison.sanitize_html
    comparison.split_on_headers
    comparison.delete_n_and_p
    expect(comparison.lang1Text[0]).not_to match(/<p>/)
    expect(comparison.lang2Text[0]).not_to match(/<p>/)
  end

  it 'should not have puncutation' do
    comparison.sanitize_html
    comparison.split_on_headers
    comparison.delete_n_and_p
    comparison.comb_words
    expect(comparison.lang1Text[0]).not_to match(/\./)
    expect(comparison.lang2Text[0]).not_to match(/\./)
  end

  it 'should create new article on save' do
    article = comparison.save_article
    expect(article).to be_an(Article)
  end

  LANG1 = "en"
  LANG2 = "fr"
  TEXT1 = "<p><b>Downtown Miami</b> is an urban residential neighborhood, and the central business district of Miami, Miami-Dade County, and South Florida in the United States. Brickell Avenue and Biscayne Boulevard are the main north-south roads, and Flagler Street is the main east-west road.</p>\n<p>Locally known as Downtown, the area is a cultural, financial, and commercial center of South Florida, tracing its present-day history back to the 19th century. In recent years, Downtown Miami has grown to become the fastest-growing area in Miami, with large scale high-rise construction and population increase. Downtown is home to many major museums, parks, education centers, banks, company headquarters, courthouses, government offices, theaters, shops and many of the oldest buildings in the city.</p>\n<p></p>\n<h2><span id=\"Background\">Background</span>"

  TEXT2= "<p><span></span></p>\n\n<p><b>Downtown Miami</b> est le quartier d'affaires de la ville de Miami, le plus important de l'\u00c9tat de Floride et le troisi\u00e8me en importance aux \u00c9tats-Unis derri\u00e8re ceux de New York et Chicago. <i>Brickell Avenue / Biscayne Boulevard</i> est le principal axe routier nord-sud du centre-ville, et <i>Flagler Street</i> est le principal axe est-ouest.</p>\n<p></p>\n<h2><span id=\"Pr.C3.A9sentation\">Pr\u00e9sentation</span></h2>\n<p>Downtown Miami est divis\u00e9 en quatre zones distinctes, Midtown, Park West, le Central business district et Brickell. La zone la plus septentrionale est Midtown, qui est divis\u00e9e en deux sous-districts, Wynwood et Edgewater. Au sud de Midtown, se trouvent Park West et la partie sud de la rivi\u00e8re Miami. Le CDB est s\u00e9par\u00e9 de Brickell par la rivi\u00e8re Miami, <i>NW 7th</i> St, marque la fronti\u00e8re entre l'Ouest et le Parc Midtown.</p>"
end
