// Curbside Thai - split the receipt.
//
// This file has SIX bugs in it. They were put there on purpose.
// The HTML is correct and is not one of them.
//
// One bug stops the page dead before anything renders.
// Three are silent: no error message, just a wrong number on screen.
// One stops a control from doing anything at all.
// One is a guard clause that warns and then carries on anyway.
//
// Do not rewrite the file from scratch. Find each bug, fix it, and write
// down what it was in BUGS.md. That write-up is the point of the exercise.

const billEl = document.querySelector('#bill')
const tipEl = document.querySelector('#tipPct')
const peopleEl = document.querySelector('#people')

const tipOut = document.querySelector('#tipamount')
const totalOut = document.querySelector('#totalDue')
const eachOut = document.querySelector('#perPerson')
const warningOut = document.querySelector('#warning')

function money (value) {
  return value.toFixed(2)
}

function blankTheReceipt () {
  tipOut.textContent = '--'
  totalOut.textContent = '--'
  eachOut.textContent = '--'
}

function render () {
  const bill = billEl.value
  const tipPct = Number(tipEl.value)
  let people = Number(peopleEl.value)

  if (billEl.value.trim() === '') {
    warningOut.textContent = 'Enter a bill amount.'
    blankTheReceipt()
  }

  if (people = 0) {
    warningOut.textContent = 'You need at least one diner.'
    blankTheReceipt()
    return
  }

  warningOut.textContent = ''

  const tipAmount = bill * tipPct / 100
  const totalDue = bill + tipAmount
  const perPerson = totalDue / tipPct

  tipOut.textContent = money(tipAmount)
  totalOut.textContent = money(totalDue)
  eachOut.textContent = money(perPerson)
}

billEl.addEventListener('input', render)
tipEl.addEventListener('change', render)
peopleEl.addEventListener('input', render())

render()
