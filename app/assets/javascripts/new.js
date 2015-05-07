if(window.location.pathname === '/') {

  var app = angular.module('wiki-form', []);
  var defaultLang = "English";
  var LANG_REGEXP = /https:\/\/[a-zA-Z\-]{2,12}/;
  var ARTICLE_REGEXP = /wiki\/.+/;
  var WIKI_REGEXP = /https:\/\/[a-zA-Z\-]{2,12}\.wikipedia\.org\/wiki\/.+/;
  var languages = ["Chinese"]
  var lang1Abbr;
  var article;

  app.service("WikiService", function($http) {
    this.getWikiUrl = function(langURL) {
      return $http.jsonp(langURL)
    }
  });

  app.service("BackendService", function($http) {
    this.getComparison = function(text1, text2, lang1, lang2, lang1URL, lang2URL) {
      return $http.post('/comparisons', { lang1Text: text1, lang2Text: text2, lang1: lang1, lang2: lang2, lang1URL: lang1URL, lang2URL: lang2URL })
    }

    this.saveComparison = function(lang1URL, lang2URL) {
      return $http.post('/user_articles', { lang1URL: lang1URL, lang2URL: lang2URL })
    }
  });

  app.controller("LangController", function($scope, $http, $timeout, WikiService, BackendService) {

    $scope.loading = false;

    $scope.save = function() {
      BackendService.saveComparison($scope.lang1URL, $scope.lang2URL)
    }

    $scope.submit = function() {
      if ($scope.userURL) {
        lang2Abbr = (_.invert(LANG_HASH))[$scope.selectedLang];
        if (LANG_HASH[lang1Abbr] === undefined || LANG_HASH[lang2Abbr] === "undefined") {
          $scope.invalidCombination = true;
        } else {
          $scope.showLang1 = false;
          $scope.showLang2 = false;

          $("#cloud-div-1").empty();
          $("#cloud-div-2").empty();

          $scope.loading = true;

          lang2Article = langArticle[lang2Abbr];
          $scope.lang1URL = wikiURL(lang1Abbr, article);
          $scope.lang2URL = wikiURL(lang2Abbr, lang2Article);
          console.log($scope.lang1URL);
          console.log($scope.lang2URL);

          WikiService.getWikiUrl($scope.lang1URL)
          .then(function(success) {
            data = success.data
            parsedArray = parseWikiData(data);
            extract1 = parsedArray.extract;
            WikiService.getWikiUrl($scope.lang2URL)
            .then(function(success) {
              data = success.data
              parsedArray = parseWikiData(data);
              extract2 = parsedArray.extract;
              var lang1 = (_.invert(BING_HASH))[LANG_HASH[lang1Abbr]];
              var lang2 = (_.invert(BING_HASH))[$scope.selectedLang];
              BackendService.getComparison(extract1, extract2, lang1, lang2, $scope.lang1URL, $scope.lang2URL)
              .then(function(success) {
                $scope.loading = false;
                $scope.lang1Text = success.data.s1;
                $scope.lang2Text = success.data.s2;
                make_clouds($scope.lang1Text.split(" ").slice(0,50), $scope.lang2Text.split(" ").slice(0,50));
                $scope.submitButton = false;
                console.log(success.data);
              })
            });
          });
        }
      }
    };

    function make_clouds(lang1Array, lang2Array) {
      $scope.showLang1 = true;
      $scope.showLang2 = true;
      make_cloud(lang1Array, "#cloud-div-1");
      make_cloud(lang2Array, "#cloud-div-2")
    }


    function wikiURL(abbr, article) {
      return "http://" + abbr + ".wikipedia.org/w/api.php?format=json&action=query&titles=" + article + "&prop=extracts&callback=JSON_CALLBACK";
    }

    $scope.userURL = {
      url: "",
    };

    $scope.submitButton = true;

    $scope.selectedLang = "Chinese"

    $scope.lang = {
      name: defaultLang
    }

    $scope.languages = languages;

    $scope.invalidCombination = false;

    $scope.changeLangOptions = function() {
      $scope.invalidCombination = false;
      $scope.showLang1 = false;
      $scope.showLang2 = false;
      $scope.submitButton = true;
      langMatch = LANG_REGEXP.exec($scope.userURL.url);
      articleMatch = ARTICLE_REGEXP.exec($scope.userURL.url);
      if (langMatch === null) {
        $scope.lang.name = defaultLang;
      } else {
        lang1Abbr = langMatch[0].slice(8);
        article = articleMatch[0].slice(5);
        $scope.lang.name = LANG_HASH[lang1Abbr];
        if (LANG_HASH[lang1Abbr] === undefined) {
          $scope.invalidCombination = true;
          $scope.lang.name = defaultLang;
        } else {
          getArticle(lang1Abbr, article);
        }
      };
    }

    function getArticle(lang1Abbr, article) {
      articleLangsUrl = "http://" + lang1Abbr + ".wikipedia.org/w/api.php?action=query&format=json&titles=" + article + "&prop=langlinks&lllimit=500&callback=JSON_CALLBACK";
      articleLangs = WikiService.getWikiUrl(articleLangsUrl)
      .success(function(data, status, headers, config) {
        parsedArray = parseWikiData(data)
        if (missingPage(data)) {
          $scope.invalidCombination = true;
        } else {
          toMap = parsedArray.langlinks
          $scope.languages = [];
          mapLangs(toMap);
          $scope.languages = languages;
        }
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
