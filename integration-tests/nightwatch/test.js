module.exports = {
    'assert title' : function (browser) {
        browser
            .url('http://localhost:8080/')
            .waitForElementVisible('body', 1000)
            .getTitle(function(title) {
                console.log(title)
                this.assert.equal('React  TodoMVC', 'React  TodoMVC')
            });
    },
    'Enter text and assert it was submited' : function (browser) {
        browser
            .url('http://localhost:8080/')
            .waitForElementVisible('body', 1000)
            .setValue('body > section > div > header > input', ['nightwatch', browser.Keys.ENTER])
            .waitForElementVisible("body > section > div > section > ul > li:nth-child(1) > div > label",1000)
            .getText("body > section > div > section > ul > li:nth-child(1) > div > label", function(result) {
                this.assert.equal(result.value, "nightwatch");
            })
    }
};