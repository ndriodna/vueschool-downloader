import readline from "node:readline";
import { clear } from "node:console";
import { starLine, check } from "./helper/helper.js";

function showOptions(option) {
  let horizontal = "";
  starLine();
  console.log(
    "Gunakan panah Atas/Bawah, Space untuk memilih, Enter simpan pilihan"
  );
  starLine();
  option.forEach((option, i) => {
    horizontal += `[${option.checked ? check() : " "}] ${option.title} || `;
    if (i % 4 == 0 && i !== option.length - 1) {
      horizontal += "\n";
    }
  });
  console.log(horizontal);
}

function displayResult(selectedOptions, options) {
  console.log("Pilihan Anda:");
  selectedOptions.forEach((option, index) => {
    console.log(`${index + 1}. ${options[option].title}`);
  });
}

function clearScreen() {
  clear();

  readline.cursorTo(process.stdout, 0, 0);

  readline.clearScreenDown(process.stdout);
}

export default function (options) {
  const selectedOptions = [];

  showOptions(options);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.input.setRawMode(true);
  rl.input.setEncoding("utf8");
  let currentIndex = 0;
  return new Promise((resolve, reject) => {
    process.stdin.on("keypress", (str, key) => {
      if (key.ctrl && key.name === "c") {
        process.exit();
      } else if (key.name === "up") {
        if (currentIndex < 1) {
          currentIndex = 0;
          options[currentIndex].checked = true;
        } else {
          options[currentIndex].checked = false;
          currentIndex--;
          options[currentIndex].checked = true;
        }

        clearScreen();
        showOptions(options);
        displayResult(selectedOptions, options);
      } else if (key.name === "down") {
        console.log("index down", currentIndex);
        if (currentIndex >= 0) {
          options[currentIndex].checked = false;
        }
        if (currentIndex < options.length - 1) {
          currentIndex++;
          options[currentIndex].checked = true;
        } else {
          currentIndex = options.length - 1;
          options[currentIndex].checked = true;
        }
        clearScreen();
        showOptions(options);
        displayResult(selectedOptions, options);
      } else if (key.name === "space") {
        if (!selectedOptions.includes(currentIndex)) {
          selectedOptions.push(currentIndex);
        }
        clearScreen();
        showOptions(options);
        displayResult(selectedOptions, options);
      } else if (key.name === "return") {
        clearScreen();
        displayResult(selectedOptions, options);
        // process.exit();
        process.stdin.pause();
        process.stdin.removeAllListeners("keypress");
        resolve(selectedOptions);
      }
    });
  });
}
