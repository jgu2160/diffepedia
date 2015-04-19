class ComparisonsController < ApplicationController
  def new
    @languages = [
      "English",
      "Swedish",
      "Dutch",
      "German",
      "French",
      "Waray-Waray",
      "Russian",
      "Cebuano",
      "Italian",
      "Spanish",
      "Vietnamese",
      "Polish"
    ]
  end
end
