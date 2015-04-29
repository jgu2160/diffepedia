//get languages url
//http://en.wikipedia.org/w/api.php?action=query&format=json&titles=Cloud&prop=langlinks&lllimit=500
//get html version of article (this is the cleanest it can get
//http://simple.wikipedia.org/w/api.php?format=json&action=query&titles=Colorado&prop=extracts

if(window.location.pathname === '/') {

  var app = angular.module('wiki-form', []);
  var defaultLang = "English";
  var LANG_REGEXP = /https:\/\/[a-zA-Z\-]{2,12}/;
  var ARTICLE_REGEXP = /wiki\/.+/;
  var WIKI_REGEXP = /https:\/\/[a-zA-Z\-]{2,12}\.wikipedia\.org\/wiki\/.+/;
  var languages = ["Chinese"]
  var abbrLang;
  var article;


  app.controller("LangController", function($scope, $http, $timeout) {

    $scope.submit = function() {
      if ($scope.userURL) {
        lang2Abbr = (_.invert(LANG_HASH))[$scope.selectedLang];
        if (LANG_HASH[abbrLang] === undefined || LANG_HASH[lang2Abbr] === "undefined") {
          $scope.invalidCombination = true;
        } else {

          lang2Article = langArticle[lang2Abbr];
          lang1URL = wikiURL(abbrLang, article);
          lang2URL = wikiURL(lang2Abbr, lang2Article);

          console.log(lang1URL);
          console.log(lang2URL);

          $http.jsonp(lang1URL).success(function(data, status, headers, config) {
            parsedArray = parseWikiData(data);
            console.log(parsedArray);
          }).
            error(function(data, status, headers, config) {
          });


          //post to analysis engine here
        }
      }
    };

    function wikiURL(abbr, article) {
      return "http://" + abbr + ".wikipedia.org/w/api.php?format=json&action=query&titles=" + article + "&prop=extracts&callback=JSON_CALLBACK";
    }

    $scope.update = function() {
      if ($scope.userURL) {
        console.log($scope.selectedLang);
      }
    };

    $scope.userURL = {
      url: "",
    };

    $scope.selectedLang = "Chinese"

    $scope.lang = {
      name: defaultLang
    }

    $scope.languages = languages;

    $scope.invalidCombination = false;

    $scope.changeLangOptions = function() {
      $scope.invalidCombination = false;
      langMatch = LANG_REGEXP.exec($scope.userURL.url);
      articleMatch = ARTICLE_REGEXP.exec($scope.userURL.url);
      if (langMatch === null) {
        $scope.lang.name = defaultLang;
      } else {
        abbrLang = langMatch[0].slice(8);
        article = articleMatch[0].slice(5);
        $scope.lang.name = LANG_HASH[abbrLang];
        if (LANG_HASH[abbrLang] === undefined) {
          $scope.invalidCombination = true;
          $scope.lang.name = defaultLang;
        } else {
          getArticle(abbrLang, article);
        }
      };
    }

    function getArticle(abbrLang, article) {
      getURL = "http://" + abbrLang + ".wikipedia.org/w/api.php?action=query&format=json&titles=" + article + "&prop=langlinks&lllimit=500&callback=JSON_CALLBACK";
      $http.jsonp(getURL).success(function(data, status, headers, config) {
        parsedArray = parseWikiData(data)
        if (missingPage(data)) {
          $scope.invalidCombination = true;
        } else {
          toMap = parsedArray.langlinks
          $scope.languages = [];
          mapLangs(toMap);
          $scope.languages = languages;
        }
      }).
        error(function(data, status, headers, config) {
      });
    }

  });

  var langArticle = {};

  function parseWikiData(data) {
    parsedWikiArray = data.query.pages
    key = Object.keys(parsedWikiArray)[0]
    return parsedWikiArray[key]
  }

  function missingPage(data) {
    if (typeof data.query.pages["-1"] != "undefined") {
      return true; }
  }

  function mapLangs(toMap) {
    toMap.forEach(function(elem) {
      langArticle[elem.lang] = elem["*"];
    });

    languages = Object.keys(langArticle).map(function(elem) {
      return LANG_HASH[elem]
    });

    for (i = languages.length - 1; i >= 0; i--) {
      langElem = languages[i]
      if (langElem === undefined) { languages.splice(i, 1) }
    }
    console.log(languages);
  }

  app.directive('validateUrl', function() {

    return {
      require: 'ngModel',
      restrict: '',
      link: function(scope, elm, attrs, ctrl) {
        // only apply the validator if ngModel is present and Angular has added the email validator
        if (ctrl && ctrl.$validators.url) {

          // this will overwrite the default Angular email validator
          ctrl.$validators.url = function(modelValue) {
            return ctrl.$isEmpty(modelValue) || WIKI_REGEXP.test(modelValue);
          };
        }
      }
    };
  });

  var BING_HASH =
    {
    "ar":	"Arabic",
    "bs-Latn":	"Bosnian",
    "bg":	"Bulgarian",
    "ca":	"Catalan",
    "zh-CHT":	"Chinese",
    "hr":	"Croatian",
    "cs":	"Czech",
    "da":	"Danish",
    "nl":	"Dutch",
    "en":	"English",
    "et":	"Estonian",
    "fi":	"Finnish",
    "fr":	"French",
    "de":	"German",
    "el":	"Greek",
    "ht":	"Haitian",
    "he":	"Hebrew",
    "hi":	"Hindi",
    "hu":	"Hungarian",
    "id":	"Indonesian",
    "it":	"Italian",
    "ja":	"Japanese",
    "ko":	"Korean",
    "lv":	"Latvian",
    "lt":	"Lithuanian",
    "ms":	"Malay",
    "mt":	"Maltese",
    "no":	"Norwegian",
    "fa":	"Persian",
    "pl":	"Polish",
    "pt":	"Portuguese",
    "ro":	"Romanian",
    "ru":	"Russian",
    "sr-Cyrl":	"Serbian",
    "sk":	"Slovak",
    "sl":	"Slovenian",
    "es":	"Spanish",
    "sv":	"Swedish",
    "th":	"Thai",
    "tr":	"Turkish",
    "uk":	"Ukrainian",
    "ur":	"Urdu",
    "vi":	"Vietnamese",
    "cy":	"Welsh"
  }

  var LANG_HASH =
    {
    "en":  "English",
    "sv": "Swedish",
    "nl": "Dutch",
    "de": "German",
    "fr": "French",
    "ru": "Russian",
    "it": "Italian",
    "es": "Spanish",
    "vi": "Vietnamese",
    "pl": "Polish",
    "ja": "Japanese",
    "pt": "Portuguese",
    "zh": "Chinese",
    "uk": "Ukrainian",
    "ca": "Catalan",
    "fa": "Persian",
    "no": "Norwegian",
    "fi": "Finnish",
    "id": "Indonesian",
    "ar": "Arabic",
    "cs": "Czech",
    "sr": "Serbian",
    "ko": "Korean",
    "ro": "Romanian",
    "hu": "Hungarian",
    "ms": "Malay",
    "tr": "Turkish",
    "sk": "Slovak",
    "da": "Danish",
    "bg": "Bulgarian",
    "lt": "Lithuanian",
    "he": "Hebrew",
    "hr": "Croatian",
    "sl": "Slovenian",
    "et": "Estonian",
    "nn": "Norwegian (Nynorsk)",
    "simple": "Simple English",
    "el": "Greek",
    "hi": "Hindi",
    "th": "Thai",
    "ur": "Urdu",
    "lv": "Latvian",
    "bs": "Bosnian",
    "ht": "Haitian",
    "mt": "Maltese"
  };
};
