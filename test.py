import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Block domains to avoid timeout
        await page.route("**/*", lambda route: route.abort()
            if any(domain in route.request.url for domain in ['fonts.googleapis.com', 'cdnjs.cloudflare.com', 'fonts.gstatic.com'])
            else route.continue_()
        )

        await page.goto("http://localhost:3000")

        # Wait for the page to load
        await page.wait_for_selector('h1', state='visible')

        # Form submission 1
        await page.fill('#month-year', '2023-01')
        await page.fill('#monthly-investment', '1000')
        await page.fill('#end-valuation', '1050')
        await page.click('button[type="submit"]')

        # Form submission 2
        await page.fill('#month-year', '2023-02')
        await page.fill('#monthly-investment', '500')
        await page.fill('#end-valuation', '1500') # Valuations = 1050 + 500 = 1550 -> 1500 means a 50 loss this month
        await page.click('button[type="submit"]')

        # Verification: Synthèse Globale
        # Total Invested: 1000 + 500 = 1500
        total_invested = await page.locator('#total-invested').inner_text()
        print(f"Total Invested: {total_invested}")
        assert "1 500,00" in total_invested or "1 500,00" in total_invested or "1500,00" in total_invested.replace('\u202f', '')

        # Current Valuation: 1500
        current_val = await page.locator('#current-valuation').inner_text()
        print(f"Current Valuation: {current_val}")
        assert "1 500,00" in current_val or "1 500,00" in current_val or "1500,00" in current_val.replace('\u202f', '')

        # Total Profit/Loss: 1500 - 1500 = 0
        total_profit_loss = await page.locator('#total-profit-loss').inner_text()
        print(f"Total Profit/Loss: {total_profit_loss}")
        assert "0,00" in total_profit_loss

        # Verification: Table rows
        rows = await page.locator('#history-tbody tr').all()
        assert len(rows) == 2

        # Verify Row 1 (Jan 2023)
        row1_cells = await rows[0].locator('td').all_inner_texts()
        print(f"Row 1: {row1_cells}")
        assert "janv. 2023" in row1_cells[0]
        # Monthly Investment: 1000
        assert "1 000,00" in row1_cells[1] or "1 000,00" in row1_cells[1] or "1000,00" in row1_cells[1].replace('\u202f', '')
        # Cumul: 1000
        assert "1 000,00" in row1_cells[2] or "1 000,00" in row1_cells[2] or "1000,00" in row1_cells[2].replace('\u202f', '')
        # Valuation: 1050
        assert "1 050,00" in row1_cells[3] or "1 050,00" in row1_cells[3] or "1050,00" in row1_cells[3].replace('\u202f', '')
        # +/- Mensuelle: +50
        assert "50,00" in row1_cells[4]
        assert "+" in row1_cells[4]
        # +/- Globale: +50
        assert "50,00" in row1_cells[5]
        assert "+" in row1_cells[5]

        # Verify Row 2 (Feb 2023)
        row2_cells = await rows[1].locator('td').all_inner_texts()
        print(f"Row 2: {row2_cells}")
        assert "févr. 2023" in row2_cells[0]
        # Monthly Investment: 500
        assert "500,00" in row2_cells[1]
        # Cumul: 1500
        assert "1 500,00" in row2_cells[2] or "1 500,00" in row2_cells[2] or "1500,00" in row2_cells[2].replace('\u202f', '')
        # Valuation: 1500
        assert "1 500,00" in row2_cells[3] or "1 500,00" in row2_cells[3] or "1500,00" in row2_cells[3].replace('\u202f', '')
        # +/- Mensuelle: 1500 - (1050 + 500) = -50
        assert "50,00" in row2_cells[4]
        assert "-" in row2_cells[4]
        # +/- Globale: 1500 - 1500 = 0
        assert "0,00" in row2_cells[5]

        print("All tests passed successfully!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
