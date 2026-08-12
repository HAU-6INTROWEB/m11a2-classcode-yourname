# Module 11 - Activity 2 - The Broken Receipt

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

This one is different. You are not writing a page from scratch: you are being
handed one that is **already broken**, and your job is to find out why.

[`src/`](src/) holds a "split the bill" receipt: a bill amount, a tip percentage,
a number of diners, and three figures worked out from them. It should be simple.
It is not currently working.

**There are six bugs in [`src/script.js`](src/script.js).** The HTML and the CSS
are correct and are not among them.

## What the page is supposed to do

| Field | Rule |
| --- | --- |
| `#tipAmount` | the bill times the tip percentage, divided by 100 |
| `#totalDue` | the bill plus the tip |
| `#perPerson` | the total due divided by the number of diners |
| all three | shown to two decimal places |
| `#warning` | a message when the bill is empty, or when there is less than one diner |
| everything | recalculates when **any** of the three controls changes |

When a warning is showing, the three figures show `--` rather than a wrong
number. When the input becomes valid again, the warning goes away.

## What to do

1. **Open the page and open the console before you touch anything.** One bug
   stops the page dead, and it names itself. Fix that one first: nothing else can
   be observed until it is gone.

2. **Work through the rest.** Three of them are **silent**: no error message,
   just a wrong number. One stops a control from doing anything at all. One is a
   guard clause that warns and then carries on regardless.

3. **Do not rewrite the file from scratch.** You would learn nothing, and it is
   slower than reading it.

4. **Write `BUGS.md`** in the root of your repo. One short entry per bug:

   ```markdown
   ## Bug 3 - the diners box did nothing

   **Line:** 62
   **Kind:** logic
   **What was wrong:** the listener was given `render()` instead of `render`,
   so it ran once at page load and the listener received its return value.
   **How I found it:** typed in the box, added `console.count('render')`,
   and it never counted past 1.
   **The fix:** removed the parentheses.
   ```

   `BUGS.md` is not machine-graded, and it is still the most valuable part of
   this activity. Writing down how you found a bug is what turns one hour of
   frustration into a technique you keep.

5. **Fill in `student.json`** with your details (keep it identical to your other
   activities; the `classCode` must match your repo name).

```json
{
  "classCode": "1234",
  "fullName": "Juan Dela Cruz",
  "studentNumber": "2026-12345",
  "studentEmail": "juan.delacruz@hau.edu.ph",
  "personalEmail": "juan@example.com",
  "githubAccount": "juandelacruz"
}
```

> **The tests are the specification.** If one still fails, there is still a bug.

## Reference

The module reference is in the course content: **Module 11 - Debugging and Error
Handling** (`Debugging-and-Errors-Reference.md`) - the three kinds of bug,
reading an error message, the console toolkit, breakpoints, and the debugging
routine.

## Running the tests

```bash
npm install
npm test
```

The autograder is **13 checks** (roughly 1 point each):

- the page is valid HTML5
- every control and output the starter shipped with is still there
- the JavaScript is still an external `script.js`, with none moved into the HTML
- bill 1000 with a 15% tip gives a tip of 150
- ...and a total of 1150
- ...and 287.50 each between 4 diners
- changing the tip recalculates the tip and the total
- changing the number of diners recalculates the split
- money is shown to two decimal places
- 0 diners warns, and no `Infinity` reaches the page
- an empty bill warns, and no `NaN` reaches the page
- the warning clears once the numbers make sense again
- `student.json` is completely filled in

## Hints, in the order you will need them

- The console names the first bug, with a file and a line number. Click the link.
- Bug hunting order matters: a page that dies on load cannot show you its other
  bugs.
- `console.count('render')` answers "is this even running, and how often?"
- When a number is wrong but no error appears, log the **inputs** to the sum and
  their `typeof`.
- `1000150` is not a big number. It is two strings glued together.
- Read every `if` twice. One of them is not asking a question.

## Set up your repo

1. **Create from the template** - *Use this template -> Create a new repository*.
2. **Owner = the `HAU-6INTROWEB` course org.**
3. **Name it** `m11a2-<classcode>-yourname`. The `<classcode>` must match
   `student.json`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6INTROWEB/m11a2-<classcode>-yourname.git
cd m11a2-<classcode>-yourname
```

## Confirm your submission

When your tests pass locally, **commit and push**:

```bash
git add -A
git commit -m "All six bugs found and fixed"
git push
```

Pushing triggers the **Autograde** workflow. Open the **Actions** tab, then the
latest **Autograde** run, and confirm the green check and the "13 / 13 tests
passed" summary.

## Work in a Codespace (recommended)

A **Codespace** is a complete dev environment that runs in the cloud, so you do
not have to install anything on your own laptop. This repo is already configured:
open a Codespace and everything you need is ready.

**Open one:** click the green **Code** button -> **Codespaces** tab -> **Create
codespace on main**. The first launch takes a minute; after that it is instant.

**Use it in VS Code (recommended).** Install the **GitHub Codespaces** extension
in VS Code, or from the running Codespace click the menu -> **Open in VS Code
Desktop**. Same environment, your own editor.

### Make your free hours last (please read)
Your GitHub Education account includes a generous but limited monthly Codespaces
allowance. Three habits keep you from wasting it:

1. **Set your idle timeout to 10 minutes.** Go to
   **github.com/settings/codespaces -> Default idle timeout -> 10 minutes ->
   Save.** This makes a Codespace auto-stop after 10 idle minutes.
2. **Stop it when you finish - do not just close the tab.** Stop it at
   **github.com/codespaces -> ... -> Stop codespace**, or run *Codespaces: Stop
   Current Codespace* from the Command Palette.
3. **Delete the Codespace once you have submitted.** After your final push:
   **github.com/codespaces -> ... -> Delete.** You can recreate it later from the
   green **Code** button.

---
📚 **These materials were authored by [tjakoen](https://github.com/tjakoen), built with Claude.** I use AI in the open, and I expect you to use it to learn the material, not to skip the learning. [How I actually work with AI ->](https://tjakoen.github.io/notes/ten-times-zero)
