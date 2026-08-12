import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { JSDOM } from 'jsdom'

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url))
const read = (rel) => readFileSync(path(rel), 'utf8')

const html = read('../src/index.html')

const staticDoc = new JSDOM(html).window.document

async function freshPage () {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: pathToFileURL(path('../src/index.html')).href,
  })
  await new Promise((resolve) => {
    if (dom.window.document.readyState === 'complete') return resolve()
    dom.window.addEventListener('load', resolve)
    setTimeout(resolve, 3000)
  })
  const doc = dom.window.document

  const type = (sel, value) => {
    const el = doc.querySelector(sel)
    if (!el) throw new Error(`no element matches ${sel}`)
    el.value = String(value)
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
    el.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
  }
  // The order matters: every control is set, so a page that only listens to
  // one of them is still driven to the state under test.
  const bill = (amount, tip, people) => {
    type('#bill', amount)
    type('#tipPct', tip)
    type('#people', people)
  }
  const textOf = (sel) => (doc.querySelector(sel)?.textContent ?? '').trim()
  const bodyText = () => (doc.body.textContent ?? '')
  return { doc, type, bill, textOf, bodyText }
}

const numbersIn = (text) =>
  (String(text).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)

const shows = (text, expected) =>
  numbersIn(text).some((n) => Math.abs(n - expected) < 0.005)

let page
beforeEach(async () => { page = await freshPage() })

// ---- Foundation ----
describe('Foundation - a valid HTML5 page', () => {
  it('has a doctype, <html lang>, a <head> with <title> + charset, and a <body>', () => {
    expect(staticDoc.doctype?.name?.toLowerCase(), 'Start the file with <!DOCTYPE html>').toBe('html')
    expect(staticDoc.documentElement.getAttribute('lang'), 'Set a language, e.g. <html lang="en">').toBeTruthy()
    expect(staticDoc.querySelector('head title'), 'Add a <title> inside <head>').not.toBeNull()
    expect(staticDoc.title.trim(), 'Put some text inside <title>').toBeTruthy()
    expect(staticDoc.querySelector('meta[charset]'), 'Add <meta charset="utf-8"> inside <head>').not.toBeNull()
    expect(staticDoc.body, 'Wrap your page content in a <body>').not.toBeNull()
  })
})

// ---- The page is given; do not gut it ----
describe('The receipt page', () => {
  it('still has every control and output the starter shipped with', () => {
    for (const id of ['#bill', '#tipPct', '#people', '#tipAmount', '#totalDue', '#perPerson', '#warning']) {
      expect(staticDoc.querySelector(id), `${id} is missing. The HTML was given to you and is not one of the bugs`).not.toBeNull()
    }
    expect(staticDoc.querySelector('#warning').textContent.trim(),
      '#warning starts empty. Your code fills it in only when something is wrong').toBe('')
  })

  it('links an external script.js and keeps no JavaScript in the HTML', () => {
    const linked = [...staticDoc.querySelectorAll('script[src]')]
    expect(linked.some((s) => /script\.js$/i.test(s.getAttribute('src').trim())),
      'Keep the JavaScript in src/script.js, linked with <script src="script.js" defer></script>').toBe(true)
    const inline = [...staticDoc.querySelectorAll('script:not([src])')].map((s) => s.textContent.trim()).filter(Boolean)
    expect(inline.length, 'Do not move code into the HTML to work around a bug').toBe(0)
  })
})

// ---- The maths ----
describe('The receipt adds up', () => {
  it('works out the tip: 15% of 1000 is 150', () => {
    page.bill(1000, 15, 4)
    expect(shows(page.textOf('#tipAmount'), 150),
      `#tipAmount shows "${page.textOf('#tipAmount')}", expected 150`).toBe(true)
  })

  it('works out the total: 1000 plus a 150 tip is 1150', () => {
    page.bill(1000, 15, 4)
    expect(shows(page.textOf('#totalDue'), 1150),
      `#totalDue shows "${page.textOf('#totalDue')}", expected 1150. If it reads 1000150, something is a string`).toBe(true)
  })

  it('splits the total between the diners: 1150 over 4 is 287.50', () => {
    page.bill(1000, 15, 4)
    expect(shows(page.textOf('#perPerson'), 287.5),
      `#perPerson shows "${page.textOf('#perPerson')}", expected 287.50. Check WHICH variable you divided by`).toBe(true)
  })

  it('recalculates when the tip changes', () => {
    page.bill(1000, 15, 4)
    page.type('#tipPct', 20)
    expect(shows(page.textOf('#tipAmount'), 200),
      `After changing the tip to 20%, #tipAmount shows "${page.textOf('#tipAmount')}", expected 200`).toBe(true)
    expect(shows(page.textOf('#totalDue'), 1200),
      `After changing the tip to 20%, #totalDue shows "${page.textOf('#totalDue')}", expected 1200`).toBe(true)
  })

  it('recalculates when the number of diners changes', () => {
    page.bill(1000, 15, 4)
    page.type('#people', 5)
    expect(shows(page.textOf('#perPerson'), 230),
      `After changing the diners to 5, #perPerson shows "${page.textOf('#perPerson')}", expected 230. Check how that listener was wired up`).toBe(true)
  })

  it('shows money with two decimal places', () => {
    page.bill(1000, 15, 4)
    expect(/\d+\.\d{2}(?!\d)/.test(page.textOf('#perPerson')),
      `#perPerson shows "${page.textOf('#perPerson')}". Money is shown to two decimals`).toBe(true)
  })
})

// ---- The guards ----
describe('The receipt refuses nonsense', () => {
  it('warns instead of dividing by zero diners', () => {
    page.bill(1000, 15, 0)
    expect(page.textOf('#warning').length,
      'With 0 diners, #warning should explain that at least one diner is needed').toBeGreaterThan(0)
    expect(/infinity|nan/i.test(page.bodyText()),
      `With 0 diners the page shows "${page.textOf('#perPerson')}". Dividing by zero must never reach the user`).toBe(false)
  })

  it('warns instead of calculating on an empty bill', () => {
    page.bill('', 15, 4)
    expect(page.textOf('#warning').length,
      'With an empty bill, #warning should ask for an amount').toBeGreaterThan(0)
    expect(/nan|undefined/i.test(page.bodyText()),
      `With an empty bill the page shows "${page.textOf('#totalDue')}". A user should never be shown NaN`).toBe(false)
  })

  it('clears the warning once the numbers make sense again', () => {
    page.bill(1000, 15, 0)
    expect(page.textOf('#warning').length, 'The warning should appear first').toBeGreaterThan(0)
    page.bill(1000, 15, 4)
    expect(page.textOf('#warning'),
      'Once the input is valid the warning has to go away again').toBe('')
    expect(shows(page.textOf('#perPerson'), 287.5),
      `After recovering, #perPerson should read 287.50, it reads "${page.textOf('#perPerson')}"`).toBe(true)
  })
})

// ---- Identity ----
describe('Student info (student.json)', () => {
  const info = JSON.parse(read('../student.json'))
  it('student.json is completely filled in', () => {
    for (const field of ['classCode', 'fullName', 'studentNumber', 'studentEmail', 'personalEmail', 'githubAccount']) {
      expect(info[field], `Set ${field} in student.json`).toBeTruthy()
    }
  })
})
