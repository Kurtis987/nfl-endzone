queue()
    .defer(d3.json, "/trivia/dump")
    .await(getQuestion);

var i = 0;
var correct = 0;
var trivia, game_status, questions;
var flag = false; //set an error variable for replay


function getQuestion(error, dump){
//check that we're receiving data, is mongo running?
    if (error) {
        console.error("getQuestion error on receiving dataset:", error.statusText);
        throw error;
    }
//set questions equal to dump for global access
    questions=dump;

    trivia = document.getElementById("trivia");
    if(i >= questions.length){
    trivia.innerHTML = "<h2>You got "+correct+" of "+questions.length+" questions correct</h2>";
    document.getElementById("game_status").innerHTML = "Game Over";
    document.getElementById("score").innerHTML = "Score: "+correct;
    // reset for possible restart of game
    i = 0;
    correct = 0;

    trivia.innerHTML += "<button class='btn trivia-btn' onclick='getQuestion(flag, questions)'>Play Again</button>";
    // exit code when game's over
    return false;
    }
    document.getElementById("game_status").innerHTML = "Question "+(i+1)+" of "+questions.length;
    document.getElementById("score").innerHTML = "Score: "+correct;

    //write question to screen
    trivia.innerHTML = "<h3>"+questions[i].question+"</h3>";
    // append answers to html shown on screen
    var A = questions[i].a;
    var B = questions[i].b;
    var C = questions[i].c;
    var D = questions[i].d;
    trivia.innerHTML += "<button onclick='checkAnswer(this.value)' class='btn trivia-btn' value='"+A+"'>"+A+"</button>";
    trivia.innerHTML += "<button onclick='checkAnswer(this.value)' class='btn trivia-btn' value='"+B+"'>"+B+"</button><br>";
    trivia.innerHTML += "<button onclick='checkAnswer(this.value)' class='btn trivia-btn' value='"+C+"'>"+C+"</button>";
    trivia.innerHTML += "<button onclick='checkAnswer(this.value)' class='btn trivia-btn' value='"+D+"'>"+D+"</button>";
}


function checkAnswer(val){
    if(val == questions[i].answer)
    {
        correct++;
    }

  // go to next question
  i++;
  getQuestion(flag, questions);
}