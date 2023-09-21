const startButtonPush = require("./index.js")

test("returns false if no name is given", () => {
    expect(startButtonPush()).toBe(false)
})