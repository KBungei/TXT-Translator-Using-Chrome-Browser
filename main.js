const fileInput = document.getElementById("fileInput");
const encodingSelect = document.getElementById("encodingSelect");

const textDisplayDiv = document.getElementById("textDisplayDiv");

const progressSpan = document.getElementById("progressNumSpan");
const continueBtn = document.getElementById("continueBtn");
const autoScrollPreBtn = document.getElementById("autoScrollPreBtn");

const linesCountInput = document.getElementById("linesCountInput");
const setLinesCountBtn = document.getElementById("setLinesCountBtn");

// onload
window.onload = function(e) {
  if (!localStorage.getItem("userSetEncoding")) {
      populateStorage();
  } else {
      setValues();
  }
};

// tabs
const translatorDiv = document.getElementById("translatorDiv");
const infoDiv = document.getElementById("infoDiv");

const tabs = [translatorDiv, infoDiv];

function tabSwitch(index) {
  for (let i = 0; i < tabs.length; i++) {
    if (i == index) {
      tabs[i].style.display = "block";
      continue;
    }

    tabs[i].style.display = "none";
  }
}

const translatorTabSwitchDiv = document.getElementById(
  "translatorTabSwitchDiv"
);

const instructionsTabSwitchDiv = document.getElementById(
  "instructionsTabSwitchDiv"
);
//

setLinesCountBtn.addEventListener("click", function(e) {
  let userSetEncoding = linesCountInput.value;
  
  if (!userSetEncoding) {
    userSetEncoding = "1000";
    linesCountInput.value = userSetEncoding;
  }
  
  localStorage.setItem('userSetLinesCount', linesCountInput.value);
  location.href = location.href;
});

encodingSelect.addEventListener("change", function() {
  localStorage.setItem("userSetEncoding", encodingSelect.value);
  location.href = location.href;
});

translatorTabSwitchDiv.addEventListener("click", e => {
  tabSwitch(0);
});

instructionsTabSwitchDiv.addEventListener("click", e => {
  tabSwitch(1);
});

fileInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  runFileReader(file);
});


// functions
function setValues() {
  encodingSelect.value = localStorage.getItem('userSetEncoding');
  linesCountInput.value = localStorage.getItem('userSetLinesCount');
}

function populateStorage() {
  localStorage.setItem('userSetEncoding', encodingSelect.value);
  localStorage.setItem('userSetLinesCount', linesCountInput.value);
}

function runFileReader(file) {
  if (!file) {
    return;
  }

  const fileInfo = {};

  // console.log(`File type is: ${file.type}`);

  if (!(file.type === "text/plain")) {
    alert("Oops! Wrong File Type!");
    return;
  } else {
    fileInfo.name = file.name.replace(/\.[a-zA-Z0-9]+$/, "");
    fileInfo.size = file.size;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const contents = event.target.result;
    startTranslationJob(contents, fileInfo);
  };

  const encoding = encodingSelect.value;
  reader.readAsText(file, encoding);
}

function startTranslationJob(contents, fileInfo) {
  const translationHandler = new TranslationHandler(contents, fileInfo);
}
