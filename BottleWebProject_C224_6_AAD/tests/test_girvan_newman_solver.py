import unittest
from forms.girvan_newman_solver import detect_communities_from_matrix

class TestGirvanNewmanSolver(unittest.TestCase):

    def test_edge_and_trivial_cases(self):
        # at least 5 distinct cases
        cases = [
            {"matrix": [], "expected": []},
            {"matrix": [[0]], "expected": [{0}]},
            {"matrix": [[0,0],[0,0]], "expected": [{0}, {1}]},
            {"matrix": [
                [0,0,0],
                [0,0,0],
                [0,0,0]
            ], "expected": [{0}, {1}, {2}]},
            {"matrix": [
                [0,1],
                [1,0]
            ], "expected": [{0}, {1}]},
        ]
        for case in cases:
            with self.subTest(matrix=case["matrix"]):
                result = detect_communities_from_matrix(case["matrix"])
                self.assertCountEqual(result, case["expected"])
                # also check union covers all nodes
                if case["matrix"]:
                    n = len(case["matrix"])
                    all_nodes = set().union(*result) if result else set()
                    self.assertEqual(all_nodes, set(range(n)))

    def test_chain_graph_case(self):
        matrix = [
            [0,1,0,0],
            [1,0,1,0],
            [0,1,0,1],
            [0,0,1,0]
        ]
        result = detect_communities_from_matrix(matrix)
        # should split into exactly two communities
        self.assertEqual(len(result), 2)
        # must partition nodes 0..3
        all_nodes = set().union(*result)
        self.assertEqual(all_nodes, {0,1,2,3})
        # no overlap
        for a in result:
            for b in result:
                if a is not b:
                    self.assertTrue(a.isdisjoint(b))

    def test_complete_graph_properties(self):
        # complete graph of 5 nodes: structure may split, but it must cover all nodes and be a partition
        n = 5
        matrix = [[0 if i==j else 1 for j in range(n)] for i in range(n)]
        result = detect_communities_from_matrix(matrix)
        # cover all nodes
        all_nodes = set().union(*result)
        self.assertEqual(all_nodes, set(range(n)))
        # no overlaps
        total = sum(len(c) for c in result)
        self.assertEqual(total, n)

    def test_star_graph_partition(self):
        # star graph: center 0 connected to 1,2,3
        matrix = [
            [0,1,1,1],
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0]
        ]
        result = detect_communities_from_matrix(matrix)
        # union covers all
        all_nodes = set().union(*result)
        self.assertEqual(all_nodes, {0,1,2,3})
        # communities are disjoint
        total = sum(len(c) for c in result)
        self.assertEqual(total, 4)

if __name__ == '__main__':
    unittest.main()
