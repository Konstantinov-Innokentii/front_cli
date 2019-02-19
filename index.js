const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const Todo = require('./todo.js');


let INVALID_MESSAGE = 'wrong command';

app();

function app () {
    const files = getFiles();
    let todos = [];
    for (let file of files) {
        todos = todos.concat(Todo.getTodosFromStr(file.content, file.filename))
    }
    console.log('Please, write your command!');
    readLine(processCommand, todos);
}

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand (command, todos) {
    command = command.replace(/\s\s+/g, ' ').trim();
    const command_splited = command.split(' ');
    const command_keyword = command_splited[0];

    switch (command_keyword) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            if (command_splited.length == 1)
                console.log(Todo.toTable(todos));
            else
                console.log(INVALID_MESSAGE);
            break;
        case 'sort':
            if (command_splited.length == 2) {
                switch (command_splited[1]) {
                    case 'importance':
                        console.log(Todo.toTable(Todo.sortByImportance(todos)));
                        break;
                    case 'user':
                        console.log(Todo.toTable(Todo.sortByUser(todos)));
                        break;
                    case 'date':
                        console.log(Todo.toTable(Todo.sortByDate(todos)));
                        break;
                    default:
                        console.log('wrong command');
                        break;
                }
            }
            else {
               console.log(INVALID_MESSAGE)
            }
            break;
        case 'important':
            if (command_splited.length === 1)
                console.log(Todo.toTable(todos.filter(todo => todo.important)));
            else
                console.log(INVALID_MESSAGE);
            break;
        case 'user':
            // учитываем, что имя пользователя может состоять из нескольких слов
            const username = command_splited.slice(1).join(' ');
            console.log(Todo.toTable(todos.filter(todo => todo.user && todo.user.toLowerCase().startsWith(username.toLowerCase()))));
            break;
        case 'date':
            if (command_splited.length === 2) {
                const date = new Date(command_splited[1]);
                if (/^\d{4}(?:-\d{1,2}){0,2}/.test(command_splited[1]) && date instanceof Date && !isNaN(date)) {
                    console.log(Todo.toTable(todos.filter(todo => todo.DateObj && todo.DateObj >= date)));
                } else {
                    console.log(INVALID_MESSAGE)
                }
            } else {
                console.log(INVALID_MESSAGE)
            }
            break;
        default:
            console.log(INVALID_MESSAGE);
            break
    }

}
// TODO you can do it!
