import unittest
from forms.girvan_newman_solver import detect_communities_from_matrix

class TestGirvanNewmanSolver(unittest.TestCase):

    def test_edge_and_trivial_cases(self):
        # Проверка крайних и простых случаев
        cases = [
            {"matrix": [], "expected": []},  # пустой граф — пустой результат
            {"matrix": [[0]], "expected": [{0}]},  # один узел — одна компонента
            {"matrix": [[0,0],[0,0]], "expected": [{0}, {1}]},  # два изолированных узла
            {"matrix": [
                [0,0,0],
                [0,0,0],
                [0,0,0]
            ], "expected": [{0}, {1}, {2}]},  # три изолированных узла
            {"matrix": [
                [0,1],
                [1,0]
            ], "expected": [{0}, {1}]},  # два связанных узла
            {"matrix": [[0]], "expected": [{0}]},  # повторно один узел
            {"matrix": [
                [0,1,0],
                [1,0,0],
                [0,0,0]
            ], "expected": [{0}, {1}, {2}]},  # две связанные вершины и изолированная
        ]
        for case in cases:
            with self.subTest(matrix=case["matrix"]):
                result = detect_communities_from_matrix(case["matrix"])
                # Проверяем, что результат совпадает с ожидаемым (без учета порядка)
                self.assertCountEqual(result, case["expected"])
                if case["matrix"]:
                    n = len(case["matrix"])
                    # Проверяем, что все вершины покрыты в сообществе
                    all_nodes = set().union(*result) if result else set()
                    self.assertEqual(all_nodes, set(range(n)))

    def test_complete_graph_properties(self):
        # Тестируем свойства полного графа
        cases = [
            [[0 if i==j else 1 for j in range(5)] for i in range(5)],  # полный граф из 5 узлов
            [
                [0,1,1],
                [1,0,1],
                [1,1,0]
            ],  # полный граф из 3 узлов
            [[0 if i==j else 1 for j in range(6)] for i in range(6)],  # полный граф из 6 узлов
        ]
        for matrix in cases:
            with self.subTest(matrix=matrix):
                result = detect_communities_from_matrix(matrix)
                all_nodes = set().union(*result)
                # Проверяем, что покрыты все узлы
                self.assertEqual(all_nodes, set(range(len(matrix))))
                total = sum(len(c) for c in result)
                # Проверяем, что суммарное количество узлов равно размеру графа
                self.assertEqual(total, len(matrix))

    def test_star_graph_partition(self):
        # Тестируем разбиение "звезды"
        cases = [
            [
                [0,1,1,1],
                [1,0,0,0],
                [1,0,0,0],
                [1,0,0,0]
            ],  # "звезда" с центром 0 и тремя листьями
            [
                [0,1,1,1,1],
                [1,0,0,0,0],
                [1,0,0,0,0],
                [1,0,0,0,0],
                [1,0,0,0,0]
            ],  # "звезда" с центром 0 и четырьмя листьями
            [
                [0,0,1,0],
                [0,0,1,0],
                [1,1,0,1],
                [0,0,1,0]
            ],  # центр — вершина 2, связанная с другими
        ]
        for matrix in cases:
            with self.subTest(matrix=matrix):
                result = detect_communities_from_matrix(matrix)
                all_nodes = set().union(*result)
                # Проверяем, что все вершины включены
                self.assertEqual(all_nodes, set(range(len(matrix))))
                total = sum(len(c) for c in result)
                # Проверяем, что суммарное количество узлов равно размеру графа
                self.assertEqual(total, len(matrix))

    def test_asymmetric_matrix_should_raise_or_warn(self):
        """
        Проверка: асимметричная матрица смежности (граф неориентированный)
        должна либо приводить к ошибке, либо к предупреждению.
        """
        matrix = [
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 0]
        ]
        try:
            result = detect_communities_from_matrix(matrix)
            # Если ошибка не вызвана, проверяем, что результат корректен
            all_nodes = set().union(*result)
            self.assertEqual(all_nodes, {0, 1, 2})
            total = sum(len(c) for c in result)
            self.assertEqual(total, 3)
        except ValueError as e:
            # Ожидается, что ошибка будет связана с симметрией
            self.assertIn("symmetry", str(e).lower())
        except Exception as e:
            # Если другая ошибка — тест проваливается
            self.fail(f"Unexpected exception raised: {e}")

if __name__ == '__main__':
    unittest.main()
