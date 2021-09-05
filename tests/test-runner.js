/* global describe, it, before, after */

const { expect } = require('chai')
const AxeBuilder = require('@axe-core/webdriverjs')
const pa11y = require('pa11y')
const fs = require('fs')
const slugify = require('slugify')

let axeResults
let axeIssues

let pa11yResults
let pa11yIssues

function testURL (testCase, driver) {
  describe(testCase.name, () => {
    describe('axe-core', async () => {
      before(async () => {
        await driver.get(testCase.url)
      })

      it('should evaluate the page and save output', async () => {
        const a11y = await new AxeBuilder(driver)
        const results = await a11y.analyze()
        expect(results).to.not.be.an('undefined')
        axeResults = results
        axeIssues = { incomplete: results.incomplete, voilations: results.violations }
      })
    })

    describe('PA11Y', async () => {
      it('should evaluate the page and save output', async () => {
        const results = await pa11y(testCase.url)
        expect(results).to.not.be.an('undefined')
        pa11yResults = results
        pa11yIssues = results.issues
      })
    })

    after(async () => {
      const fileName = slugify(testCase.name, { lower: true })

      await fs.writeFile(`results/axe-core/complete-output/${fileName}.json`, JSON.stringify(axeResults, null, 2), (err) => {
        if (err) throw err
      })
      await fs.writeFile(`results/axe-core/issues-only/${fileName}.json`, JSON.stringify(axeIssues, null, 2), (err) => {
        if (err) throw err
      })
      await fs.writeFile(`results/pa11y/complete-output/${fileName}.json`, JSON.stringify(pa11yResults, null, 2), (err) => {
        if (err) throw err
      })
      await fs.writeFile(`results/pa11y/issues-only/${fileName}.json`, JSON.stringify(pa11yIssues, null, 2), (err) => {
        if (err) throw err
      })
    })
  })
}

module.exports = testURL
