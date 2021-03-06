var players = ["andy", "brandon", "brody", "chris", "danny", "jacob", "jake", "joey", "josh", "kevin", "lj", "marco", "matt", "rushil",
  "saif", "scott", "warren"
];

var selectedBenchPlayer;
var selectedPosition;
var selectedSubstitutePosition;

var positions = {}
var substitutePositions = {}
var bench = players.slice()

var formation = [2, 4, 4, 1]

var totalTime = 0;
var lastCheck = null;
var timer;

var substitutionHistory = []

var playersStats = {}

function populateBench() {
  storedBench = localStorage.getItem("bench")
  console.log("storedBench:")
  console.log(storedBench)
  if (storedBench == null || storedBench == "[]") {
  	console.log("empty bench")
    for (i = 0; i < players.length; i++) {
    	bench[i] = players[i]
      createBenchPlayerElement(bench[i])
      playersStats[bench[i]] = {
        "time": 0
      }
    }
  } else {
    bench = JSON.parse(storedBench)
    console.log("loading bench")
    console.log(bench)
    for (i = 0; i < bench.length; i++) {
      createBenchPlayerElement(bench[i])
      playersStats[bench[i]] = {
        "time": 0
      }
    }
  }
  console.log(playersStats)

  storedPositions = localStorage.getItem("positions")
  if (storedPositions != null) {
    positions = JSON.parse(storedPositions)
  }

  storedPlayersStats = localStorage.getItem("playersStats")
  if (storedPlayersStats != null) {
    playersStats = JSON.parse(storedPlayersStats)
  }

  updateUI()
}

function updateUI() {
  console.log("updateUI")
    //console.log(positions)

  localStorage.setItem("positions", JSON.stringify(positions))
  localStorage.setItem("bench", JSON.stringify(bench))
  localStorage.setItem("playersStats", JSON.stringify(playersStats))
  
  //update bench
  updateBenchUI()

  // update positions
  updatePositionsUI()

  // update substitute positions
  updateSubstitutePositionsUI()

  //debug info
  updateDebugInfoUI()
  
  updateSubstitutionHistoryUI()
}

function updatePositionsUI() {
  for (i in positions) {
    //console.log(i + " : " + positions[i])
    positionElement = document.getElementById(i)
    if (positionElement != null) {
      if (positions[i] == undefined) {
        positionElement.innerHTML = ''
      } else {
        positionElement.innerHTML = positions[i]
      }
    }
  }
}

function updateSubstitutePositionsUI() {
  for (i in substitutePositions) {
    //console.log(i + " : " + positions[i])
    positionElement = document.getElementById(i)
    if (positionElement != null) {
      if (substitutePositions[i] == undefined) {
        positionElement.innerHTML = ''
      } else {
        positionElement.innerHTML = substitutePositions[i]
      }
    }
  }
}

function updateBenchUI() {
  // update bench players assigned to a position
  for (i in positions) {
    //console.log(i)
    if (positions[i] != undefined) {
      //console.log(i + " : " + positions[i])
      benchPlayerElement = document.getElementById(positions[i])
      if (benchPlayerElement) {
        document.getElementById("bench").removeChild(benchPlayerElement)
      }
    }
  }
  // update bench players already assigned to sub
  for (i in substitutePositions) {
    //console.log(i)
    if (substitutePositions[i] != undefined) {
      //console.log(i + " : " + positions[i])
      benchPlayerElement = document.getElementById(substitutePositions[i])
      if (benchPlayerElement) {
        document.getElementById("bench").removeChild(benchPlayerElement)
      }
    }
  }

  bench.forEach(function(element) {
    //console.log(element);
    benchPlayerElement = document.getElementById(element)
    if (benchPlayerElement == null) {
      createBenchPlayerElement(element)
    }
  });
}

function createBenchPlayerElement(playerName) {
  benchPlayerElement = document.createElement("div")
  benchPlayerElement.id = playerName
  benchPlayerElement.innerHTML = playerName
  benchPlayerElement.onclick = onclickSelectBenchPlayer
  benchPlayerElement.className = "bench-player"
  document.getElementById("bench").appendChild(benchPlayerElement)
}

function updateSubstitutionHistoryUI() {
  res = ""
  substitutionHistory.forEach(function(element) {
  	res = res + element[0] + " - " + element[1] + " -> " + element[2] + "<br>"
  })
  
	document.getElementById("substitutionHistory").innerHTML =  res
}

function updateDebugInfoUI() {
  document.getElementById("positions").innerHTML = Object.entries(positions)

  document.getElementById("substitutePositions").innerHTML = Object.entries(substitutePositions)

  //Object.getOwnPropertyNames(positions)
  document.getElementById("benchPlayers").innerHTML = bench

  document.getElementById("selectedBenchPlayer").innerHTML = selectedBenchPlayer
  document.getElementById("selectedPosition").innerHTML = selectedPosition
  document.getElementById("selectedSubstitutePosition").innerHTML = selectedSubstitutePosition
    //console.log("positions")
    //console.log(positions)
    //console.log("bench players")
    //console.log(bench)
}

function onclickSelectBenchPlayer() {
  benchPlayer = event.srcElement.id
  if (selectBenchPlayer(benchPlayer)) {
    // revent bench from receiving click event
    event.stopPropagation()
    updateUI()
  }
}

function selectBenchPlayer(benchPlayer) {
  console.log("bench player selected: " + benchPlayer)
    //if (event != undefined) event.stopPropagation()

  if (selectedPosition == undefined) {
    selectedBenchPlayer = benchPlayer
  } else {
    if (positions[selectedPosition] == undefined) {
      assignBenchPlayerToPosition(benchPlayer, selectedPosition)
    } else {
      return false
    }
  }
  return true
}

function assignBenchPlayerToPosition(benchPlayer, position) {
  if (positions[position] == undefined) {

  } else {
    sub = [(new Date()).toLocaleTimeString(), benchPlayer, positions[position]]
    substitutionHistory.push(sub)
    unassignPosition(position)
  }

  positions[position] = benchPlayer
  bench.splice(bench.indexOf(benchPlayer), 1)
  selectedPosition = undefined
  selectedBenchPlayer = undefined

}

function unassignPosition(position) {
  console.log("unassign position: " + position)
  if (positions[position] != undefined) {
    bench.push(positions[position])
    positions[position] = undefined
  } else {
    //nothing to do
  }
}

function onclickSelectBench() {
  selectBench()
  updateUI()
}

function selectBench() {
  console.log('bench selected')
  if (selectedPosition == undefined) {
    //do nothing
  } else {
    unassignPosition(selectedPosition)
    selectedPosition = undefined
  }

  // if selected substitute position
  if (selectedSubstitutePosition == undefined) {
    //do nothing
  } else {
    unassignSubstitutePosition(selectedSubstitutePosition)
    selectedSubstitutePosition = undefined
  }
}

function onclickSelectPosition() {
  position = event.srcElement.id
  selectPosition(position)
  updateUI()
}

function selectPosition(position) {
  console.log("selected position: " + position)
    // if bench player not selected
  if (selectedBenchPlayer == undefined && selectedSubstitutePosition == undefined) {
    selectedPosition = position
  } else if (selectedBenchPlayer != undefined) {
    assignBenchPlayerToPosition(selectedBenchPlayer, position)

  } else if (selectedSubstitutePosition != undefined) {
    // perform substitution
    substitutePlayer = substitutePositions[selectedSubstitutePosition]
    if (substitutePlayer == undefined) {
      // empty substitute position selected
      // nothing to do
    } else {
      //if (confirm("Sub?") == true) {
      sub = [(new Date()).toLocaleTimeString(), substitutePlayer, positions[position]]
    	substitutionHistory.push(sub)
      
      //unassign player
      unassignPosition(position)
        //unassign sub player
      unassignSubstitutePosition(selectedSubstitutePosition)
        //assign sub player
        //assignPlayerToPosition(substitutePlayer, position)
      positions[position] = substitutePlayer
      bench.splice(bench.indexOf(substitutePlayer), 1)
        //}
    }
    selectedSubstitutePosition = undefined
  }
}

function onclickSelectSubstitutePosition() {
  position = event.srcElement.id
  selectSubstitutePosition(position)
  updateUI()
}

function selectSubstitutePosition(position) {
  console.log("selected substitute position: " + position)
    // if bench player not selected
  if (selectedBenchPlayer == undefined) {
    selectedSubstitutePosition = position
  } else {
    assignBenchPlayerToSubstitutePosition(selectedBenchPlayer, position)
  }
}

function assignBenchPlayerToSubstitutePosition(benchPlayer, position) {
  console.log("assign bench player to sub position: " + benchPlayer + " , " + position)
  if (substitutePositions[position] == undefined) {

  } else {
    unassignSubstitutePosition(position)
  }

  substitutePositions[position] = benchPlayer
  bench.splice(bench.indexOf(benchPlayer), 1)
  selectedSubstitutePosition = undefined
  selectedBenchPlayer = undefined

}

function unassignSubstitutePosition(position) {
  console.log("unassign substitute position: " + position)
  if (substitutePositions[position] != undefined) {
    bench.push(substitutePositions[position])
    substitutePositions[position] = undefined
  } else {
    //nothing to do
  }
}

function start() {
  console.log("started timer")
  if (timer == undefined) {
    //start
    timer = setInterval(updateTime, 1000);
  } else {
  	//stop
    clearInterval(timer)
    timer = undefined

    if (lastCheck != undefined) {
      currTime = (new Date()).getTime()
      totalTime = totalTime + (currTime - lastCheck)
    }
    lastCheck = undefined
    displayTime()
  }
}

function reset() {
	totalTime = 0
  
  bench = []
  positions = {}
  playerStats = {}
  substituPlayerPositions = {}
  localStorage.removeItem("bench")
  localStorage.removeItem("positions")
  localStorage.removeItem("playersStats")
  populateBench()
}

function updateTime() {
  if (lastCheck == undefined) {
    lastCheck = (new Date()).getTime()
  } else {
    currTime = (new Date()).getTime()
    increment = currTime - lastCheck
    totalTime = totalTime + increment
    lastCheck = currTime

    updatePlayersStats(increment)
  }
  displayTime()
}

function displayTime() {
  minutes = Math.floor(totalTime / 1000 / 60)
  seconds = totalTime / 1000 - minutes * 60

  document.getElementById("time").innerHTML = minutes + ":" + Math.round(seconds)

}

function updatePlayersStats(increment) {
  for (pos in positions) {
    if (positions[pos] == undefined) {
      //nothing to do
    } else {
      playersStats[positions[pos]].time = playersStats[positions[pos]].time + increment
    }
  }
  //console.log(playersStats)
}

function updateStats() {
  console.log("update stats")
  stats = new Map()
  for (player in playersStats) {
    stats.set(playersStats[player].time + "" + player, [player, playersStats[player].time])
  }
  //stats.sort()
  keys = Array.from(stats.keys()).sort()
    //console.log(stats.keys())
    //console.log(stats.size)
  report = ""
  for (i in keys) {
    //console.log(keys[i])
    report = report + stats.get(keys[i])[0] + ": " + Math.floor(stats.get(keys[i])[1] / 1000 / 60) + "<br>"
  }
  //console.log(report)
  document.getElementById("stats").innerHTML = report
    //JSON.stringify(playersStats)
}
