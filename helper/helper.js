function starLine() {
  const star = [];
  for (let i = 0; i < process.stdout.columns / 2; i++) {
    star.push('*');
  }
  console.log();
  console.log(...star);
  console.log();
}

function check() {
  const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m \u2713 '
  };
  return colors.green + colors.reset;
}
export { starLine, check };
