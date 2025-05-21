import unittest
import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestGirvanNewmanCommunity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Edge()
        cls.driver.implicitly_wait(5)
        cls.base_url = "http://localhost:5555/home"

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_community_discovery(self):
        driver = self.driver
        driver.get(self.base_url)
        time.sleep(1)

        comm_link = driver.find_element(By.XPATH, "//a[@href='/DiscoveringCommunityUsingGirvanNewmanTheory']")
        comm_link.click()

        WebDriverWait(driver, 10).until(EC.url_contains("/DiscoveringCommunityUsingGirvanNewmanTheory"))
        self.assertIn("/DiscoveringCommunityUsingGirvanNewmanTheory", driver.current_url)

        fill_random_btn = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.ID, "fillRandomBtn"))
        )
        fill_random_btn.click()
        time.sleep(0.5)

        calc_btn = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//form[@id='adjacencyMatrixForm']//button[@type='submit']"))
        )
        calc_btn.click()

        WebDriverWait(driver, 10).until(EC.url_contains("/DiscoveringCommunityUsingGirvanNewmanDecision"))
        self.assertIn("/DiscoveringCommunityUsingGirvanNewmanDecision", driver.current_url)

        time.sleep(1)
        body_text = driver.page_source
        self.assertTrue(len(body_text) > 1000)
        self.assertNotIn("Error", body_text)

if __name__ == "__main__":
    unittest.main()