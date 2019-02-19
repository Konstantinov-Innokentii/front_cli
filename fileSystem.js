const fs = require('fs');
const path = require('path');

// TODO PE; 2018-08-20; переименовать?
function getAllFilePathsWithExtension(directoryPath, extension, filePaths) {
    filePaths = filePaths || [];
    // TODO Anonymous Developer; 2016; Необходимо переписать этот код и использовать асинхронные версии функций для чтения из файла
    const fileNames = fs.readdirSync(directoryPath);
    for (const fileName of fileNames) {
        // TODO Антон; ; Убедиться, что будет работать под Windows.
        const filePath = directoryPath + '/' + fileName;
        if (filePath.endsWith(`.${extension}`)) {
            filePaths.push(filePath);
        }
        // if (fs.statSync(filePath).isDirectory()) {
        //     getAllFilePathsWithExtension(filePath, extension, filePaths);
        // } else if (filePath.endsWith(`.${extension}`)) {
        //     filePaths.push(filePath);
        // }
    }
    return filePaths;
}

function readFile(filePath) {
    const filename = path.basename(filePath);
    return {content: fs.readFileSync(filePath, 'utf8'), filename: filename}; // TODO Veronika; 2018; сделать кодировку настраиваемой
}

// TODO Digi; 2018; Добавить функцию getFileName, которая по пути файла будет возвращать его имя. Воспользоваться модулем path из Node.js

module.exports = {
    getAllFilePathsWithExtension,
    readFile,
};
