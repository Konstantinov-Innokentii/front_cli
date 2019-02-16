class Todo {
    constructor(user, date, comment, important, filename) {
        this.user = user;
        this.date = date;
        this.comment = comment;
        this.important = important;
        this.fileName = filename;
    }

    get importanceLvl() {

        let count = 0;
        let pos = this.comment.indexOf('!');

        while (pos > -1) {
            ++count;
            pos = this.comment.indexOf('!', ++pos);
        }
        return count
    }

    // Геттер используются для того, чтобы в методе SortByUser не было
    // приведения к нижнему регистру a.toLowerCase() и b.toLowerCase()
    get userLower(){
        if (this.user){
            return this.user.toLowerCase();
        } else {
            return null
        }
    }

    // Геттер для даты используется по следующим причинам:
    // 1) Чтобы в методе SortByDate не приводить свойство date к типу Date
    // 2) Дополнительное валидирование даты, помимо используемого в конструкторе класса Date
    // 3) В случае, если дата невалидная, ее все равно требуется сохранить, для вывода в таблицу
    get DateObj() {
        let d = new Date(this.date);
        return  /^\d{1,4}(?:-\d{1,2}){0,2}/.test(this.date) && d instanceof Date && !isNaN(d) ? d : null
    }

    /**
     * Парсит из переданной строки комментарии, начинающиеся с TODO.
     * @param str
     * @param filename - имя файла, из которого была считана строка
     * @returns {Todo[]} - Возвращает массив экземпляров класса Todo
     */
    static getTodosFromStr(str, filename){
        let regexp = /\/\/\s*todo(?!\s*:?\s*\n)\s*:?\s*(.*)$/igm;
        let todos = [];
        let match;
        while ((match = regexp.exec(str)) !== null) {
           todos.push({content: match[1], filename: filename})
        }

        return todos.map(todo => Todo.parseTodo(todo));
    }

    /**
     * Создает объект класса Todo из переданной строки
     * @param todoStr
     * @returns {Todo} - Возвращает экземпляр класса Todo
     */
    static parseTodo(todoStr) {
        let parsedTodo = todoStr.content.split(';', 3);
        if (parsedTodo.length === 3) {
            return new Todo(parsedTodo[0].trim(),
                            parsedTodo[1].trim(),
                            parsedTodo[2].trim(),
                            parsedTodo[2].indexOf('!') !== -1 ? '!' : null,
                            todoStr.filename.trim());
        } else {
            return new Todo(null, '', todoStr.content.trim(), todoStr.content.indexOf('!') !== -1 ? '!' : null, todoStr.filename.trim());
        }
    }

    /**
     * Создает из строки - свойства объекта Todo форматированную строку - ячейку таблицы.
     * @param prop - значение свойства.
     * @param maxLen - максимальная длина ячейки таблицы.
     * @returns {string} Возвращает форматированную строку - ячейку таблицы.
     */
    static propToCell(prop, maxLen) {
        if (prop) {
            if (prop.length < maxLen) {
                return prop + ' '.repeat(maxLen - prop.length)
            } else if ((prop.length > maxLen)) {
                return prop.slice(0, maxLen - 3) + '...'
            } else {
                return prop
            }
        } else {
            return ' '.repeat(maxLen)
        }
    }

    /**
     * Возвращает таблицу комментариев
     * @param todos - массив экземпляров класса TODO
     * @returns {string} - таблица комментариев
     */
    static toTable(todos) {

        let ColsWidth = {'user': 4, 'date': 4, 'comment': 7, 'fileName': 8};
        const ColsMaxWidth = {'user': 10, 'date': 10, 'comment': 50, 'fileName': 15};

        // Найдем подходящуюю ширину каждой колонки таблицы
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

    /**
     * Сортирует комментарии по важности.
     * @param todos - массив экземпляров класса TODO.
     * @returns {Todo[]} Возвращает массив, отсортированный по количеству восклицательных знаков в комментарии.
     */
    static sortByImportance(todos) {
        let todosToSort = todos.slice();
        return todosToSort.sort((a, b) => {
            return b.importanceLvl - a.importanceLvl
        })
    }

    /**
     * Сортирует комментарии по дате.
     * @param todos - массив экземпляров класса TODO.
     * @returns {Todo[]} Возвращает массив, отсортированный по убыванию даты.
     */
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
        return todosWithDate.sort((a, b) => {
            if (a.DateObj > b.DateObj)
                return -1;
            if (a.DateObj < b.DateObj)
                return 1;
            return 0;
        }).concat(todosWithoutDate);
    }

    /**
     * Сортирует комментарии по пользователю.
     * @param todos - массив экземпляров класса TODO.
     * @returns {Todo[]} Возвращает массив, отсортированный по имени пользователя в лексикографическом порядке.
     */
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
        return todosWithUser.sort((a, b) =>  {
            if (a.userLower > b.userLower )
                return 1;
            if (a.userLower < b.userLower)
                return -1;
            return 0;
        }).concat(todosWithoutUser);
    }

    /**
     * Приводит объект класса Todo к форматированной строке таблицы.
     * @param ColsWidth - ширина колонок таблицы.
     * @returns {string} - Возвращает форматированную строку.
     */
    toTableRow(ColsWidth) {
        let res = this.important ? '  !  |' : '     |';
        const cols = ['user', 'date', 'comment'];
        res += cols.map(col => `  ${Todo.propToCell(this[col], ColsWidth[col])}  |`).join('');

        const filenameCol = `  ${Todo.propToCell(this.fileName, ColsWidth['fileName'])}  \n`;

        return res + filenameCol;
    }

}

module.exports = Todo;
