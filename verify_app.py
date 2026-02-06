from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000")

    # Verify Title
    expect(page).to_have_title("Mes sessions")
    print("Title verified")

    # Verify FAB
    fab = page.locator("#fab-add")
    expect(fab).to_be_visible()
    print("FAB visible")

    # Take screenshot of home
    page.screenshot(path="verification_home.png")

    # Test Accordion
    first_module_header = page.locator(".module-header").first
    first_module_header.click()
    # Wait for expansion (css transition)
    page.wait_for_timeout(500)
    page.screenshot(path="verification_expanded.png")
    print("Accordion expanded")

    # Test Modal
    fab.click()
    expect(page.locator("#modal-add-module")).to_be_visible()
    page.screenshot(path="verification_modal.png")
    print("Modal opened")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
