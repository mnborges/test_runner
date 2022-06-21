const STATUSES = ["Not Started Yet", "Running", "Passed", "Failed"];

function generateDummyTest() {
  var delay = 7000 + Math.random() * 7000;
  var testPassed = Math.random() > 0.5;

  return function (callback) {
    console.log(delay);
    setTimeout(function () {
      callback(testPassed);
    }, delay);
  };
}

var tests = [
  {
    description: "commas are rotated properly",
    run: generateDummyTest(),
  },
  {
    description: "exclamation points stand up straight",
    run: generateDummyTest(),
  },
  {
    description: "run-on sentences don't run forever",
    run: generateDummyTest(),
  },
  {
    description: "question marks curl down, not up",
    run: generateDummyTest(),
  },
  {
    description: "semicolons are adequately waterproof",
    run: generateDummyTest(),
  },
  {
    description: "capital letters can do yoga",
    run: generateDummyTest(),
  },
];

const runAllTests = async () => {
  console.log("Running All Tests Simultaneously");
  //Create a promise to all promises
  return Promise.all(
    tests.map(async (element, index) => {
      //dom elements of current test
      const testStatus = document.getElementById(`status${index}`);
      const testRow = document.getElementById(`row${index}`);

      //had to promisify this function the dummyTest function
      return new Promise((resolve, reject) => {
        element.run(async (testPassed) => {
          //check result and update DOM
          if (testPassed) {
            //change flex order so that passed item moves to the top
            testRow.style["order"] = -1;
            testRow.style["backgroundColor"] = "lightgreen";
            console.log(`test #${index} passed`);
            testStatus.innerHTML = STATUSES[2];
            resolve(STATUSES[2]);
          } else {
            //change flex order so that failed item moves to the bottom
            testRow.style["order"] = 6;
            testRow.style["backgroundColor"] = "lightcoral";
            console.log(`test #${index} failed`);
            testStatus.innerHTML = STATUSES[3];
            resolve(STATUSES[3]);
          }
        });
      });
    })
  );
};
document.addEventListener("DOMContentLoaded", (event) => {
  const startbtn = document.getElementById("start");
  const testTable = document.getElementById("container");
  const result = document.getElementById("result");

  //populate DOM with description and status in its original order
  tests.forEach((element, index) => {
    const testRow = document.createElement("div");
    testRow.setAttribute("id", `row${index}`);
    testRow.setAttribute("class", "flex-row");
    const testDescription = document.createElement("div");
    const testStatus = document.createElement("div");
    testStatus.setAttribute("id", `status${index}`);
    testDescription.innerHTML = element.description;
    testStatus.innerHTML = STATUSES[0];
    testRow.style["order"] = index;
    testRow.style["backgroundColor"] = "beige";
    testRow.append(testDescription, testStatus);
    testTable.appendChild(testRow);
  });

  //button clicked
  startbtn.addEventListener("click", async (event) => {
    event.preventDefault();
    // update dom so that tests are maked as "running", restore original order and bg color
    tests.forEach((element, index) => {
      const testRow = document.getElementById(`row${index}`);
      testRow.style["order"] = index;
      testRow.style["backgroundColor"] = "beige";
      document.getElementById(`status${index}`).innerHTML = STATUSES[1];
    });
    //disable button while test is running
    startbtn.disabled = true;
    startbtn.innerHTML = "Running Tests";
    startbtn.style.opacity = ".5";
    result.innerHTML = `<p>Wait while tests are running...</p>`;

    // run all tests simultaneously + update DOM in "real time"
    const testsResult = await runAllTests();
    console.log(testsResult);
    let successful = testsResult.filter((elem) => elem === STATUSES[2]);
    //enable button after test finishes
    startbtn.disabled = false;
    startbtn.innerHTML = "Restart Tests";
    startbtn.style.opacity = "1";
    result.innerHTML = `<p><strong>Completed!</strong> ${
      successful.length
    } tests passed, and ${6 - successful.length} failed.</p> `;
  });
  return true;
});
