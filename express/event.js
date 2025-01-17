

function eventGif(fs, endDate,eventName, padString, startDate){



const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');


function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

const numberOfSeconds = (endDate-startDate)
const isStart = numberOfSeconds<=0;
const endNumberOfSeconds = numberOfSeconds - 100000
//console.log("total seconds"+numberOfSeconds);
//console.log("total numberOfSecondsEnd"+endNumberOfSeconds);

const encoder = new GIFEncoder(320, 240);
// stream the results as they are available into myanimated.gif
encoder.createReadStream().pipe(fs);
 
encoder.start();
encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
encoder.setDelay(1000);  // frame delay in ms
encoder.setQuality(10); // image quality. 10 is default.
 
// use node-canvas
const canvas = createCanvas(320, 240);
const ctx = canvas.getContext('2d');
let blink = 0;
 for(let distance=numberOfSeconds;distance>endNumberOfSeconds;distance-=1000){
   //console.log("render"+distance);
     // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //console.log(`d HH mm ss ${days} ${hours} ${minutes} ${seconds}`);


    // blue rectangle
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(0, 0, 320, 240);

    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Impact'

    wrapText(ctx, eventName, 10, 50,300,30)

    if(isStart){
      if((blink++)%2==0)ctx.fillText("now", 150, 200)
    }else{
      ctx.fillText((days+"").padStart(2, padString), 50, 200)
      ctx.fillText((hours+"").padStart(2, padString), 100, 200)
      ctx.fillText((minutes+"").padStart(2, padString), 150, 200)
      ctx.fillText((seconds+"").padStart(2, padString), 200, 200)
    }

    encoder.addFrame(ctx);
 }

 
encoder.finish();
}

const padString ="0";
const startDate = new Date().getTime();
const endDate = new Date("Oct 30, 2021 09:00:00").getTime();

module.exports = { eventGif };