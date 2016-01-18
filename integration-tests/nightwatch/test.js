module.exports = {
    'Assert title' : function (browser) {
        browser
            .url('http://localhost:8080/')
            .waitForElementVisible('body', 1000)
            .getTitle(function(title) {
                console.log(title)
                this.assert.equal('React  TodoMVC', 'React  TodoMVC')
            });
    },
    'Enter text and assert that it was submited' : function (browser) {
        browser
            .url('http://localhost:8080/')
            .waitForElementVisible('body', 1000)
            .setValue('body > section > div > header > input', ['nightwatch', browser.Keys.ENTER])
            .waitForElementVisible("body > section > div > section > ul > li:nth-child(1) > div > label",1000)
            .getText("body > section > div > section > ul > li:nth-child(1) > div > label", function(result) {
                this.assert.equal(result.value, "nightwatchX");
            })
    },

    'Edit the text and assert successful change' : function(browser) {
        browser
            .url('http://localhost:8080/')
            .doubleClick('body > section > div > section > ul > li:nth-child(1) > div > label')
            .setValue('body > section > div > section > ul > li:nth-child(1) > div > label', 'New title');


    },

    'Check if task completion works by clicking toggle' : function(browser) {
        browser
            .url('http://localhost:8080/')
            .click('body > section > div > section > ul > li:nth-child(1) > div > input')
            .assert.elementPresent('body > section > div > section > ul > li.todo-item.completed > div > label', function(element){
                console.log(element);
            })

    },
    // Continues from the previous test, so we don't need to check the checkbox again, just assert if it's still checked
    'Check if completed tasks are deleted after clearing them' : function(browser) {
        browser
            .url('http://localhost:8080/')
            //Checks if the checkbox was toggled
            .assert.elementPresent('body > section > div > section > ul > li.todo-item.completed > div > label', function (element) {
                console.log(element);
            })
            //Clears completed tasks
            .click('body > section > div > footer > button')
            //Asserts that task was successfully cleared
            .assert.elementNotPresent('body > section > div > section > ul > li:nth-child(1) > div > input')
            .end();
    },
};