const readline = require('readline');

// TODO ; 2018; Можно ли написать более лаконично?
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function readLine(callback, param) {
    rl.on('line', (input) => callback(input, param)); // TODO pe; 2015; а какая будет кодировка?
}

// TODO digi 2016; добавить writeLine!!!
// TODO digi; 2016; доб!!!
// TODO ty;2019;gy

module.exports = {
    readLine,
};
