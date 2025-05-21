import unittest
from forms.girvan_newman_solver import detect_communities_from_matrix

class TestGirvanNewmanSolver(unittest.TestCase):

    def test_edge_and_trivial_cases(self):
        # �������� ������� � ������� �������
        cases = [
            {"matrix": [], "expected": []},  # ������ ���� � ������ ���������
            {"matrix": [[0]], "expected": [{0}]},  # ���� ���� � ���� ����������
            {"matrix": [[0,0],[0,0]], "expected": [{0}, {1}]},  # ��� ������������� ����
            {"matrix": [
                [0,0,0],
                [0,0,0],
                [0,0,0]
            ], "expected": [{0}, {1}, {2}]},  # ��� ������������� ����
            {"matrix": [
                [0,1],
                [1,0]
            ], "expected": [{0}, {1}]},  # ��� ��������� ����
            {"matrix": [[0]], "expected": [{0}]},  # �������� ���� ����
            {"matrix": [
                [0,1,0],
                [1,0,0],
                [0,0,0]
            ], "expected": [{0}, {1}, {2}]},  # ��� ��������� ������� � �������������
        ]
        for case in cases:
            with self.subTest(matrix=case["matrix"]):
                result = detect_communities_from_matrix(case["matrix"])
                # ���������, ��� ��������� ��������� � ��������� (��� ����� �������)
                self.assertCountEqual(result, case["expected"])
                if case["matrix"]:
                    n = len(case["matrix"])
                    # ���������, ��� ��� ������� ������� � ����������
                    all_nodes = set().union(*result) if result else set()
                    self.assertEqual(all_nodes, set(range(n)))

    def test_complete_graph_properties(self):
        # ��������� �������� ������� �����
        cases = [
            [[0 if i==j else 1 for j in range(5)] for i in range(5)],  # ������ ���� �� 5 �����
            [
                [0,1,1],
                [1,0,1],
                [1,1,0]
            ],  # ������ ���� �� 3 �����
            [[0 if i==j else 1 for j in range(6)] for i in range(6)],  # ������ ���� �� 6 �����
        ]
        for matrix in cases:
            with self.subTest(matrix=matrix):
                result = detect_communities_from_matrix(matrix)
                all_nodes = set().union(*result)
                # ���������, ��� ������� ��� ����
                self.assertEqual(all_nodes, set(range(len(matrix))))
                total = sum(len(c) for c in result)
                # ���������, ��� ��������� ���������� ����� ����� ������� �����
                self.assertEqual(total, len(matrix))

    def test_star_graph_partition(self):
        # ��������� ��������� "������"
        cases = [
            [
                [0,1,1,1],
                [1,0,0,0],
                [1,0,0,0],
                [1,0,0,0]
            ],  # "������" � ������� 0 � ����� ��������
            [
                [0,1,1,1,1],
                [1,0,0,0,0],
                [1,0,0,0,0],
                [1,0,0,0,0],
                [1,0,0,0,0]
            ],  # "������" � ������� 0 � �������� ��������
            [
                [0,0,1,0],
                [0,0,1,0],
                [1,1,0,1],
                [0,0,1,0]
            ],  # ����� � ������� 2, ��������� � �������
        ]
        for matrix in cases:
            with self.subTest(matrix=matrix):
                result = detect_communities_from_matrix(matrix)
                all_nodes = set().union(*result)
                # ���������, ��� ��� ������� ��������
                self.assertEqual(all_nodes, set(range(len(matrix))))
                total = sum(len(c) for c in result)
                # ���������, ��� ��������� ���������� ����� ����� ������� �����
                self.assertEqual(total, len(matrix))

    def test_asymmetric_matrix_should_raise_or_warn(self):
        """
        ��������: ������������� ������� ��������� (���� �����������������)
        ������ ���� ��������� � ������, ���� � ��������������.
        """
        matrix = [
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 0]
        ]
        try:
            result = detect_communities_from_matrix(matrix)
            # ���� ������ �� �������, ���������, ��� ��������� ���������
            all_nodes = set().union(*result)
            self.assertEqual(all_nodes, {0, 1, 2})
            total = sum(len(c) for c in result)
            self.assertEqual(total, 3)
        except ValueError as e:
            # ���������, ��� ������ ����� ������� � ����������
            self.assertIn("symmetry", str(e).lower())
        except Exception as e:
            # ���� ������ ������ � ���� �������������
            self.fail(f"Unexpected exception raised: {e}")

if __name__ == '__main__':
    unittest.main()
