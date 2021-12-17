var app = new PIXI.Application({
  transparent: true
});
document.body.appendChild(app.view);
var container = new PIXI.Container();
app.stage.interactive = true;
app.stage.addChild(container);
var displacementSprite = PIXI.Sprite.fromImage('./img/fv/noise.jpg');
var displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
app.stage.addChild(displacementSprite);
container.filters = [displacementFilter];
$windowWidth = window.innerWidth;
$breakPointA = 568;
$breakPointB = 768;
isMobileSize = ($windowWidth < $breakPointA);
isTabletSize = ($windowWidth <= $breakPointB) && ($windowWidth > $breakPointA);
isPcSize = ($windowWidth > $breakPointB);
window_load();
window.onresize = window_load;

function window_load() {
  var sW = window.innerWidth;
  var sH = window.innerHeight;
  var bg = PIXI.Sprite.fromImage('./img/fv/main.jpg');
  bg.width = sW * 1;
  bg.height = sH * 1;
  bg.position.set(0, sH * -.1)
  container.addChild(bg);
  if (isMobileSize) {
    var bg = PIXI.Sprite.fromImage('./img/fv/main_sp.jpg');
    bg.width = sW * 1.1;
    bg.height = sH;
    bg.position.set(0, 0)
    container.addChild(bg);
  }
}
app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove);
app.ticker.add(function (delta) {
  displacementSprite.rotation += 0.007;
});

function onPointerMove(eventData) {
  displacementSprite.position.set(eventData.data.global.x - 25, eventData.data.global.y);
}
window.addEventListener('resize', resize);

function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}
resize();