import json
import unittest
from forms.EducationalTrajectory import build_learning_path, find_shortest_path

class TestEducationalTrajectory(unittest.TestCase):
    # --- build_learning_path ---

    def test_linear_ordering(self):
        # Проверяет линейный порядок зависимостей: A -> B -> C
        graph = {
            "A": {"dependencies": [], "difficulty": 1},
            "B": {"dependencies": ["A"], "difficulty": 2},
            "C": {"dependencies": ["B"], "difficulty": 3}
        }
        self.assertEqual(build_learning_path(graph), ["A", "B", "C"])

    def test_same_difficulty_different_order(self):
        # Проверяет порядок при одинаковой сложности: порядок может быть любой
        graph = {
            "A": {"dependencies": [], "difficulty": 1},
            "B": {"dependencies": [], "difficulty": 1},
            "C": {"dependencies": ["A", "B"], "difficulty": 2}
        }
        self.assertIn(build_learning_path(graph), [["A", "B", "C"], ["B", "A", "C"]])

    def test_prefer_lower_difficulty(self):
        # Проверяет предпочтение тем с меньшей сложностью при отсутствии зависимостей
        graph = {
            "A": {"dependencies": [], "difficulty": 3},
            "B": {"dependencies": [], "difficulty": 1},
            "C": {"dependencies": ["A", "B"], "difficulty": 2}
        }
        path = build_learning_path(graph)
        self.assertTrue(path.index("B") < path.index("A"))

    def test_isolated_and_dependent_mix(self):
        # Проверяет правильное расположение изолированных и зависимых тем
        graph = {
            "A": {"dependencies": [], "difficulty": 1},
            "B": {"dependencies": ["A"], "difficulty": 2},
            "C": {"dependencies": [], "difficulty": 3}
        }
        path = build_learning_path(graph)
        self.assertIn("C", path)
        self.assertTrue(path.index("A") < path.index("B"))

    def test_cycle_detection(self):
        # Проверяет, что цикл в графе корректно обрабатывается (A <-> B)
        graph = {
            "A": {"dependencies": ["B"], "difficulty": 1},
            "B": {"dependencies": ["A"], "difficulty": 2}
        }
        path = build_learning_path(graph)
        self.assertTrue(len(path) < 2)

    # --- find_shortest_path ---

    def test_shortest_path_linear(self):
        # Проверяет кратчайший путь в линейной структуре: A -> B -> C
        graph = {
            "A": {"dependencies": [], "difficulty": 1},
            "B": {"dependencies": ["A"], "difficulty": 2},
            "C": {"dependencies": ["B"], "difficulty": 3}
        }
        self.assertEqual(find_shortest_path(graph), ["A", "B", "C"])

    def test_shortest_path_equal_length_options(self):
        # Проверяет выбор кратчайшего пути при нескольких равных вариантах: A -> C или B -> C
        graph = {
            "A": {"dependencies": [], "difficulty": 1},
            "B": {"dependencies": [], "difficulty": 1},
            "C": {"dependencies": ["A", "B"], "difficulty": 2}
        }
        self.assertIn(find_shortest_path(graph), [["A", "C"], ["B", "C"]])

    def test_shortest_path_isolated_topic(self):
        # Проверяет поведение при изолированной теме без зависимостей
        graph = {
            "A": {"dependencies": [], "difficulty": 2},
            "B": {"dependencies": ["A"], "difficulty": 1}
        }
        path = find_shortest_path(graph)
        self.assertIn(path, [["A", "B"]])

    def test_shortest_path_branching(self):
        # Проверяет кратчайший путь в графе с ветвлением
        graph = {
            "A": {"dependencies": [], "difficulty": 1},
            "B": {"dependencies": ["A"], "difficulty": 2},
            "C": {"dependencies": ["A"], "difficulty": 3},
            "D": {"dependencies": ["B", "C"], "difficulty": 4}
        }
        self.assertIn(find_shortest_path(graph), [["A", "B", "D"], ["A", "C", "D"]])

    def test_shortest_path_cycle(self):
        # Проверяет отсутствие пути при наличии цикла
        graph = {
            "A": {"dependencies": ["B"], "difficulty": 1},
            "B": {"dependencies": ["A"], "difficulty": 2}
        }
        self.assertEqual(find_shortest_path(graph), [])

    def test_shortest_path_with_cycle_returns_empty(self):
        # Циклический граф: A <-> B
        graph = {
            "A": {"dependencies": ["B"], "difficulty": 1},
            "B": {"dependencies": ["A"], "difficulty": 2}
        }
        result = find_shortest_path(graph)
        self.assertEqual(result, [], "Должен возвращать пустой путь при цикле в графе")

    def test_invalid_json_input_raises_exception(self):
        from io import StringIO
        broken_json = StringIO('{ "A": {"dependencies": [], "difficulty": 1}, "B": ')
        with self.assertRaises(json.JSONDecodeError):
            json.load(broken_json)

    def test_disconnected_graph_returns_empty_path(self):
        graph = {
            "A": {"dependencies": [], "difficulty": 2},
            "B": {"dependencies": [], "difficulty": 1},
            "C": {"dependencies": [], "difficulty": 3}
        }
        result = find_shortest_path(graph)
        self.assertEqual(result, [], "Ожидается пустой маршрут в изолированном графе")

    def test_disconnected_graph_returns_empty_path(self):
        graph = {
            "A": {"dependencies": [], "difficulty": 2},
            "B": {"dependencies": [], "difficulty": 1},
            "C": {"dependencies": [], "difficulty": 3}
        }
        result = find_shortest_path(graph)
        self.assertEqual(result, [], "Ожидается пустой маршрут в изолированном графе")

    def test_shortest_path_large_linear(self):

        graph = {
            "A": {"dependencies": [], "difficulty": 1},
            "B": {"dependencies": ["A"], "difficulty": 2},
            "C": {"dependencies": ["B"], "difficulty": 3},
            "D": {"dependencies": ["C"], "difficulty": 4},
            "E": {"dependencies": ["D"], "difficulty": 5},
            "F": {"dependencies": ["E"], "difficulty": 6}
        }
        self.assertEqual(find_shortest_path(graph), ["A", "B", "C", "D", "E", "F"])

    def test_shortest_path_large_branching(self):

        graph = {
            "A": {"dependencies": [], "difficulty": 1},
            "B": {"dependencies": [], "difficulty": 2},
            "C": {"dependencies": ["A", "B"], "difficulty": 3},
            "D": {"dependencies": [], "difficulty": 1},
            "E": {"dependencies": ["C", "D"], "difficulty": 4},
            "F": {"dependencies": ["E"], "difficulty": 5}
        }
        path = find_shortest_path(graph)

        self.assertTrue(path[0] in ["A", "B", "D"])
        self.assertEqual(path[-1], "F")
        self.assertTrue("E" in path)

if __name__ == '__main__':
    unittest.main()