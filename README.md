<!-- [Опубликованная версия](https://aleksem07.github.io/ "Опубликованная версия") -->

@@include, less, pug

**готовность 0**

### Установка

- **npm i**

---

### Команды

- **npm test** запускает тест _editorconfig_ и _stylelint_
  - _editorconfig_ проверяет отступы, концы строк, пустые строки во всех файлах;
  - _stylelint_ проверяет ошибки препроцессорных файлов по кодгайду.
- **npm start** запускает browsersync и следит за изменениями стилей и вёрстки;
- **npm run build** компиляция в /build
- **npm run pug** watcher pug

---

### Структура

- .github/workflows/check.yml - запуск тестов на github
- build - собранный проект
- node_modules
- source - каталог исходников
  - css - при сборке все копируются в build
  - fonts - папка со шрифтами
  - html
  - img
    - при сборке добавляет сжатый .webp каждого файла
    - при сборке добавляет sprite.svg из папки img/icons
  - js
  - pug (https://html2jade.org/ - онлайн конвертер)
    - layout
    - modules
    - index.pug
  - sass
    - blocks
    - 0
    - style.scss
  - favicon.ico
  - index.html
- 0
- 0
- 0
- ToDo.md - проверить список после завершения верстки

### ToDo_template

- 404 page
- fix build/css
- fonts
- logo2x
- favicon
- readme mixin
