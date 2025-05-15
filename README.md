# Graph Analysis Website

Graph Analysis is a multi-page educational web application built on the Bottle framework, designed to help users understand and interact with graph theory algorithms and concepts through hands-on implementation.

## Features

The application includes:
- A main page with a title, a brief description of the topic, and links to relevant methods for solving the problem;
- Pages with realization of the problem solving methods (each team member integrates his/her own page);
- Pages with results output (generated programmatically);
- Pages “About authors” with photos, full name and description of contribution to the project.

Implementation includes:
- Possibility of inputting raw data by the user;
- Generation of random data;
- Writing data to a file.

## Realized algorithms for solving problems

- **Educational Trajectory**. It is built using a topological sorting algorithm based on a directed acyclic graph (DAG), where topics are connected by dependencies and complexity of learning.
- **Recommendation System**. Implemented based on an interest graph constructed from a preference matrix using a nearest neighbor algorithm.
- **Community Discovery**. Occurs using the Girvan-Newman algorithm based on an undirected graph given by a adjacency matrix.

## Getting Started

These instructions will help you create a local copy of the project for development and testing.

### Prerequisites

Make sure you have the following installed on your system:

* Python 3.12
* Git

### Step-by-step guide to setting up your development environment

1. Clone the repository:

```bash
git clone https://github.com/PROFI191919/BottleWebProject_C224_6_AAD.git
```

2. Create and activate a virtual environment:

```bash
python3 -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install the required dependencies:

```bash
pip install -r requirements.txt
```

4. Run the application:

```bash
python app.py
```

## Built With

* Bottle - a lightweight WSGI web framework for Python

## Authors

* Svetlana Demidova - SvetaDem
* Erik Antonov - StockOslo
* Andrey Andriyanov - Profi191919

## License

This project is licensed under the MIT license - see the LICENSE.md file for details.

## Acknowledgements

Thanks to the open source community and the developers of Bottle for providing a flexible and minimalistic framework.

------------------------------------------------------------------------------------------------

# Сайт Graph Analysis

Graph Analysis - это многостраничное образовательное веб-приложение, построенное на фреймворке Bottle, призванное помочь пользователям понять и взаимодействовать с алгоритмами и концепциями теории графов посредством практической реализации.

## Особенности

Приложение включает в себя:
- Главную страницу с заголовком, кратким описанием темы и ссылками на соответствующие методы решения задач;
- Страницы с реализацией методов решения задач (каждый член команды интегрирует свою страницу);
- Страницы с выводом результатов (генерируются программно);
- Страницы «Об авторах» с фотографиями, ФИО и описанием вклада в проект.

Реализация включает:
- Возможность ввода исходных данных пользователем;
- Генерация случайных данных;
- Запись данных в файл.

## Реализованные алгоритмы решения задач

- **Образовательная траектория**. Построена с помощью алгоритма топологической сортировки на основе направленного ациклического графа (DAG), где темы связаны зависимостями и сложностью обучения.
- **Система рекомендаций**. Реализована на основе графа интересов, построенного из матрицы предпочтений с помощью алгоритма ближайших соседей.
- **Обнаружение сообщества**. Реализовано с помощью алгоритма Гирвана-Ньюмана на основе неориентированного графа, заданного матрицей смежности.

## Начало работы

Эти инструкции помогут вам создать локальную копию проекта для разработки и тестирования.

### Необходимые условия

Убедитесь, что в вашей системе установлено следующее:

* Python 3.12
* Git

### Пошаговое руководство по настройке среды разработки

1. Клонируйте репозиторий:

``bash
git clone https://github.com/PROFI191919/BottleWebProject_C224_6_AAD.git
``.

2. Создайте и активируйте виртуальную среду:

``bash
python3 -m venv env
source env/bin/activate # На Windows: env\Scripts\activate
```

3. Установите необходимые зависимости:

``bash
pip install -r requirements.txt
````

4. Запустите приложение:

``bash
python app.py
``

## Built With

## Bottle - это легкий WSGI веб-фреймворк для Python.

## Авторы

## Светлана Демидова - SvetaDem
## Эрик Антонов - StockOslo ##
## Андрей Андриянов - Profi191919 ##

## Лицензия

Этот проект лицензирован под лицензией MIT - подробности см. в LICENSE.md.

## Благодарности

Спасибо сообществу разработчиков открытого кода и разработчикам Bottle за предоставление гибкого и минималистичного фреймворка.
