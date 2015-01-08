$(function(){  // $(document).ready shorthand
  $('#welcome-message').hide();
  $('#info').hide();
  $('#references').hide();
  $('#credits').hide();
  $('#hello').hide().fadeIn('slow', function() {
    $('#hello').delay(1000).fadeOut('slow', function() {
      $('#welcome-message').fadeIn('slow', function() {
        $('#welcome-message').delay(1000).fadeOut('slow', function() {
          $('#info').delay(1000).fadeIn('slow', function() {
            $('#references').delay(1000).slideDown('slow');
            $('#credits').delay(1000).fadeIn('slow', function() {
              rotateCount = 0;
              setInterval("rotateInfoText()", 4000);
            });
          });
        });
      });
    });
  });
});

var rotateCount;
var rotateTexts = ["duke university student", "pun enthusiast", "sitcom aficionado", "multilingual typist"];

function rotateInfoText() {
  $('#info').fadeOut('slow', function() {
    $('#info').text(rotateTexts[rotateCount]);
    $('#info').fadeIn('slow');
  });
  rotateCount++;
  if (rotateCount >= rotateTexts.length) {
    rotateCount = 0;
  }
}

// disable space to scroll
// window.onkeydown = function(e) { 
//   return !(e.keyCode == 32);
// };

function invert() { 
  if (!window.counter) {
    window.counter = 1;
  } else {
    window.counter++;
  }
  start = 0;
  goal = 100;
  if (window.counter % 2 == 0) {
    start = 100;
    goal = 0;
  }
  current = start;
  var colorUpdate = setInterval(function() {
    current = current + 8*(goal-start)/100;
    if (current < 0) current = 0;
    if (current > 100) current = 100;
    var css = 'html {-webkit-filter: invert('+current+'%); moz-filter: invert('+current+'%); o-filter: invert('+current+'%); ms-filter: invert('+current+'%); }',
    head = document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }, 30 );
  var finish = setTimeout(function() {
    clearInterval(colorUpdate);
  }, 1500);
}

function flip() {
  var css = 'html {transform:rotate(180deg); -ms-transform:rotate(180deg); -webkit-transform:rotate(180deg); }',
  head = document.getElementsByTagName('head')[0],
  style = document.createElement('style');
  if (!window.counter) { window.counter = 1;} else  { window.counter ++;
    if (window.counter % 2 == 0) { var css ='html {transform:rotate(0deg); -ms-transform:rotate(0deg); -webkit-transform:rotate(0deg); }'}
  };
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
}