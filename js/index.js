$(function(){  // $(document).ready shorthand
  rotateCount = 0;
  setInterval("rotateInfoText()", 4000);
  rotateInfoText();
  $('#hello').hide().fadeIn('slow').delay(1000).fadeOut('slow');
  $('#welcome-message').hide().delay(2500).fadeIn('slow').delay(1000).fadeOut('slow');
  $('#welcome').hide().delay(5000).fadeIn('slow');
  $('#info').hide().delay(6000).fadeIn('slow');
  $('#references').hide().delay(7000).slideDown('slow');
  $('#credits').hide().delay(7000).fadeIn('slow');
  // $('#invert').click(function(){
  //   invert();
  // });
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

jQuery.fn.visible = function() {
  return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
  return this.css('visibility', 'hidden');
};

jQuery.fn.visibilityToggle = function() {
  return this.css('visibility', function(i, visibility) {
    return (visibility == 'visible') ? 'hidden' : 'visible';
  });
};

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