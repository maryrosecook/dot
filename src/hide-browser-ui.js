var page = document.getElementById('page'),
    ua = navigator.userAgent,
    iphone = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod'),
    ipad = ~ua.indexOf('iPad'),
    ios = iphone || ipad,
    // Detect if this is running as a fullscreen app from the homescreen
    fullscreen = window.navigator.standalone,
    android = ~ua.indexOf('Android'),
    lastWidth = 0;


var setupScroll = window.onload = function() {
  // Start out by adding the height of the location bar to the width, so that
  // we can scroll past it
  if (ios) {
    // iOS reliably returns the innerWindow size for documentElement.clientHeight
    // but window.innerHeight is sometimes the wrong value after rotating
    // the orientation
    var height = document.documentElement.clientHeight;
    // Only add extra padding to the height on iphone / ipod, since the ipad
    // browser doesn't scroll off the location bar.
    if (iphone && !fullscreen) height += 60;
    page.style.height = height + 'px';
  }
  // Scroll after a timeout, since iOS will scroll to the top of the page
  // after it fires the onload event
  setTimeout(scrollTo, 0, 0, 1);
};
