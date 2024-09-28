const colors = require('colors');
colors.enable();
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

// please don't touch this above configuration for setup selenium-webdriver to test electron app
const path = require('path')
const webdriver = require('selenium-webdriver')
const until = webdriver.until;
const By = webdriver.By;
const assert = require('assert');
const driver = new webdriver.Builder()
    // The "9515" is the port opened by ChromeDriver.
    .usingServer('http://localhost:9515')
    .withCapabilities({
        'goog:chromeOptions': {
            "binary": path.join(__dirname, '/node_modules/electron/dist/electron.exe'),
            "args": ['--app=' + path.join(__dirname, "/")]
        }
    })
    .forBrowser('chrome') // note: use .forBrowser('electron') for selenium-webdriver <= 3.6.0
    .build()
// here you should write your test cases.


async function runTests() {
    try {
        await driver.wait(until.elementLocated(By.id('registration-form')), 10000);

        const usernameField = await driver.findElement(By.id('username'));
        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));

        const submitButton = await driver.findElement(By.css('button[type="submit"]'));

        await usernameField.sendKeys('testuser');
        await emailField.sendKeys('test@example.com');
        await passwordField.sendKeys('password123');

        await submitButton.click();

        await driver.wait(until.alertIsPresent());

        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();

        console.log(colors.help("ALERT WILL BE PROMPTED"));
        console.log("");
        console.log(alertText);
        console.log("");
        assert(alertText.includes('22223'), colors.error('Username is incorrect'));
        console.log(colors.info("ALERT TEST 1 "), alertText.includes('22223'));
        assert(alertText.includes('Email: test@example.com'), colors.error('Email is incorrect'));
        console.log(colors.info("ALERT TEST 2 "), alertText.includes('Email: test@example.com'));
        assert(alertText.includes('Password: password123'), colors.error('Password is incorrect'));
        console.log(colors.info("ALERT TEST 3 "), alertText.includes('Password: password123'));
        // Accept the alert
        await alert.accept();
        console.log("");

        console.log(colors.info('All tests passed!'));
    } catch (err) {
        console.log(colors.error('Test failed'), err);
    } finally {
        // Close the driver after tests complete
        await driver.quit();
    }
}

runTests();
