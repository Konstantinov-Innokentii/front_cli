class Todo {
    constructor(user, date, comment, important, filename) {
        this.user = user;
        this.date = date;
        this.comment = comment;
        this.important = important;
        this.fileName = filename;
    }

    get importanceLvl() {
        if (this.comment.indexOf('!') === -1) {
            return 0
        } else {
            return this.comment.split('!').length - 1
        }
    }
    // Геттеры  используются для того, чтобы в методах Sort не было
    // конструкций вида a.toLowerCase() > b.toLowerCase()
    get userLower(){
        if (this.user){
            return this.user.toLowerCase()
        } else {
            return null
        }
    }

    // Проверка регуляркой, потому что Node воспринимает строку -2015 как валидную дату,
    // но преобразовывает ее в 2014 31 1 : 19 из-за Timezone видимо,
    // из-за чего команды date и sort date могут работать некорректно
    // а чтобы из строки делать сразу UTC надо самому все равно парсить дату
    get DateObj() {
        let d = new Date(this.date);
        return  /^\d{1,4}(?:-\d{1,2}){0,2}/.test(this.date) && d instanceof Date && !isNaN(d) ? d : null
    }

    static getTodosFromStr(str, filename){
        let regexp = /\/\/\s*todo(?!\s*:?\s*\n)\s*:?\s*(.*)$/igm;
        let todos = [];
        let match;
        while ((match = regexp.exec(str)) !== null) {
           todos.push({content: match[1], filename: filename})
        }

        return todos.map(todo => Todo.parseTodo(todo));
    }

    static parseTodo(todo) {
        let parsedTodo = todo.content.split(';', 3);
        if (parsedTodo.length === 3) {
            return new Todo(parsedTodo[0].trim(),
                            parsedTodo[1].trim(),
                            parsedTodo[2].trim(),
                            parsedTodo[2].indexOf('!') !== -1 ? '!' : null,
                            todo.filename.trim());
        } else {
            return new Todo(null, '', todo.content.trim(), todo.content.indexOf('!') !== -1 ? '!' : null, todo.filename.trim());
        }
    }

    static propToCell(prop, maxLen) {
        const str = prop instanceof Date ? prop.toISOString().slice(0,10) : prop;
        if (str) {
            if (str.length < maxLen) {
                return str + ' '.repeat(maxLen - str.length)
            } else if ((str.length > maxLen)) {
                return str.slice(0, maxLen - 3) + '...'
            } else {
                return str
            }
        } else {
            return ' '.repeat(maxLen)
        }
    }

    static toTable(todos) {

        let ColsWidth = {'user': 4, 'date': 4, 'comment': 7, 'fileName': 8};
        const ColsMaxWidth = {'user': 10, 'date': 10, 'comment': 50, 'fileName': 15};

        if (todos.length > 0) {
            Object.keys(ColsWidth).map(property => ColsWidth[property] = Math.max.apply(null,
                todos.map(todo => todo[property] ? todo[property].length : 0)));
            Object.keys(ColsWidth).forEach(function (col) {
                if (ColsWidth[col] > ColsMaxWidth[col]) {
                    ColsWidth[col] = ColsMaxWidth[col]
                }
                if (ColsWidth[col] < col.length) {
                    ColsWidth[col] = col.length
                }

            });
        }

        const header = Object.keys(ColsWidth).map(col => Todo.propToCell(col, ColsWidth[col]));
        let res = `  !  |  ${header[0]}  |  ${header[1]}  |  ${header[2]}  |  ${header[3]}  `;
        let delimiter = '-'.repeat(res.length)+'\n';
        res = `${res}\n${delimiter}`;
        for (let todo of todos) {
            res += (todo.toTableRow(ColsWidth))
        }

        return `${res}${todos.length ? delimiter : ''}`;
    }

    static sortByImportance(todos) {
        return todos.sort(function (a, b) {
            return b.importanceLvl - a.importanceLvl
        })
    }
    static sortByDate(todos){
        const todosWithDate = [];
        const todosWithoutDate = [];
        todos.forEach(function (item) {
            if (item.DateObj) {
                todosWithDate.push(item)
            } else {
                todosWithoutDate.push(item)
            }
        });
        return todosWithDate.sort(function (a, b) {
            if (a.DateObj > b.DateObj)
                return -1;
            if (a.DateObj < b.DateObj)
                return 1;
            return 0;
        }).concat(todosWithoutDate);
    }

    static sortByUser(todos) {
        const todosWithUser = [];
        const todosWithoutUser = [];
        todos.forEach(function (item) {
            if (item.user) {
                todosWithUser.push(item)
            } else {
                todosWithoutUser.push(item)
            }
        });
        return todosWithUser.sort(function (a, b) {
            if (a.userLower > b.user.userLower )
                return 1;
            if (a.userLower < b.userLower)
                return -1;
            return 0;
        }).concat(todosWithoutUser);
    }

    // Должен быть приватным методом
    toTableRow(ColsWidth) {
        let res = this.important ? '  !  |' : '     |';
        const cols = ['user', 'date', 'comment'];

        res += cols.map(col => `  ${Todo.propToCell(this[col], ColsWidth[col])}  |`).join('');

        const filenameCol = `  ${Todo.propToCell(this.fileName, ColsWidth['fileName'])}  \n`;

        return res + filenameCol;
    }

}

module.exports = Todo;
