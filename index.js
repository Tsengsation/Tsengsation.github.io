$(function(){  // $(document).ready shorthand
  $('#hello').hide().fadeIn('slow').delay(1000).fadeOut('slow');
  $('#welcome').hide().delay(3000).fadeIn('slow');
  $('#info').hide().delay(4000).fadeIn('slow');
  $('#references').hide().delay(5000).slideDown('slow');
  $('#credits').hide().delay(5000).fadeIn('slow');
  $('#invert').click(function(){
    invert();
  });
});

function delay(ms) {
   ms += new Date().getTime();
   while (new Date() < ms){}
}

function invert() { 
  // var css = 'html {-webkit-filter: invert(100%); moz-filter: invert(100%); o-filter: invert(100%); ms-filter: invert(100%); }',
  var head = document.getElementsByTagName('head')[0],
  style = document.createElement('style');
  // if (!window.counter) { window.counter = 1;} else  { window.counter ++;
  //   if (window.counter % 2 == 0) { var css ='html {-webkit-filter: invert(0%); -moz-filter: invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }'}
  // };

  if (!window.counter) {
    window.counter = 1;
  } else {
    window.counter++;
  }
  var start = 0;
  var goal = 100;
  if (window.counter % 2 == 0) {
    start = 100;
    goal = 0;
  }

    // var css = 'html {-webkit-filter: invert('+75+'%); moz-filter: invert('+75+'%); o-filter: invert('+75+'%); ms-filter: invert('+75+'%); }';
    // style.type = 'text/css';
    // if (style.styleSheet){
    //   style.styleSheet.cssText = css;
    // } else {
    //   style.appendChild(document.createTextNode(css));
    // }
    // head.appendChild(style);
  for (i = start; i != goal; i+=(goal-start)/100){
    var css = 'html {-webkit-filter: invert('+i+'%); moz-filter: invert('+i+'%); o-filter: invert('+i+'%); ms-filter: invert('+i+'%); }';
    style.type = 'text/css';
    if (style.styleSheet){
      console.log("here");
      style.styleSheet.cssText = css;
    } else {
      console.log("hereinstead");
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    console.log(i);
    delay(100);
  }
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