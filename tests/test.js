/* global describe, after */
const testURL = require('./test-runner')
const chrome = require('selenium-webdriver/chrome')
const chromedriver = require('chromedriver')
const { Builder } = require('selenium-webdriver')
const testCases = require('./test-cases')

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build())

describe('Test runner', () => {
  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .build()

  testCases.forEach(testCase => {
    testURL(testCase, driver)
  })

  after(async () => {
    await driver.quit()
  })
})
