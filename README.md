# GraphLab Website

GraphLab is a multi-page educational web application built on the Bottle framework, designed to help users understand and interact with graph theory algorithms and concepts through hands-on implementation.

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
