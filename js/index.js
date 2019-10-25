var headerHeight = 100;
var scrollHandler = new ScrollHandler();
var urlHandler = new UrlHandler();

// document.getElementById('navBurger').addEventListener('click', function (ev) {
//     if (ev.srcElement.classList.contains('open')) {
//         ev.srcElement.classList.remove('open');
//     } else {
//         ev.srcElement.classList.add('open');
//     }
// });

Array.apply(null, document.querySelectorAll('a[href*="#"]'))
  .filter(function (el) {  
    return el.getAttribute('href') !== "#" && el.getAttribute('href') !== "#0" && el.getAttribute('href')[0] === '#';
  }).map(function (el) {
    el.addEventListener('click', function (ev) {
        killEvent(ev);
        var section = document.getElementById(el.getAttribute('href').replace(/^\#/, ''));
        urlHandler.navigate(section.id, {
            silence: true
        });
        scrollHandler.scrollBy(section.getBoundingClientRect().top-headerHeight, 0)
    });
  });

  // HEADER SCROLL HANDLING
var header = document.getElementById('header');
function headerScrollController (ev) {
    if (window.scrollY > 100) {
    header.classList.add('opaque');
    } else {
    header.classList.remove('opaque')
    }
}

header.onScroll(headerScrollController);
headerScrollController();

// SECTIONS SCROLL HANDLING
var sections = Array.apply(null, document.getElementsByClassName('section'));
var navPanelTagger = (function () {
    var lastSection,
    elapsedSetter;
    return function navPanelTagger (ev) {
        var offsets = sections.map(function (section) {
            return {
                section: section,
                offset: getVisibleOffset(section).y
            }
        });

        currentSection = offsets.sort(function (d1, d2) {
            return d2.offset - d1.offset; 
        }).shift().section;

        if (currentSection) {
            if (lastSection != currentSection.id) {
                clearTimeout(elapsedSetter);
                elapsedSetter = setTimeout(function () {
                    urlHandler.navigate(currentSection.id, {
                        silence: true
                    });
                }, 1000);
            }
            document.body.setAttribute('section', currentSection.id);
            lastSection = currentSection.id;
        } else {
            document.body.setAttribute('section', 'inici');
            lastSection = 'inici';
        }
    }
})();

scrollHandler.onScroll(navPanelTagger);
navPanelTagger();

function navToInscription () {
    event.stopPropagation();
    event.preventDefault();
    window.open(event.srcElement.getAttribute('data-url'));
}

function youtubeResizer () {
    var iframe = document.getElementById('youtubeframe');
    iframe.setAttribute('width', window.innerWidth/1.5);
    iframe.setAttribute('height', iframe.getAttribute('width')/1.9);
}

window.onresize = youtubeResizer;
youtubeResizer();

function openDocument () {
    event.stopPropagation();
    event.preventDefault();
    window.open(event.srcElement.getAttribute('data-url'));
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.body.classList.add('is-phone');
}