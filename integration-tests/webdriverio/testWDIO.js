
var chai = require('chai');
var assert = require('chai').assert



describe('my awesome website', function() {
    it('should do some chai assertions', function() {
        return browser
            .url('http://localhost:8080/')
            .title(function(err, res) {
                var title = res.value;
                //.getTitle().should.eventually.be.equal('WebdriverIO');
                console.log('Title was: ' + res.value);
                assert.ok(false, 'this will fail');
            });


    });

    it('should enter and successfully submit a string', function() {
        return browser
            .url('http://localhost:8080/')
            .addValue('body > section > div > header > input', 'WBIO TEST')
            .keys('Enter')
            .getText('body > section > div > section > ul > li:nth-child(1) > div > label').then(function(text) {
                console.log(text);
                assert.ok(text === 'WBIO TEST');
            });

    });

    xit('should edit the text after double clicking the element', function() {
        return browser
            .doubleClick('body > section > div > section > ul > li:nth-child(1) > div > label')
            .clearElement('//li[2]/input')
            .keys('text-changed')
            .keys('Enter')
            .getText('body > section > div > section > ul > li:nth-child(1) > div > label').then(function(text) {
                console.log(text);
                assert.ok(text === 'text-changed');
            });
    });








});