const { chromium } = require("playwright");
const { decideLink } = require("./novaAgent");

async function runAgent(url, instruction) {

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log("Opening website:", url);

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract links and buttons
    let links = await page.locator("a, button").allTextContents();

    // Clean and filter links
    links = links
        .map(link => link.trim())
        .filter(link =>
            link.length > 0 &&           // remove empty
            link.length < 40 &&          // remove long junk text
            !link.includes("<") &&       // remove html
            !/\d{3,}/.test(link)         // remove numbers like 408k
        );

    // Remove duplicates
    links = [...new Set(links)];

    // Limit number of options sent to AI
    links = links.slice(0, 20);

    console.log("Filtered links:", links);

    // Ask Nova which link to click
    const decision = await decideLink(instruction, links);

    console.log("AI chose:", decision);

    try {

        // Click element containing that text
        await page.getByText(decision, { exact: false }).first().click();

        console.log("Clicked:", decision);

    } catch (error) {

        console.log("Could not find link:", decision);

    }

    await page.waitForTimeout(5000);

    await browser.close();

    return decision;
}

module.exports = { runAgent };