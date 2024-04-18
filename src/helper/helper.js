function starLine() {
  const star = [];
  for (let i = 0; i < process.stdout.columns / 2; i++) {
    star.push("*");
  }
  console.log();
  console.log(...star);
  console.log();
}

function colorText(color, text) {
  const colors = {
    reset: "\x1b[0m",
    greenCheck: "\x1b[32m \u2713 ",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  };
  switch (color) {
    case 0:
      return colors.greenCheck + colors.reset;
    case 1:
      return colors.red + text + colors.reset;
    case 2:
      return colors.green + text + colors.reset;
    case 3:
      return colors.yellow + text + colors.reset;
    case 4:
      return colors.blue + text + colors.reset;
    case 5:
      return colors.magenta + text + colors.reset;
    case 6:
      return colors.cyan + text + colors.reset;
    case 7:
      return colors.white + text + colors.reset;
    default:
      return colors.white + text + colors.reset;
  }
}
async function checkExist(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    return false;
  }
}
function clearScreen(readline) {
  readline.cursorTo(process.stdout, 0, 0);

  readline.clearScreenDown(process.stdout);
}

export { starLine, colorText, checkExist, clearScreen };
