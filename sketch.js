let model;
let video;
let predictions = [];
let pose;
let quote = 'hi';
let tempHighScore = 0.00;
let anyone = false;
// let canvas = createCanvas(1200, 900);
// canvas.parent("canvas-container");

const URL = "./my-model/";

async function setup() {
  createCanvas(1200, 900);

  video = createCapture(VIDEO); //change to video feed
  video.size(width, height);
  video.hide();

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmPose.load(modelURL, metadataURL);
  console.log("Model loaded");

  // Start the prediction loop once setup is complete
  predictLoop();
}

function draw() {
  background(0);

  //Temp variable for the text
  //temp var highest Score


  // mirror webcam
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  drawPose();

  fill(255);
  textSize(20);

  tempHighScore = 0.00;
  quote='';

  for (let i = 0; i < predictions.length; i++) {
  //check who has the highest score, and then show the text after the loop
    if (predictions[i].probability.toFixed(2)>tempHighScore){
      quote = predictions[i].className;
      tempHighScore = predictions[i].probability.toFixed(2);
    }
  }
if(anyone){
  //print quote
   text(
      //`${predictions[i].className}: ${predictions[i].probability.toFixed(2)}`,
      //`${predictions[i].className}`,
      `${quote}`,
      //below are for screen location of the text
      20,
      //30 + i * 25
      420,
      1160,
      300
    );

    //print score
       text(
      //`${predictions[i].className}: ${predictions[i].probability.toFixed(2)}`,
      //`${predictions[i].className}`,
      `${tempHighScore}`,
            //below are for screen location of the text
      10,
      //30 + i * 25
      30
    );
  }
}

// Separate, independent prediction loop
async function predictLoop() {
  // CRITICAL GUARD: Only predict if model exists AND video has loaded data (readyState >= 2)
  if (model && video && video.elt.readyState >= 2) {
    try {
      const result = await model.estimatePose(video.elt);
      pose = result.pose;
      predictions = await model.predict(result.posenetOutput);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  }
  
  // Call itself again as fast as possible for continuous tracking
  requestAnimationFrame(predictLoop);
}

function drawPose() {
  if (!pose){
    anyone = false;
    return;
  } 

  anyone = true;
  // Remember to mirror the skeleton dots too, since your image is mirrored!
  push();
  translate(width, 0);
  scale(-1, 1);

  stroke(0, 255, 0);
  fill(0, 255, 0);

  for (let kp of pose.keypoints) {
    if (kp.score > 0.5) {
      circle(kp.position.x, kp.position.y, 10); //experiment with pose symbols
    }
  }
  pop();
}

/* === ADDED TO FIX SCROLLING === */
// This tells p5.js to let the web browser handle touch gestures normally
function touchMoved() {
  return true; 
}
text(
  quote,
  20,
  420,
  width - 40,
  300
);