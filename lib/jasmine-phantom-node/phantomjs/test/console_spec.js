(function() {
  var Console, expect, sinon;

  sinon = require('sinon');

  expect = require('chai').expect;

  Console = require('../src/console');

  describe('Console', function() {
    beforeEach(function() {
      this.log = sinon.stub();
      this.console = {
        log: this.log
      };
      return new Console(this.console);
    });
    describe('#log', function() {
      describe('with strings', function() {
        it('logs a single string', function() {
          this.console.log('Hello logger');
          return expect(this.log.args[0][0]).to.equal('Hello logger');
        });
        it('concatenates multipe strings', function() {
          this.console.log('Hello logger', 'We welcome you', 'Here on Earth');
          return expect(this.log.args[0][0]).to.equal('Hello logger We welcome you Here on Earth');
        });
        it('replaces a single %s', function() {
          this.console.log('Hello %s!', 'logger');
          return expect(this.log.args[0][0]).to.equal('Hello logger!');
        });
        it('replaces multiple %s', function() {
          this.console.log('Hello %s, we welcome you to %s!', 'logger', 'Switzerland');
          return expect(this.log.args[0][0]).to.equal('Hello logger, we welcome you to Switzerland!');
        });
        return it('attaches %s surplus strings', function() {
          this.console.log('Hello %s, we welcome you to Switzerland!', 'logger', 'Yay!');
          return expect(this.log.args[0][0]).to.equal('Hello logger, we welcome you to Switzerland! Yay!');
        });
      });
      describe('with numbers', function() {
        it('logs a single number', function() {
          this.console.log(1);
          return expect(this.log.args[0][0]).to.equal('1');
        });
        it('concatenates multipe numbers', function() {
          this.console.log(1, 2, 3, 4);
          return expect(this.log.args[0][0]).to.equal('1 2 3 4');
        });
        it('replaces a single %d', function() {
          this.console.log('Hello %d!', 1);
          return expect(this.log.args[0][0]).to.equal('Hello 1!');
        });
        it('replaces a single %i', function() {
          this.console.log('Hello %i!', 3);
          return expect(this.log.args[0][0]).to.equal('Hello 3!');
        });
        it('replaces multiple %d', function() {
          this.console.log('I can count %d, %d and %d!', 1, 2, 3);
          return expect(this.log.args[0][0]).to.equal('I can count 1, 2 and 3!');
        });
        it('replaces multiple %i', function() {
          this.console.log('I can count reverse %i, %i and %i!', 3, 2, 1);
          return expect(this.log.args[0][0]).to.equal('I can count reverse 3, 2 and 1!');
        });
        it('attaches %d surplus numbers', function() {
          this.console.log('Hello %d!', 1, 2, 3);
          return expect(this.log.args[0][0]).to.equal('Hello 1! 2 3');
        });
        return it('attaches %i surplus numbers', function() {
          this.console.log('Hello %i!', 1, 2, 3);
          return expect(this.log.args[0][0]).to.equal('Hello 1! 2 3');
        });
      });
      describe('with objects', function() {
        it('logs a boolean', function() {
          this.console.log(true, false);
          return expect(this.log.args[0][0]).to.equal('true false');
        });
        it('logs a date', function() {
          this.console.log(new Date('Thu Mar 08 2012 20:28:56 GMT+0100 (CET)'));
          return expect(this.log.args[0][0]).to.equal('Thu Mar 08 2012 20:28:56 GMT+0100 (CET)');
        });
        it('logs an array', function() {
          this.console.log([1, 2, 3, 4]);
          return expect(this.log.args[0][0]).to.equal('[1, 2, 3, 4]');
        });
        it('logs an object', function() {
          this.console.log({
            a: 1
          });
          return expect(this.log.args[0][0]).to.equal('{ a: 1 }');
        });
        it('logs a nested object', function() {
          this.console.log("Hello object %o. Nice to meet you", {
            a: 1,
            b: {
              x: 1
            }
          });
          return expect(this.log.args[0][0]).to.equal('Hello object { a: 1, b: { x: 1 } }. Nice to meet you');
        });
        return it('logs a nested object until depth 2', function() {
          this.console.log("Hello object %o. Nice to meet you", {
            a: 1,
            b: {
              x: {
                a: 1,
                b: {
                  x: 1
                }
              }
            }
          });
          return expect(this.log.args[0][0]).to.equal('Hello object { a: 1, b: { x: { a: 1, b: [Object] } } }. Nice to meet you');
        });
      });
      describe('with an Object that implements toString()', function() {
        it('%s logs the custom string representation', function() {
          this.console.log('I have a toString(): %s!', {
            toString: function() {
              return '[Yepa]';
            }
          });
          return expect(this.log.args[0][0]).to.equal('I have a toString(): [Yepa]!');
        });
        return it('%o logs the custom string representation', function() {
          this.console.log('I have a toString(): %o!', {
            toString: function() {
              return '[Yepa]';
            }
          });
          return expect(this.log.args[0][0]).to.equal('I have a toString(): [Yepa]!');
        });
      });
      return describe('with an Object that implements toJSON()', function() {
        return it('%o logs the custom JSON representation', function() {
          this.console.log('I have a toJSON(): %o!', {
            toJSON: function() {
              return {
                a: 1
              };
            }
          });
          return expect(this.log.args[0][0]).to.equal('I have a toJSON(): { a: 1 }!');
        });
      });
    });
    describe('#info', function() {
      return it('prefixes a string with INFO', function() {
        this.console.info(true, {
          a: 1
        }, 'Hello logger');
        return expect(this.log.args[0][0]).to.equal('INFO: true { a: 1 } Hello logger');
      });
    });
    describe('#warn', function() {
      return it('prefixes a string with WARN', function() {
        this.console.warn(true, {
          a: 1
        }, 'Hello logger');
        return expect(this.log.args[0][0]).to.equal('WARN: true { a: 1 } Hello logger');
      });
    });
    describe('#error', function() {
      return it('prefixes a string with ERROR', function() {
        this.console.error(true, {
          a: 1
        }, 'Hello logger');
        return expect(this.log.args[0][0]).to.equal('ERROR: true { a: 1 } Hello logger');
      });
    });
    return describe('#debug', function() {
      return it('prefixes a string with DEBUG', function() {
        this.console.debug(true, {
          a: 1
        }, 'Hello logger');
        return expect(this.log.args[0][0]).to.equal('DEBUG: true { a: 1 } Hello logger');
      });
    });
  });

}).call(this);
