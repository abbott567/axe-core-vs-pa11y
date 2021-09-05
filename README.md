# Axe-core vs Pa11y

We use [axe-core](https://www.npmjs.com/package/axe-core) by [Deque](https://www.deque.com/) regularly as part of acceptance tests. With [GitLab](https://docs.gitlab.com/ee/user/project/merge_requests/accessibility_testing.html) now offering [PA11Y](https://www.npmjs.com/package/pa11y) as part of the Continuous Integration (CI) Pipeline with zero config, I wanted to understand how it stacked up against axe-core. Can you drop axe-core for PA11Y? Can you drop PA11Y for axe-core? Should you use both?

Spoiler alert, all automated tools perform poorly. This doesn't mean we shouldn't use them. But we need to remain realistic about how many errors we may still have on our pages, even if the tools can't find them.

## Summary of results

Out of 142 issues tested:

Axe-core found 39 issues in total, or 27%. 36 were violations and 3 were potential issues which required a user to check manually.

PA11Y found 29 issues in total, or 20%.

19 issues (13%) were found by both tools. 

20 issues (14%) were found by axe-core but not PA11y.

10 issues (7%) were found by PA11Y but not axe-core.

Combined, 49 issues (35%) were found.

## Conclusion

Although both tools find a lot of the same issues, some issues are found by one tool but not the other. Therefore I do not think you can favour one tool over the other. 

I also do not think we can assume axe-core is better than PA11Y because it finds more issues, as the issues tested in this set of tests might just happen to play to axe-core's strengths. It's very likely that PA11Y might outperform axe-core on a different set of tests.

What is clear from the results, is that each tool definitely finds things which the other does not. Therefore, from these tests, I would recommend using both axe-core and PA11Y in your acceptance tests. By using both you can expect to find around 35% of known issues.

## Method

Testing automated tools is always going to be difficult. There are so many ways to make something inaccessible that designing a tool or a test to find everything is probably impossible. 

So, to compare the two tools, I set up a simple test suite using Mocha and had each tool evaluate [the worlds least-accessible webpage](https://alphagov.github.io/accessibility-tool-audit/test-cases.html). The page is deliberately terrible. It has 142 known accessibility issues, so it is a good benchmark to see how automated tools perform. 

You can [read more about the worlds-least accessible webpage on the GDS accessibility blog](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/).

## Interpreting the results

The two tools do not report on issues in the exact same way. Axe-core finds issues and potential issues, PA11Y just finds issues or no issues. For the purposes of the test, if axe-core asks the user to manually check it, I'm still saying it found the issue.

### Interpreting axe-core results

Axe-core returns an object with 3 categories. Passed, incomplete and violations. 

Passed is what the tool checked and found to be ok. Violations are what the tool found to be definite issues. Incomplete is when the tool could not reach a decision on whether it was ok or not. For issues in the incomplete category, the user must manually check them.

For example:
```javascript
{
  passed: [],     // Tests axe-core passed as non-issues
  incomplete: [], // Tests axe-core could not complete and the user must check
  voilations: []  // Tests axe-core failed as accessibility issues
}
```

### Interpreting PA11Y results
PA11Y returns an object with only 1 category which it calls issues. So unlike axe-core, PA11Y does not raise things for the user to check manually. It just finds issues, or it does not.

For example:
```javascript
{
  issues: [] // Tests which either failed or require a user input
}
```

## Anomalies

There were a few anomalies between running these axe-core tests in 2021 and comparing them to the original 2016 GDS tests.

In the 2016 GDS tests, it is not clear if it was axe-core or Axe DevTools which was used. I assume it to be Axe DevTools which is a Chrome extension. However, they both use the same engine so the results should be the same. 

In the 2016 GDS tests, Axe found 43 issues in total, made up of 41 violations and 2 issues which required the user to check. 

This is higher than in my tests. In my 2021 tests, axe-core only found 39 issues in total, made up of 36 violations and 3 issues which required the user to check.

This could be due to different versions of the tools being used, meaning Axe itself has possibly regressed, or it is simply human error when recording the tests.

### Table has no table headings 
- 2016 Axe found the issue
- 2021 axe-core does not find the issue
- 2021 Axe DevTools does not find the issue

### Table that only has TH elements in it
- 2016 Axe found the issue
- 2021 axe-core flags it for user review
- 2021 Axe DevTools flags it for user review

### Embedded audio file is missing text alternative
- 2016 Axe flags it for user review
- 2021 axe-core does not find the issue
- 2021 Axe DevTools does not find the issue

### Link to #, invalid hypertext reference
- 2016 Axe found the issue
- 2021 axe-core does not find the issue
- 2021 Axe DevTools does not find the issue

### Group of radio buttons not enclosed in a fieldset
- 2016 Axe found the issue
- 2021 axe-core does not find the issue
- 2021 Axe DevTools does not find the issue

### Group of check boxes not enclosed in a fieldset
- 2016 Axe found the issue
- 2021 axe-core does not find the issue
- 2021 Axe DevTools does not find the issue

### Two unique labels, but identical for= attributes
- 2016 Axe found the issue
- 2021 axe-core flags it for user review
- 2021 Axe DevTools flags it for user review

## Running the tests

The test files are all available in the results folder, however if you want to re-run the tests, first clone the project and use the command:
```
npm install
```

Next, delete all the JSON files in the results folders. Do not delete the folders themselves or the tests will fail.

To run the tests you can use one of the following commands:
```
npm test
npm start
```

Axe-core runs using Selenium and ChromeDriver. This can sometimes be a bit flakey depending on which version of Google Chrome you have installed and how old this project is when you come to run it.

Once the tests have finished the JSON data will be in the results folder.

## Table of results
| Test case | axe-core | PA11Y |
| --------- | -------- | ----- |
| Content identified by location | Not found | Not found |
| Plain language is not used | Not found | Not found |
| Content is not in correct reading order in source code | Not found | Not found |
| Content is not organised into well-defined groups or chunks, using headings, lists, and other visual mechanisms | Not found | Not found |
| First instance of abbreviation not expanded | Not found | Not found |
| Wide page forces users to scroll horizontally | Not found | Not found |
| Colour alone is used to convey content | Not found | Not found |
| Small text does not have a contrast ratio of at least 4.5:1 so does not meet AA | Issue found | Not found |
| Large text does not have a contrast ratio of at least 3:1 so does not meet AA | Issue found | Not found |
| Small text does not have a contrast ratio of at least 7:1 so does not meet AAA | Issue found | Not found |
| Large text does not have a contrast ratio of at least 4.5:1 so does not meet AAA | Issue found | Not found |
| Focus not visible | Not found | Not found |
| Inadequate line height used | Not found | Not found |
| All caps text found | Not found | Not found |
| Blink element found | Issue found | Issue found |
| Italics used on long sections of text | Not found | Not found |
| Marquee element found | Issue found | Not found |
| Long lines of text | Not found | Not found |
| Very small text found | Not found | Not found |
| Justified text found | Not found | Not found |
| Text language changed without required change in direction | Not found | Not found |
| html element has an empty lang attribute | Issue found | Issue found |
| lang attribute not used to identify change of language | Not found | Not found |
| Text language is in the wrong direction | Not found | Not found |
| html element has an invalid value in the lang attribute | Issue found | Not found | Not found |
| lang attribute used to identify change of language, but with invalid value | Issue found | Not found |
| html element is missing a lang attribute | Issue found | Issue found |
| html element has lang attribute set to wrong language | Not found | Not found |
| lang attribute used to identify change of language, but with wrong language | Not found | Not found |
| Inappropriate page title | Not found | Not found |
| Empty page title | Issue found | Issue found |
| Missing page title | Issue found | Issue found |
| Empty heading | Issue found | Issue found |
| Missing H1 | Issue found | Not found |
| Text formatting used instead of an actual heading | Not found | Not found |
| Headings not structured in a hierarchical manner | Issue found | Not found |
| LI element with no parent | Issue found | Not found |
| List not marked up as a list | Not found | Not found |
| DT or DD elements that are not contained within a DL element | Issue found | Not found |
| Improperly nested lists | Issue found | Not found |
| Table with column headers and double row headers | Not found | Issue found |
| Table has no scope attributes | Not found | Issue found |
| Table nested within table header | Not found | Not found |
| Table nested within table | Not found | Not found |
| Table has no table headings | Not found | Not found |
| Table with inconsistent numbers of columns in rows | Not found | Issue found |
| Table that only has TH elements in it | User to check | Not found |
| Table is missing a caption | Not found | Not found |
| Table used for layout | Not found | Not found |
| Table has an empty table header | Not found | Issue found |
| Table with some empty cells | Not found | Not found |
| Image has alt and title that are different | Not found | Not found |
| Image with presentation role has non-empty alt | Issue found | Not found |
| Image with no alt attribute | Issue found | Issue found |
| Background image that conveys information does not have a text alternative | Not found | Not found |
| Image has empty alt and non-empty title | Not found | Issue found |
| A distraction is present, an animated gif | Not found | Not found |
| Image that conveys information has an empty alt attribute | Not found | Not found |
| Image that conveys information has inappropriate alt text | Not found | Not found |
| Image alt attribute contains image file name | Not found | Not found |
| Image with partial text alternative | Not found | Not found |
| Embedded video file is missing text alternative | User to check | Not found |
| Flashing content doesn't have warning | Not found | Not found |
| Embedded audio file is missing text alternative | Not found | Not found |
| Image link with no alternative text | Issue found | Issue found |
| Link to javascript, invalid hypertext reference | Not found | Not found |
| Uninformative link text | Not found | Not found |
| Link launches new window with no warning | Not found | Not found |
| Links not separated by printable characters | Not found | Not found |
| Link text with identical title | Not found | Not found |
| Links to a sound file, no transcript | Not found | Not found |
| Identifying links by colour alone | Not found | Not found |
| Link to PDF does not include information on file format and file size | Not found | Not found |
| Link to #, invalid hypertext reference | Not found | Not found |
| Blank link text | Issue found | Issue found |
| Links with the same text go to different pages | Not found | Not found |
| Link text does not make sense out of context | Not found | Not found |
| Adjacent links going to the same destination | Not found | Not found |
| Link contains only a full stop | Not found | Not found |
| Image link alt text repeats text in the link | Issue found | Not found |
| Link not clearly identifiable and distinguishable from surrounding text | Not found | Not found |
| Link to a multimedia file, no transcript | Not found | Not found |
| Non-specific link text | Not found | Not found |
| Link to an image, no text alternative | Not found | Not found |
| Image button has no alt attribute | Issue found | Issue found |
| Empty button | Issue found | Issue found |
| Uninformative alt attribute value on image button | Not found | Not found |
| Empty alt attribute on image button | Issue found | Issue found |
| Errors identified by colour only | Not found | Not found |
| Labels missing when they would look clumsy for some form controls | Issue found | Issue found |
| Error messages - no suggestion for corrections given, e.g. required format | Not found | Not found |
| Left aligned form labels with too much white space | Not found | Not found |
| Group of radio buttons not enclosed in a fieldset | Not found | Not found |
| Form element has no label | Issue found | Issue found |
| Fieldset without a legend | Not found | Issue found
| Empty legend | Not found | Issue found |
| Label element with for= attribute but not matching id= attribute of form control | Issue found | Issue found |
| Group of check boxes not enclosed in a fieldset | Not found | Not found |
| Empty label found | Issue found | Not found |
| Two unique labels, but identical for= attributes | User to check | Not found |
| Errors identified with a poor colour contrast | Issue found | Issue found |
| Non-unique field label found | Not found | Not found |
| Missing labels in checkboxes | Issue found | Issue found |
| Field hint not associated with input | Not found | Not found |
| Placeholder no label | Not found | Issue found |
| Errors are not identified | Not found | Not found |
| Form control that changes context without warning | Not found | Not found |
| Inadequately-sized clickable targets found | Not found | Not found |
| Alert shows for a short time | Not found | Not found |
| Lightbox - close button doesn't receive focus | Not found | Not found |
| Focus order in wrong order | Not found | Not found |
| Tabindex greater than 0 | Issue found | Not found |
| Keyboard focus is not indicated visually | Not found | Not found |
| Keyboard focus assigned to a non focusable element using tabindex=0 | Not found | Not found |
| Concertina items don't get keyboard focus | Not found | Not found |
| Keyboard trap | Not found | Not found |
| Dropdown navigation - only the top level items receive focus | Not found | Not found |
| Lightbox - ESC key doesn't close the lightbox | Not found | Not found |
| Link with a role=button does not work with space bar | Not found | Not found |
| Tooltips don't receive keyboard focus | Not found | Not found |
| Accesskey attribute used | Not found | Not found |
| Lightbox - focus is not moved immediately to lightbox | Not found | Not found |
| Lightbox - focus is not retained within the lightbox | Not found | Not found |
| Fake button is not keyboard accessible | Not found | Not found |
| iframe is missing a title attribute | Issue found | Issue found |
| iframe title attribute does not describe the content or purpose of the iframe | Not found | Not found |
| Content is not readable and functional when text is increased | Not found | Not found |
| Non-decorative content inserted using CSS | Not found | Not found |
| visibility:hidden used to visually hide content when it should be available to screenreader | Not found | Not found |
| display:none used to visually hide content when it should be available to screenreader | Not found | Not found |
| Page zoom - boxes that don't expand with the text | Not found | Not found |
| Duplicate id | Issue found | Issue found |
| Article element used to mark-up an element that's not an article/blog post etc. | Not found | Not found |
| Empty paragraph | Not found | Not found |
| Deprecated center element | Not found | Issue found |
| Invalid ARIA role names | Issue found | Not found |
| Object not embedded accessibly - wmode parameter not set to window | Not found | Not found |
| Spacer image found | Not found | Not found |
| Inline style adds colour | Not found | Not found |
| Start and close tags don't match | Not found | Not found |
| PRE element without CODE element inside it | Not found | Not found |
| Deprecated font element | Not found | Issue found |
