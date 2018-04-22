//queue()
//    .defer(d3.json, "/trivia/dump")
//    .await(getQuestion);

var i = 0;
var correct = 0;
var trivia, game_status;

var questions = [[
	'Who has the most wins as a head coach in the NFL?',
	'George Halas',
	'Curly Lambeau',
	'Tom Landry',
	'Don Shula',
	'Don Shula'],
['Which NFL team features a helmet decal only on one side of the helmet?',
	'Houston Texans',
	'Jacksonville Jaguars',
	'Pittsburgh Steelers',
	'Tennessee Titans',
    'Pittsburgh Steelers'],
['Who is the last non-quarterback to win NFL MVP?',
	'Shaun Alexander',
	'Ray Lewis',
	'Adrian Peterson',
	'LaDainian Tomlinson',
	'Adrian Peterson'],
['Which NFL Quarterback, a 2010 Pro Bowler, never started a game at QB in college?',
	'Matt Schaub',
	'Matt Cassel',
	'Matt Moore',
	'Matt Flynn',
	'Matt Cassel']];

/*question is at questions [i][0]
  options are [i][1]-[i]4]
  answer is at [i][5] */


//function getQuestion(error, dump){
function getQuestion(){
   // if (error) {
   //     console.error("getQuestion error on receiving dataset:", error.statusText);
   //     throw error;
   // }
    trivia = document.getElementById("trivia");
    if(i >= questions.length){
    trivia.innerHTML = "<h2>You got "+correct+" of "+questions.length+" questions correct</h2>";
    document.getElementById("game_status").innerHTML = "Game Over";
    document.getElementById("score").innerHTML = "Score: "+correct;
    // reset for possible restart of game
    i = 0;
    correct = 0;
    // exit code when game's over
    trivia.innerHTML += "<button class='btn trivia-btn' onclick='getQuestion()'>Play Again</button>";
    return false;
    }
    document.getElementById("game_status").innerHTML = "Question "+(i+1)+" of "+questions.length;
    document.getElementById("score").innerHTML = "Score: "+correct;
    correct;
    //write question to screen
    trivia.innerHTML = "<h3>"+questions[i][0]+"</h3>";
    // append answers to html shown on screen
    var A = questions[i][1];
    var B = questions[i][2];
    var C = questions[i][3];
    var D = questions[i][4];
    trivia.innerHTML += "<button onclick='checkAnswer(this.value)' class='btn trivia-btn' value='"+A+"'>"+A+"</button>";
    trivia.innerHTML += "<button onclick='checkAnswer(this.value)' class='btn trivia-btn' value='"+B+"'>"+B+"</button><br>";
    trivia.innerHTML += "<button onclick='checkAnswer(this.value)' class='btn trivia-btn' value='"+C+"'>"+C+"</button>";
    trivia.innerHTML += "<button onclick='checkAnswer(this.value)' class='btn trivia-btn' value='"+D+"'>"+D+"</button>";
}


function checkAnswer(val){
   if(val == questions[i][5])
   {
    correct++;
   }

  // go to next question
  i++;
  getQuestion();
}
window.addEventListener("load", getQuestion, false);