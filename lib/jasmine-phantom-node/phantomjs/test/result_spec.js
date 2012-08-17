(function() {
  var Result, expect, sinon;

  sinon = require('sinon');

  expect = require('chai').expect;

  Result = require('../src/result');

  describe('Result', function() {
    beforeEach(function() {
      this.logObj = {
        0: ['Log 1', 'Another Log'],
        1: ['Log 2'],
        3: ['Log 4', 'more Logs']
      };
      this.errorsObj = {
        1: [
          {
            msg: 'Failure 1',
            trace: {
              file: 'a file'
            }
          }
        ],
        2: [
          {
            msg: 'Failure 2',
            trace: {
              file: 'another file'
            }
          }
        ],
        3: [
          {
            msg: 'Failure 3',
            trace: {
              file: 'file'
            }
          }
        ]
      };
      return this.resultObj = {
        passed: false,
        stats: {
          failures: 1,
          specs: 4,
          time: 0.10
        },
        specs: [
          {
            description: "Spec 1",
            id: 0,
            passed: true
          }
        ],
        suites: [
          {
            description: "Suite 1",
            id: 0,
            passed: true,
            specs: [
              {
                description: "Spec 2",
                id: 1,
                passed: true
              }, {
                description: "Spec 3",
                id: 2,
                passed: true
              }
            ],
            suites: [
              {
                description: "Suite 2",
                id: 1,
                passed: false,
                specs: [
                  {
                    description: "Spec 4",
                    id: 3,
                    passed: false
                  }
                ],
                suites: []
              }
            ]
          }
        ]
      };
    });
    return describe('#prepare', function() {
      describe('when console and errors are :never', function() {
        beforeEach(function() {
          return this.result = new Result(this.resultObj, this.logObj, this.errorsObj, {
            console: 'never',
            errors: 'never'
          }).process();
        });
        return it('does not add the log and error statements to the specs', function() {
          var expected;
          expected = {
            passed: false,
            stats: {
              failures: 1,
              specs: 4,
              time: 0.10
            },
            specs: [
              {
                description: "Spec 1",
                passed: true
              }
            ],
            suites: [
              {
                description: "Suite 1",
                passed: true,
                specs: [
                  {
                    description: "Spec 2",
                    passed: true
                  }, {
                    description: "Spec 3",
                    passed: true
                  }
                ],
                suites: [
                  {
                    description: "Suite 2",
                    passed: false,
                    specs: [
                      {
                        description: "Spec 4",
                        passed: false
                      }
                    ],
                    suites: []
                  }
                ]
              }
            ]
          };
          return expect(this.result).to.eql(expected);
        });
      });
      describe('when console is :always', function() {
        beforeEach(function() {
          return this.result = new Result(this.resultObj, this.logObj, this.errorsObj, {
            console: 'always',
            errors: 'never'
          }).process();
        });
        return it('does add all the log statements to the specs', function() {
          var expected;
          expected = {
            passed: false,
            stats: {
              failures: 1,
              specs: 4,
              time: 0.10
            },
            specs: [
              {
                description: "Spec 1",
                passed: true,
                logs: ['Log 1', 'Another Log']
              }
            ],
            suites: [
              {
                description: "Suite 1",
                passed: true,
                specs: [
                  {
                    description: "Spec 2",
                    passed: true,
                    logs: ['Log 2']
                  }, {
                    description: "Spec 3",
                    passed: true
                  }
                ],
                suites: [
                  {
                    description: "Suite 2",
                    passed: false,
                    specs: [
                      {
                        description: "Spec 4",
                        passed: false,
                        logs: ['Log 4', 'more Logs']
                      }
                    ],
                    suites: []
                  }
                ]
              }
            ]
          };
          return expect(this.result).to.eql(expected);
        });
      });
      describe('when console is :failure', function() {
        beforeEach(function() {
          return this.result = new Result(this.resultObj, this.logObj, this.errorsObj, {
            console: 'failure',
            errors: 'never'
          }).process();
        });
        return it('does add the log statements to the failing specs', function() {
          var expected;
          expected = {
            passed: false,
            stats: {
              failures: 1,
              specs: 4,
              time: 0.10
            },
            specs: [
              {
                description: "Spec 1",
                passed: true
              }
            ],
            suites: [
              {
                description: "Suite 1",
                passed: true,
                specs: [
                  {
                    description: "Spec 2",
                    passed: true
                  }, {
                    description: "Spec 3",
                    passed: true
                  }
                ],
                suites: [
                  {
                    description: "Suite 2",
                    passed: false,
                    specs: [
                      {
                        description: "Spec 4",
                        passed: false,
                        logs: ['Log 4', 'more Logs']
                      }
                    ],
                    suites: []
                  }
                ]
              }
            ]
          };
          return expect(this.result).to.eql(expected);
        });
      });
      describe('when errors is :always', function() {
        beforeEach(function() {
          return this.result = new Result(this.resultObj, this.logObj, this.errorsObj, {
            console: 'never',
            errors: 'always'
          }).process();
        });
        return it('does add all the log statements to the specs', function() {
          var expected;
          expected = {
            passed: false,
            stats: {
              failures: 1,
              specs: 4,
              time: 0.10
            },
            specs: [
              {
                description: "Spec 1",
                passed: true
              }
            ],
            suites: [
              {
                description: "Suite 1",
                passed: true,
                specs: [
                  {
                    description: "Spec 2",
                    passed: true,
                    errors: [
                      {
                        msg: 'Failure 1',
                        trace: {
                          file: 'a file'
                        }
                      }
                    ]
                  }, {
                    description: "Spec 3",
                    passed: true,
                    errors: [
                      {
                        msg: 'Failure 2',
                        trace: {
                          file: 'another file'
                        }
                      }
                    ]
                  }
                ],
                suites: [
                  {
                    description: "Suite 2",
                    passed: false,
                    specs: [
                      {
                        description: "Spec 4",
                        passed: false,
                        errors: [
                          {
                            msg: 'Failure 3',
                            trace: {
                              file: 'file'
                            }
                          }
                        ]
                      }
                    ],
                    suites: []
                  }
                ]
              }
            ]
          };
          return expect(this.result).to.eql(expected);
        });
      });
      return describe('when errors is :failure', function() {
        beforeEach(function() {
          return this.result = new Result(this.resultObj, this.logObj, this.errorsObj, {
            console: 'never',
            errors: 'failure'
          }).process();
        });
        return it('does add the log statements to the failing specs', function() {
          var expected;
          expected = {
            passed: false,
            stats: {
              failures: 1,
              specs: 4,
              time: 0.10
            },
            specs: [
              {
                description: "Spec 1",
                passed: true
              }
            ],
            suites: [
              {
                description: "Suite 1",
                passed: true,
                specs: [
                  {
                    description: "Spec 2",
                    passed: true
                  }, {
                    description: "Spec 3",
                    passed: true
                  }
                ],
                suites: [
                  {
                    description: "Suite 2",
                    passed: false,
                    specs: [
                      {
                        description: "Spec 4",
                        passed: false,
                        errors: [
                          {
                            msg: 'Failure 3',
                            trace: {
                              file: 'file'
                            }
                          }
                        ]
                      }
                    ],
                    suites: []
                  }
                ]
              }
            ]
          };
          return expect(this.result).to.eql(expected);
        });
      });
    });
  });

}).call(this);
