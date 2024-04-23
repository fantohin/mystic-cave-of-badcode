from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def scrape_marketplace(url):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        content = page.content()
        browser.close()

    soup = BeautifulSoup(content, 'html.parser')
    # Example: Extract item titles
    items = soup.find_all('div', class_='item-title')
    titles = [item.text for item in items]
    return titles


url = "https://www.avito.ru/all/telefony?q=нет+паролся&s=104"#st.text_input('Enter Marketplace URL:')
if url:
    items = scrape_marketplace(url)
    items