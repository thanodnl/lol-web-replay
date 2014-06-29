
function download(url, cb) {

  var r = new XMLHttpRequest();
  r.open('GET', url, true);
  r.onreadystatechange = function() {
    if (r.readyState != 4 || r.status != 200) return;
    console.log(r);
    cb(null, JSON.parse(r.responseText));
  };
  r.send();
}

(function(window, document) {
  "use strict";
  console.log('init');

  var region = "EUW1";
  var gameid = 1537808213;

  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;

  var map = new Image();
  map.src = './map.png';

  var timeline;
  var stats;

  download('https://acs.leagueoflegends.com/v1/stats/game/EUW1/1537808213/timeline', function(err, data) {
    timeline = data;
  });
  download('https://acs.leagueoflegends.com/v1/stats/game/EUW1/1537808213', function(err, data) {
    stats = data;
  });

  var players = [];

  var currentFrame = 0;
  var time = 0;


  var update = function update(elapsed) {
    if(!(timeline!==undefined && stats!==undefined)) {
      return;
    }

    time += elapsed;

    currentFrame = Math.floor(time / 1);

    var frame = timeline.frames[currentFrame];
    players = Object.keys(frame.participantFrames).map(function(i) {
      var p = frame.participantFrames[i];
      var x = p.position.x;
      var y = p.position.y;

      x = x / 15750 * 500;
      y = y / 15500 * 500;
      y *= -1;
      y += 500;

      x += 30;
      y -= 20;

      return {
        x: x,
        y: y,
        color: p.participantId <= 5 ? 'red' : 'blue'
      };
    });

  };
  var render = function render(ctx) {
    ctx.drawImage(map, 0, 0, width, height);


    players.forEach(function(p) {
      ctx.fillStyle = p.color || 'white';
      ctx.beginPath();
      ctx.arc(p.x,p.y,5,0,2*Math.PI);
      ctx.fill();
    });
  };

  var prev = Date.now();
  (function loop() {
    var now = Date.now();
    ctx.clearRect(0, 0, width, height);
    update((now-prev)/1000.0);
    render(ctx);
    prev = now;
    requestAnimationFrame(loop);
  })();

})(window, window.document);
