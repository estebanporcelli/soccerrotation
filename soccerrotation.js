var players = ["andy", "brandon", "brody", "chris","danny", "jacob","jake", "joey", "josh", "kevin", "lj", "marco", "matt", "rushil",
  "saif", "scott", "warren"
];

var selectedBenchPlayer;
var selectedPosition;
var selectedSubstitutePosition;

var positions = [];
var substitutePositions = [];
var bench = players.slice()

var formation = [2, 4, 4, 1];

function populateBench() {
  for (i = 0; i < bench.length; i++) {
    createBenchPlayerElement(bench[i])
  }
}

function updateUI() {
  //update bench
  updateBenchUI()

  // update positions
  updatePositionsUI()

  // update substitute positions
  updateSubstitutePositionsUI()

  //debug info
  updateDebugInfoUI()
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
    unassignPosition(position)
  }

  positions[position] = benchPlayer
  delete bench[bench.indexOf(benchPlayer)]
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
      if (confirm("Sub?") == true) {
        //unassign player
        unassignPosition(position)
          //unassign sub player
        unassignSubstitutePosition(selectedSubstitutePosition)
          //assign sub player
          //assignPlayerToPosition(substitutePlayer, position)
        positions[position] = substitutePlayer
        delete bench[bench.indexOf(substitutePlayer)]
      }
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
  delete bench[bench.indexOf(benchPlayer)]
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
