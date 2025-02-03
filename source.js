//
var HOME_VID = "vid00008.mpg";

//
var videos = [];
function processVideoData(textData) {
  var data = parseCSV(textData);
  
  //dataRow: name,RFID,video
  //load into video objects
  for (var i = 0; i < data.length; i++) {
    var dataRow = data[i];
    video = {};
    videos[dataRow[1]] = {
      name: dataRow[0], video: dataRow[2]
    };
  };
}

//
var videoDataLoaded = false;
function loadVideoData() {
  var xhttp  = new XMLHttpRequest();
  xhttp.open("GET", "matTable.csv", true);
  //xhttp.open("GET", "https://docs.google.com/document/d/1oZvxYOivCQM4VJACdpAbhIdMfTz5Lz81QeegLN37Tw8/export?format=txt", true);
  //xhttp.open("GET", "https://docs.google.com/spreadsheets/d/1cj0G1yKBBjbqmEFg2K5g_nXCb3acLiD0hNGYUBRzkFc/export?format=csv", true);
  xhttp.onreadystatechange = function () {
    if(xhttp.readyState == 4 && (xhttp.status === 200 || xhttp.status == 0)) {
      var textData = xhttp.responseText;
      //console.log(textData);
      processVideoData(textData);
      videoDataLoaded = true;
    }
  }
  xhttp.send(null);
}

//
function onVidFinished() {
  setTimeout(function() {
    loadVid(HOME_VID); //back to home video
  }, 3000);
}

//
function onVidLoaded() {
	//playerVideo.style.visibility = "inherit";
	playerVideo.play();
}

//
function loadVid(vid) {
  playerVideo.src = vid;
  //playerVideo.style.visibility = "hidden";
  playerVideo.load();
}

//
playerVideo = null;
function loadPlayer()  { 
	playerVideo = document.getElementById('playerVideo');
	playerVideo.addEventListener("ended", onVidFinished);
	playerVideo.addEventListener("canplay", onVidLoaded);
}

//
function showVideo(id) {
  console.log("showVideo; ID:(" + id + ")");
  
  var video = videos[id];
  if (video) {
    console.log("playing video: " + video.video);
    playerVideo.src = video.video;
    playerVideo.load();
  }
}

loadVideoData();
loadPlayer();

//
String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

//
var bsMessage = new BSMessagePort();
bsMessage.onbsmessage = function(msg)
{
  var id = msg.data["data"];
  console.log("received ID:(" + id + ")");
  if (videoDataLoaded)
    showVideo(id);
}
