import unittest
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from forms.get_recommendations import get_recommendations  # импорт функции с новым сигнатурой

class TestGetRecommendations(unittest.TestCase):
    # Функция создания модели и матрицы предпочтений
    def _prepare_model_and_matrix(self, data):
        users = [f'user{i+1}' for i in range(len(data))]
        items = [f'item{i+1}' for i in range(len(data[0]))]
        interests_matrix = pd.DataFrame(data, index=users, columns=items)
        model = NearestNeighbors(metric='cosine', algorithm='brute')
        model.fit(interests_matrix)
        return model, interests_matrix
    
    # Стандартные проверки
    # Тест1: если пользователь не имеет интересов,
    # должен получить все рекомендации, имеющие релевантность, отличную от 0
    # с сортировкой по убыванию
    def test_user_with_no_interests(self):
        # U1 все 0, остальные с рейтингами
        data = [
            [0, 0, 0],
            [5, 0, 1],
            [4, 2, 0]
        ]
        model, interests_matrix = self._prepare_model_and_matrix(data)
        recs = get_recommendations('user1', model, interests_matrix)

        # user1 должен получить рекомендации на все I1, I2, I3
        self.assertSetEqual(set(recs.index), set(interests_matrix.columns))
        # Проверяем сортировку по убыванию среднего рейтинга соседей
        values = recs.values
        self.assertTrue(all(values[i] >= values[i+1] for i in range(len(values)-1)))
        # Проверяем, что значения - среднее по соседям, а не 0
        self.assertTrue(np.all(values > 0))

    # Тест2: если пользователь имеет все интересы,
    # должен получить пустой список рекомендаций
    def test_user_with_all_interests_rated(self):
        # user1 все интересы оценены, у остальных есть разные рейтинги
        data = [
            [5, 3, 4],
            [5, 3, 1],
            [4, 2, 0]
        ]
        model, interests_matrix = self._prepare_model_and_matrix(data)
        recs = get_recommendations('user1', model, interests_matrix)
        # user1 оценил все, рекомендаций быть не должно
        self.assertEqual(len(recs), 0)

    # Тест3: проверка, что рекомендации выдаются для пользователя корректно, а не все подряд
    def test_recommendations_only_for_unrated(self):
        data = [
            [5, 0, 0],
            [4, 3, 2],
            [3, 5, 0]
        ]
        model, interests_matrix = self._prepare_model_and_matrix(data)
        recs = get_recommendations('user1', model, interests_matrix)

        # Рекомендации должны быть только для I2 и I3, которые user1 не оценил
        expected_items = ['item2', 'item3']
        self.assertSetEqual(set(recs.index), set(expected_items))

        # Проверяем, что все значения > 0
        self.assertTrue(np.all(recs.values > 0))

        # Проверяем сортировку по убыванию значений
        self.assertTrue(all(recs.values[i] >= recs.values[i+1] for i in range(len(recs.values)-1)))

    # Проверки рассчетов релевантностей
    # Тест4: матрица 3*2 (min users, min items)
    def test_recommendations_values_correctness_3x2(self):
        # Зададим матрицу, чтобы вручную посчитать среднее
        data = [
            [0, 0],
            [2, 1],
            [1, 0]
        ]
        model, interests_matrix = self._prepare_model_and_matrix(data)
        recs = get_recommendations('user3', model, interests_matrix)

        # user3 не оценил I2
        # Среднее для I2 = (0 + 1 + 0) / 3 = 0.3
        self.assertAlmostEqual(recs['item2'], 0.3, places=1) # точность - 1 знак после запятой

    # Тест5: матрица 10*2 (max users, min items)  
    def test_recommendations_values_correctness_10x2(self):
        data = [
            [0, 5],
            [3, 1],
            [1, 0],
            [5, 4],
            [0, 2],
            [3,	5],
            [0, 1],
            [1, 2],
            [3,	1],
            [1, 0]
        ]
        model, interests_matrix = self._prepare_model_and_matrix(data)
        
        recs = get_recommendations('user1', model, interests_matrix)

        # user1 не оценил I1
        # Поиск похожих пользователей по формуле косинусной схожести (вектор имеет две точки)
        # Похожие полльзователи: U1, U5, U7
        # Среднее по этим пользователям: (0 + 0 + 0) / 3 = 0.0
        self.assertAlmostEqual(recs['item1'], 0.0, places=1)

    # Тест6: матрица 10*10 (max users, max items)  
    def test_recommendations_values_correctness_10x10(self):
        data = [
            [0,	3,	0,	0,	2,	0,	5,	1,	3,	0],
            [0,	1,	5,	3,	0,	2,	0,	1,	0,	0],
            [1,	0,	4,	4,	0,	2,	3,	4,	2,	3],
            [2,	0,	3,	5,	0,	0,	4,	2,	3,	5],
            [3,	5,	5,	0,	1,	3,	3,	4,	3,	5],
            [4,	5,	0,	2,	2,	1,	3,	0,	4,	0],
            [0, 3,	2,	0,	1,	0,	3,	5,	5,	3],
            [5,	0,	4,	2,	5,	1,	0,	5,	3,	0],
            [5,	2,	5,	3,	0,	0,	3,	3,	0,	2],
            [0,	4,	2,	0,	0,	0,	3,	5,	0,	5]
        ]
        model, interests_matrix = self._prepare_model_and_matrix(data)
        recs = get_recommendations('user1', model, interests_matrix)

        # user1 не оценил I1, I3, I4, I6, I10
        # Поиск похожих пользователей по формуле косинусной схожести (вектор имеет 10 точек)
        # Похожие пользователи: U1, U6, U7
        # Среднее по этим пользователям:
        # item1: (0 + 4 + 0) / 3 = 1.3
        # item3: (0 + 0 + 2) / 3 = 0.7
        # item4: (0 + 2 + 0) / 3 = 0.7
        # item6: (0 + 1 + 0) / 3 = 0.3
        # item10: (0 + 0 + 3) / 3 = 1.0
        self.assertAlmostEqual(recs['item1'], 1.3, places=1)
        self.assertAlmostEqual(recs['item3'], 0.7, places=1)
        self.assertAlmostEqual(recs['item4'], 0.7, places=1)
        self.assertAlmostEqual(recs['item6'], 0.3, places=1)
        self.assertAlmostEqual(recs['item10'], 1.0, places=1)

        # Проверяем сортировку: item2 (1.3) должен быть выше item3 (0.7)
        self.assertTrue(recs.index.get_loc('item1') < recs.index.get_loc('item10'))
if __name__ == '__main__':
    unittest.main()
