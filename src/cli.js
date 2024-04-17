import readline from "node:readline";
import { starLine, check, clearScreen } from "./helper/helper.js";

function showOptions(option) {
  let horizontal = "";
  starLine();
  console.log("Gunakan panah Atas/Bawah untuk berpindah");
  console.log("Tekan Space untuk memilih course");
  console.log("Tekan Enter untuk simpan pilihan dan melanjutkan scraping");
  console.log("Tekan delete untuk hapus pilihan");
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

        clearScreen(readline);
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
        clearScreen(readline);
        showOptions(options);
        displayResult(selectedOptions, options);
      } else if (key.name === "space") {
        if (!selectedOptions.includes(currentIndex)) {
          selectedOptions.push(currentIndex);
        }
        clearScreen(readline);
        showOptions(options);
        displayResult(selectedOptions, options);
      } else if (key.name === "delete") {
        if (selectedOptions.length > 0) {
          selectedOptions.pop();
        }
        clearScreen(readline);
        showOptions(options);
        displayResult(selectedOptions, options);
      } else if (key.name === "return") {
        clearScreen(readline);
        displayResult(selectedOptions, options);
        // process.exit();
        process.stdin.pause();
        process.stdin.removeAllListeners("keypress");
        resolve(selectedOptions);
      }
    });
  });
}
