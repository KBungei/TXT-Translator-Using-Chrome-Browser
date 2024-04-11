class TranslationHandler
{
  constructor(text, fileInfo)
  {
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

  parseUsersLinesCount()
  {
    let usersLinesCount = linesCountInput.value;
    if (usersLinesCount === "") {
      usersLinesCount = 1000;
      linesCountInput.value = "1000";

    } else {
      usersLinesCount = parseInt(usersLinesCount);
    }

    return usersLinesCount;
  }

  readLines(count)
  {
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

  getNext(count)
  {
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
  displayText()
  {
    textDisplayDiv.innerHTML = `<pre>${this.currentText}</pre>`;

    const totalLinesCount = this.linesCount;

    const percentage = Math.ceil(this.cursorIndex / this.linesCount * 100);

    progressSpan.innerHTML = `<strong>Progress: ${percentage}% -- </strong>${this
      .cursorIndex} / ${totalLinesCount} lines.`;

    const pre = document.querySelector("#textDisplayDiv > pre");

    autoScrollPreBtn.addEventListener("click", function(e) {
      pre.scrollTo({
        top: pre.scrollHeight,
        behavior: 'smooth',
      });
    });

  }

  createOutputTxtFile()
  {
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