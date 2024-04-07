const fileInput = document.getElementById("fileInput");
const encodingSelect = document.getElementById("encodingSelect");

const textDisplayDiv = document.getElementById("textDisplayDiv");

const progressSpan = document.getElementById("progressNumSpan");
const continueBtn = document.getElementById("continueBtn");

const linesCountInput = document.getElementById("linesCountInput");
const setLinesCountBtn = document.getElementById("setLinesCountBtn");

// tabs
const translatorDiv = document.getElementById("translatorDiv");
const infoDiv = document.getElementById("infoDiv");

const tabs = [translatorDiv, infoDiv];

// tab buttons
const translatorTabSwitchDiv = document.getElementById(
  "translatorTabSwitchDiv"
);
const instructionsTabSwitchDiv = document.getElementById(
  "instructionsTabSwitchDiv"
);

window.onload = function() {
    if (!localStorage.getItem("userSetEncoding")) {
        populateStorage();
    } else {
        setValues();
    }
};

function setValues() {
    encodingSelect.value = localStorage.getItem('userSetEncoding');
    linesCountInput.value = localStorage.getItem('userSetLinesCount');
}

function populateStorage() {
    localStorage.setItem('userSetEncoding', encodingSelect.value);
    localStorage.setItem('userSetLinesCount', linesCountInput.value);
}

// classes

class TranslationHandler {
  constructor(text, fileInfo) {
    this.fileInfo = fileInfo;
    this.translatedText = "";

    this.lines = text.split("\n");
    this.linesCount = this.lines.length;

    fileInfo.linesCount = this.linesCount;

    this.cursorIndex = 0;
    this.finalLineIndex = this.linesCount - 1;

    this.currentText = "";

    // StartOf initial display of text before a translation occurs
    this.isPreRun = true;
    this.isCompleted = false;

    this.usersLinesCount = this.parseUsersLinesCount();

    continueBtn.onclick = e => this.getNext(this.usersLinesCount);
    continueBtn.click();
    // EndOf initial display of text before a translation occurs

    this.isPreRun = false;
  }

  parseUsersLinesCount() {
    let usersLinesCount = linesCountInput.value;
    if (usersLinesCount === "") {
      usersLinesCount = 1000;
      linesCountInput.value = "1000";
    } else {
      usersLinesCount = parseInt(usersLinesCount);
    }

    return usersLinesCount;
  }

  readLines(count) {
    let indx = this.cursorIndex;
    let text = "";

    while (count > 0) {
      if (indx > this.finalLineIndex) {
        this.isCompleted = true;
        break;
      }

      text += this.lines[indx] + "\n";

      indx++;
      count--;
    }

    this.currentText = text;
    this.cursorIndex = indx;
    console.log(indx);
  }

  getNext(count) {
    if (!this.isPreRun) {
      const preElement = document.querySelector("#textDisplayDiv > pre");
      this.translatedText += preElement.innerText;
    }

    if (this.isCompleted) {
      alert(`Click OK to Download!`);

      this.createOutputTxtFile();
      return;
    }

    this.readLines(count);
    this.displayText();
  }

  // lang="zh-CN"
  displayText() {
    textDisplayDiv.innerHTML = `<pre>${this.currentText}</pre>`;

    const totalLinesCount = this.linesCount;

    const percentage = Math.ceil(this.cursorIndex / this.linesCount * 100);

    progressSpan.innerHTML = `<strong>Progress: ${percentage}% -- </strong>${this
      .cursorIndex} / ${totalLinesCount} lines.`;
  }

  createOutputTxtFile() {
    const blob = new Blob([this.translatedText], {
      type: "text/plain;charset=utf-8"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const originalFileName = this.fileInfo.name;
    link.download = `${originalFileName} - translation.txt`;
    link.click();
  }
}

setLinesCountBtn.addEventListener("click", function(e) {
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
// EndOf tab switching event listeners

fileInput.addEventListener("change", function(event) {
  const file = event.target.files[0];

  runFileReader(file);
});

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

// functions
function startTranslationJob(contents, fileInfo) {
  const translationHandler = new TranslationHandler(contents, fileInfo);
}

function tabSwitch(index) {
  for (let i = 0; i < tabs.length; i++) {
    if (i == index) {
      tabs[i].style.display = "block";
      continue;
    }

    tabs[i].style.display = "none";
  }
}
