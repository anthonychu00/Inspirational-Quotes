setInterval(checkIt, 100);//interval is important so the browser can check what the user has selected each time
generated=false;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

//Construct a PhotoDetector and specify the image width / height and face detector mode.
var detector = new affdex.PhotoDetector(faceMode);
detector.detectAllExpressions();
detector.detectAllEmotions();
detector.detectAllEmojis();
detector.detectAllAppearance();


var arrayOfEmotions={};


detector.addEventListener("onInitializeSuccess", function() {
    otherStuff();
});
detector.addEventListener("onInitializeFailure", function() {
    alert("The scanner failed to initialize, something went horribly wrong.")
});

/* 
  onImageResults success is called when a frame is processed successfully and receives 3 parameters:
  - Faces: Dictionary of faces in the frame keyed by the face id.
           For each face id, the values of detected emotions, expressions, appearane metrics 
           and coordinates of the feature points
  - image: An imageData object containing the pixel values for the processed frame.
  - timestamp: The timestamp of the captured image in seconds.
*/
detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
    $("#greeting").html("Okay, here's what we think.  (If you would like to analyze another picture, please reset the detector by clicking reset)");
    if(faces.length>0){
     //$("#results").html(faces.length);
    $("#results").html(JSON.stringify(faces[0].emotions));
    arrayOfEmotions=JSON.parse(JSON.stringify(faces[0].emotions));
    var dominant=dominantEmotion();
    generateQuote(dominant);//the dominant emotion
    $("#results").html("You're feeling: "+ dominant);
    }
    else 
    $("#results").html("Sorry, couldn't find a face. Is it a close-up frontal view?");
});//Click clack badda bing badda boom nam 

/* 
  onImageResults success receives 3 parameters:
  - image: An imageData object containing the pixel values for the processed frame.
  - timestamp: An imageData object contain the pixel values for the processed frame.
  - err_detail: A string contains the encountered exception.
*/
detector.addEventListener("onImageResultsFailure", function (image, timestamp, err_detail) {
    alert(err_detail);
});


//--------------------------------------------------------------
function onStart() {//keep intialize and processing separate
    if($("#please").val() == "") 
    {
        alert("Please upload an image.");
        return;
    }

    if (detector && !detector.isRunning) {
        detector.start();
        $("#greeting").html("Please wait, analyzing image. (If this takes longer than 8-10 seconds, try refreshing the page)");
        //Get a canvas element from DOM
    }
    else
        alert("A detector is already running.");
}

function onStop(){
    if(detector.isRunning)
        detector.stop();
        arrayOfEmotions={};
}

function onReset(){
    if(detector.isRunning)
        detector.stop();
        arrayOfEmotions={};
}

function otherStuff(){
    var aCanvas = document.getElementById("canvas");
    var context = aCanvas.getContext('2d');

    //Get imageData object.
    var imageData = context.getImageData(0, 0, aCanvas.width, aCanvas.height); //next thing to be changed

    //Process the frame
    detector.process(imageData, 0);
    //$("#greeting").html("This is what I think");
    }
    

//processes uploaded image into a form that Affectiva can process(via the canvas)
$("#please").change(function(){
    $("#greeting").html("Alright, let's take a look. Please hit scan.");
    var canvas  = document.getElementById("canvas");
    var context = canvas.getContext("2d");//for some reason clearing files here doesn't work
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           var img = new Image();
           img.addEventListener("load", function() {
               var hRatio = canvas.width / img.width;//calculations to maintain aspect ratio of image
                var vRatio = canvas.height / img.height;
                var ratio  = Math.min ( hRatio, vRatio );
                context.clearRect(0, 0, canvas.width, canvas.height);//clears canvas if a new file is given(also look at line 87)
             context.drawImage(img, 0, 0,img.width,img.height,(canvas.width-img.width*ratio)/2, (canvas.height-img.height*ratio)/2,img.width*ratio,img.height*ratio);
           });                                                //stuff above apparently centers, look closely at it later, also look at aspect sizing
           img.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
});                                   


function dominantEmotion() {
    var maxVal = -1;
    var domEmotion
    arrayOfEmotions["engagement"] = 0;
    arrayOfEmotions["valence"] = 0;//no clue what valence is and I don't think the normal person does either.
    arrayOfEmotions["contempt"] = 0;//contempt and disgust are similar
    for (var key in arrayOfEmotions) {
        if (arrayOfEmotions.hasOwnProperty(key)) {//makes sure the array isn't inheriting info

            var val = arrayOfEmotions[key];
            if (val > maxVal) {
                domEmotion = key;
                maxVal = val;
            }
        }
    }
    var color;
    var body = $("body");
    if (domEmotion == "joy") {//assigns a color to the background
        $('body').css("background-color", "LightYellow");
    } 
    else if (domEmotion == "sadness") {
        $('body').css("background-color", "LightBlue");
    } 
    else if (domEmotion == "disgust") {
        $('body').css("background-color", "Olive");
    } 
    else if (domEmotion == "Crimson") {
        $('body').css("background-color", "Crimson");
    } 
    else if (domEmotion == "surprise") {
        $('body').css("background-color", "plum");
    }
    else if (domEmotion == "fear") {//change color later
        $('body').css("background-color", "gray");
    } 
    else if (domEmotion == "contempt") {//change color later
        $('body').css("background-color", "IndianRed");//snwo down 
    }

    return domEmotion;
}

function generateQuote(domin){//generates quote from array of preselected ones
    if (generated) {
        clearPage();
    }
    var img = new Image();
    var div = document.getElementById('quoteDiv');

    img.onload = function() {
        div.appendChild(img);
    };

    var random;
    if (domin == "joy") {
        random = getRandomJoyQuote();
        img.src = 'Quotes/Joy/' + random;
    } else if (domin == "sadness") {
        random = getRandomSadQuote();
        img.src = 'Quotes/Sad/' + random;
    } else if (domin == "anger") {
        random = getRandomAngerQuote();
        img.src = 'Quotes/Anger/' + random;
    } else if (domin == "disgust") {
        random = getRandomDisgustQuote();
        img.src = 'Quotes/Disgust/' + random;
    } else if (domin == "surprise") {
        random = getRandomSurpriseQuote();
        img.src = 'Quotes/Surprise/' + random;
    } else {
        random = getRandomFearQuote();
        img.src = 'Quotes/Fear/' + random;
    } 
    generated = true;
}

function getRandomJoyQuote() {
    var images = ["JoyQuote1.jpg", "JoyQuote2.jpg", "JoyQuote3.jpg", "JoyQuote4.jpg", "JoyQuote5.jpg", "JoyQuote6.jpg", "JoyQuote7.jpg", "JoyQuote8.jpg", "JoyQuote9.jpg", "JoyQuote10.jpg"];
    return images[Math.floor(Math.random() * images.length)];
}

function getRandomSadQuote() {
    var images = ["SadQuote1.jpg","SadQuote2.jpg","SadQuote3.jpg","SadQuote4.jpg","SadQuote5.jpg","SadQuote6.jpg","SadQuote7.jpg","SadQuote8.jpg","SadQuote9.jpg","SadQuote10.jpg"];
    return images[Math.floor(Math.random() * images.length)];
}
function getRandomAngerQuote() {
    var images = ["AngerQuote1.jpg","AngerQuote2.jpg","AngerQuote3.jpg","AngerQuote4.jpg","AngerQuote5.jpg","AngerQuote6.jpg","AngerQuote7.jpg","AngerQuote8.jpg","AngerQuote9.jpg","AngerQuote10.jpg"];
    return images[Math.floor(Math.random() * images.length)];
}

function getRandomDisgustQuote(){
    var images = ["DisgustQuote1.jpg","DisgustQuote2.jpg","DisgustQuote3.jpg","DisgustQuote4.jpg","DisgustQuote5.jpg","DisgustQuote6.jpg","DisgustQuote7.jpg","DisgustQuote8.jpg","DisgustQuote9.jpg","DisgustQuote10.jpg"];
    return images[Math.floor(Math.random() * images.length)];
}

function getRandomSurpriseQuote(){
    var images = ["SurpriseQuote1.jpg","SurpriseQuote2.jpg","SurpriseQuote3.jpg","SurpriseQuote4.jpg","SurpriseQuote5.jpg","SurpriseQuote6.jpg","SurpriseQuote7.jpg","SurpriseQuote8.jpg","SurpriseQuote9.jpg","SurpriseQuote10.jpg"];
    return images[Math.floor(Math.random() * images.length)];
}

function getRandomFearQuote() {
    var images = ["FearQuote1.jpg","FearQuote2.jpg","FearQuote3.jpg","FearQuote4.jpg","FearQuote5.jpg","FearQuote6.jpg","FearQuote7.jpg","FearQuote8.jpg","FearQuote9.jpg","FearQuote10.jpg"];
    return images[Math.floor(Math.random() * images.length)];
}

function clearPage(){  
    $('#quoteDiv').html("");
    $('#results').html("");
}

function checkIt()
		{
		    if($("#please").val().length) 
		    	;//alert('Files Loaded');
		    else {
                //alert('Cancel clicked');
                var canvas  = document.getElementById("canvas");
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                clearPage();
                $("#greeting").html("How have you been feeling today? Let's have a look at a picture. Make sure it's a close up frontal view, or we may not detect a face.");
            }
		    document.body.onfocus = null;
		    //alert('checked');
        }
