/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $header = $("#header"),
    $footer = $("#footer"),
    $main = $("#main"),
    $main_articles = $main.children("article");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Fix: Flexbox min-height bug on IE.
  if (browser.name == "ie") {
    var flexboxFixTimeoutId;

    $window
      .on("resize.flexbox-fix", function () {
        clearTimeout(flexboxFixTimeoutId);

        flexboxFixTimeoutId = setTimeout(function () {
          if ($wrapper.prop("scrollHeight") > $window.height())
            $wrapper.css("height", "auto");
          else $wrapper.css("height", "100vh");
        }, 250);
      })
      .triggerHandler("resize.flexbox-fix");
  }

  // Nav.
  var $nav = $header.children("nav"),
    $nav_li = $nav.find("li");

  // Add "middle" alignment classes if we're dealing with an even number of items.
  if ($nav_li.length % 2 == 0) {
    $nav.addClass("use-middle");
    $nav_li.eq($nav_li.length / 2).addClass("is-middle");
  }

  // Main.
  var delay = 325,
    locked = false;

  // Methods.
  $main._show = function (id, initial) {
    var $article = $main_articles.filter("#" + id);

    // No such article? Bail.
    if ($article.length == 0) return;

    // Handle lock.

    // Already locked? Speed through "show" steps w/o delays.
    if (locked || (typeof initial != "undefined" && initial === true)) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Mark as visible.
      $body.addClass("is-article-visible");

      // Deactivate all articles (just in case one's already active).
      $main_articles.removeClass("active");

      // Hide header, footer.
      $header.hide();
      $footer.hide();

      // Show main, article.
      $main.show();
      $article.show();

      // Activate article.
      $article.addClass("active");

      // Unlock.
      locked = false;

      // Unmark as switching.
      setTimeout(
        function () {
          $body.removeClass("is-switching");
        },
        initial ? 1000 : 0
      );

      return;
    }

    // Lock.
    locked = true;

    // Article already visible? Just swap articles.
    if ($body.hasClass("is-article-visible")) {
      // Deactivate current article.
      var $currentArticle = $main_articles.filter(".active");

      $currentArticle.removeClass("active");

      // Show article.
      setTimeout(function () {
        // Hide current article.
        $currentArticle.hide();

        // Show article.
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }

    // Otherwise, handle as normal.
    else {
      // Mark as visible.
      $body.addClass("is-article-visible");

      // Show article.
      setTimeout(function () {
        // Hide header, footer.
        $header.hide();
        $footer.hide();

        // Show main, article.
        $main.show();
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }
  };

  $main._hide = function (addState) {
    var $article = $main_articles.filter(".active");

    // Article not visible? Bail.
    if (!$body.hasClass("is-article-visible")) return;

    // Add state?
    if (typeof addState != "undefined" && addState === true)
      history.pushState(null, null, "#");

    // Handle lock.

    // Already locked? Speed through "hide" steps w/o delays.
    if (locked) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Deactivate article.
      $article.removeClass("active");

      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      $body.removeClass("is-article-visible");

      // Unlock.
      locked = false;

      // Unmark as switching.
      $body.removeClass("is-switching");

      // Window stuff.
      $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

      return;
    }

    // Lock.
    locked = true;

    // Deactivate article.
    $article.removeClass("active");

    // Hide article.
    setTimeout(function () {
      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      setTimeout(function () {
        $body.removeClass("is-article-visible");

        // Window stuff.
        $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

        // Unlock.
        setTimeout(function () {
          locked = false;
        }, delay);
      }, 25);
    }, delay);
  };

  // Articles.
  $main_articles.each(function () {
    var $this = $(this);

    // Close.
    $('<div class="close">Close</div>')
      .appendTo($this)
      .on("click", function () {
        location.hash = "";
      });

    // Prevent clicks from inside article from bubbling.
    $this.on("click", function (event) {
      event.stopPropagation();
    });
  });

  // Events.
  $body.on("click", function (event) {
    // Article visible? Hide.
    if ($body.hasClass("is-article-visible")) $main._hide(true);
  });

  $window.on("keyup", function (event) {
    switch (event.keyCode) {
      case 27:
        // Article visible? Hide.
        if ($body.hasClass("is-article-visible")) $main._hide(true);

        break;

      default:
        break;
    }
  });

  $window.on("hashchange", function (event) {
    // Empty hash?
    if (location.hash == "" || location.hash == "#") {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $main._hide();
    }

    // Otherwise, check for a matching article.
    else if ($main_articles.filter(location.hash).length > 0) {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Show article.
      $main._show(location.hash.substr(1));

      for (let index = 0; index < words.length; index++) {
        launch_animated_text(words[index]);
      }
    }
  });

  // Scroll restoration.
  // This prevents the page from scrolling back to the top on a hashchange.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  else {
    var oldScrollPos = 0,
      scrollPos = 0,
      $htmlbody = $("html,body");

    $window
      .on("scroll", function () {
        oldScrollPos = scrollPos;
        scrollPos = $htmlbody.scrollTop();
      })
      .on("hashchange", function () {
        $window.scrollTop(oldScrollPos);
      });
  }

  // Initialize.

  // Hide main, articles.
  $main.hide();
  $main_articles.hide();

  // Initial article.
  if (location.hash != "" && location.hash != "#")
    $window.on("load", function () {
      $main._show(location.hash.substr(1), true);
    });
})(jQuery);

class TextGlitch {
  constructor(root) {
    this._root = root;
    this._elClips = root.querySelectorAll(".TextGlitch-clip");
    this._elWords = root.querySelectorAll(".TextGlitch-word");
    this._frame = this._frame.bind(this);
    this._unglitch = this._unglitch.bind(this);
    this._frameId = null;
    this._text = "";
    this._textAlt = [];
    Object.seal(this);

    this.setTexts(["TRACKFLAW", "TR4CKFL4W", "TR4CKFL4W", "TRACKFLAW"]);

    // this.setTexts( [
    //  "hello world !",
    //  "HELLO WORLD ?",
    //  "µ3770 3027q ?",
    //  "µ311p MQ51b ?",
    // ] );
  }

  on() {
    if (!this._frameId) {
      this._frame();
    }
  }
  off() {
    clearTimeout(this._frameId);
    this._frameId = null;
    this._unglitch();
  }
  setTexts([text, ...alt]) {
    this._text = text;
    this._textAlt = alt;
  }

  // private:
  // .....................................................................
  _frame() {
    this._glitch();
    setTimeout(this._unglitch, 50 + Math.random() * 200);
    this._frameId = setTimeout(this._frame, 250 + Math.random() * 500);
  }
  _glitch() {
    this._addClipCSS();
    this._textContent(this._randText());
    this._root.classList.add("TextGlitch-blended");
  }
  _unglitch() {
    this._removeClipCSS();
    this._textContent(this._text);
    this._root.classList.remove("TextGlitch-blended");
  }
  _textContent(txt) {
    this._elWords.forEach((el) => (el.textContent = txt));
  }

  // CSS clip-path, to cut the letters like an overflow:hidden
  // .....................................................................
  _addClipCSS() {
    const clips = this._elClips,
      clip1 = this._randDouble(0.1),
      clip2 = this._randDouble(0.1);

    clips[0].style.transform = `translate(${this._randDouble(0.3)}em, .02em)`;
    clips[2].style.transform = `translate(${this._randDouble(0.3)}em, -.02em)`;
    clips[0].style.clipPath = `inset( 0 0 ${0.6 + clip1}em 0 )`;
    clips[1].style.clipPath = `inset( ${0.4 - clip1}em 0 ${0.3 - clip2}em 0 )`;
    clips[2].style.clipPath = `inset( ${0.7 + clip2}em 0 0 0 )`;
  }
  _removeClipCSS() {
    this._elClips.forEach((el) => {
      el.style.clipPath = el.style.transform = "";
    });
  }

  // Switch some chars randomly
  // .....................................................................
  _randText() {
    const txt = Array.from(this._text);

    for (let i = 0; i < 12; ++i) {
      const ind = this._randInt(this._text.length);

      txt[ind] = this._textAlt[this._randInt(this._textAlt.length)][ind];
    }
    return txt.join("");
  }

  // rand utils
  // .....................................................................
  _randDouble(d) {
    return Math.random() * d - d / 2;
  }
  _randInt(n) {
    return (Math.random() * n) | 0;
  }
}

const elTitle = document.querySelector("#title");
const glitch = new TextGlitch(elTitle);

glitch.on();

/* Typed js */

var typed = new Typed(".terminal", {
  strings: ["Full overall pentesting "],
  typeSpeed: 110,
  cursorChar: "_",
});

/* Hacker text */

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomLetter() {
  var result = "";
  var characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-./:;<=>?@[\\]^_`{|}~";
  var charactersLength = characters.length;
  for (var i = 0; i < 1; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;

  console.log(result);
}

function getRandomWord(word) {
  var text = word.innerHTML;

  var finalWord = "";
  for (var i = 0; i < text.length; i++) {
    finalWord += text[i] == " " ? " " : getRandomLetter();
  }

  return finalWord;
}

words = document.querySelectorAll(".hacker-text");

function launch_animated_text(word) {
  var interv = "undefined";
  var canChange = false;
  var globalCount = 0;
  var count = 0;
  var INITIAL_WORD = word.innerHTML;
  var isGoing = false;

  if (isGoing) return;

  isGoing = true;
  var randomWord = getRandomWord(word);
  word.innerHTML = randomWord;

  interv = setInterval(function () {
    var finalWord = "";
    for (var x = 0; x < INITIAL_WORD.length; x++) {
      if (x <= count && canChange) {
        finalWord += INITIAL_WORD[x];
      } else {
        finalWord += getRandomLetter();
      }
    }
    word.innerHTML = finalWord;
    if (canChange) {
      count++;
    }
    if (globalCount >= 20) {
      canChange = true;
    }
    if (count >= INITIAL_WORD.length) {
      clearInterval(interv);
      count = 0;
      canChange = false;
      globalCount = 0;
      isGoing = false;
    }
    globalCount++;
  }, 70);
}

// for (let index = 0; index < words.length; index++) {
//   words[index].addEventListener("mouseover", () => {
//     launch_animated_text(words[index]);
//   });
// }

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
