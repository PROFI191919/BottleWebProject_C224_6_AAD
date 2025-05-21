import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestEducationalTrajectoryPage(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Safari()
        cls.driver.implicitly_wait(5)
        cls.base_url = "http://localhost:5555/home"
        cls.test_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "true.json"))

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_full_workflow(self):
        driver = self.driver
        driver.get(self.base_url)
        time.sleep(1)

        # 1. Клик по ссылке в меню по href
        edu_link = driver.find_element(By.XPATH, "//a[@href='/EducationalTrajectoryTheory']")
        edu_link.click()

        # 2. Явное ожидание перехода по URL
        WebDriverWait(driver, 10).until(EC.url_contains("/EducationalTrajectoryTheory"))
        self.assertIn("/EducationalTrajectoryTheory", driver.current_url)

        # 3. Ожидание появления input для файла
        upload_input = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.ID, "graphFile"))
        )
        self.assertIsNotNone(upload_input)

        # 4. Загрузка файла
        upload_input.send_keys(self.test_file)
        time.sleep(1)  # Дать JS обновить надпись

        # 5. Проверка имени файла
        file_name_span = driver.find_element(By.ID, "fileName")
        self.assertIn("true.json", file_name_span.text)

        # 6. Клик по кнопке Calculate
        calc_btn = driver.find_element(By.ID, "calculateBtn")
        self.assertTrue(calc_btn.is_enabled())
        calc_btn.click()
        time.sleep(2)  # Дать странице обработать

        # 7. Проверка, что страница не пустая и нет ошибок
        body_text = driver.page_source
        self.assertTrue(len(body_text) > 1000)
        self.assertNotIn("Ошибка", body_text)

if __name__ == "__main__":
    unittest.main()