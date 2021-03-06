describe("HaikuAppRouter poems", function() {
  beforeEach(function() {
    this.poems = new Backbone.Collection({})
    HaikuApp.navbar = new Backbone.View({})  
    HaikuApp.currentUser = {id: 1, name: "Basho", poems: function(){true}}
    this.signInStub = sinon.stub(HaikuApp.Views, "SignIn")
    this.poemNewStub = sinon.stub(HaikuApp.Views, "PoemNew");

    this.poemIndexStub = sinon.stub(HaikuApp.Views, "PoemIndex")
    this.router = new HaikuApp.Routers.Poems({ collection: this.poems });
    this.routeSpy = sinon.spy();

    try {
      Backbone.history.start({silent:true, pushState:true});
    } catch(e) {}
    this.router.navigate("elsewhere");
  });
  
  afterEach(function(){
    this.signInStub.restore();
    this.poemNewStub.restore();
    this.poemIndexStub.restore();
    this.router.navigate("");
  });

  describe('initialize',function(){
    it("should set collection property to collection passed in", function(){
      expect(this.router.collection).toEqual(this.poems)
    });
  });

  describe('index', function(){
    beforeEach(function(){
      this.router.rightBarView = null
      this.renderLeftBarStub = sinon.stub(this.router, "renderLeftBar")
      this.router.bind("route:index", this.routeSpy);
      this.router.navigate("", true);
    })

    afterEach(function(){
      this.renderLeftBarStub.restore();
    })

    it("fires the index route with a blank hash", function() {
      expect(this.routeSpy.calledOnce).toBeTruthy();
      expect(this.routeSpy.calledWithExactly()).toBeTruthy();  
    });

    describe("when an aboutView exists", function(){
      beforeEach(function(){
        this.router.rightBarView = null
        this.router.aboutView = new Backbone.View();
        this.removeAboutViewSpy = sinon.spy(this.router.aboutView, 'remove')
        this.router.navigate("elsewhere");
        this.router.navigate("", true);
      });

      afterEach(function(){
        this.removeAboutViewSpy.restore();
      });
      it('removes the aboutView', function(){
        expect(this.removeAboutViewSpy.calledOnce).toBeTruthy();
      });
      it('sets it to null', function(){
        expect(this.router.aboutView).toBeNull();
      });
    })

    describe("when a right bar view already exists", function(){
      beforeEach(function(){
        this.router.rightBarView = new Backbone.View()
        this.rightBarViewSpy = sinon.spy(this.router.rightBarView,'remove')
        this.router.navigate("elsewhere");
        this.router.navigate("", true);
      });

      afterEach(function(){
        this.rightBarViewSpy.restore();
      });

      it("removes previous right bar view", function(){
        expect(this.rightBarViewSpy.calledOnce).toBeTruthy();
      });
    });


    it ("makes new poem index view with collection", function(){
      expect(this.poemIndexStub.calledOnce).toBeTruthy();
      expect(this.poemIndexStub.calledWithExactly({ collection: this.poems })).toBeTruthy();
    });

    it("renders left-bar with new poem/sign in", function(){
      expect(this.renderLeftBarStub.calledOnce).toBeTruthy();
    });
  });


  describe('about', function(){
    beforeEach(function(){
      this.router.leftBarView = new Backbone.View()
      this.router.rightBarView = new Backbone.View()
      this.removeLeftBarViewStub = sinon.spy(this.router.leftBarView,'remove')
      this.removeRightBarViewStub = sinon.spy(this.router.rightBarView, 'remove')
      this.aboutStub = sinon.stub(HaikuApp.Views, "About")
      this.router.bind("route:about", this.routeSpy);
      this.router.navigate("elsewhere");
      this.router.navigate("about", true);
    });
    
    afterEach(function(){
      this.aboutStub.restore();
      this.removeLeftBarViewStub.restore();
      this.removeRightBarViewStub.restore();
    });


    it("fires the about route with an about hash", function() {
      expect(this.routeSpy.calledOnce).toBeTruthy();
      expect(this.routeSpy.calledWithExactly()).toBeTruthy();  
    });

    it("makes about view", function(){
      expect(this.aboutStub.calledOnce).toBeTruthy();
    });

    it ('removes leftBarView', function(){
      expect(this.removeLeftBarViewStub.calledOnce).toBeTruthy();
    });

    it ('sets leftBarView to null', function(){
      expect(this.router.leftBarView).toBeNull()
    });

    it ('removes rightBarView', function(){
      expect(this.removeRightBarViewStub.calledOnce).toBeTruthy();
    });
  });

  describe('myPoetry', function(){
    beforeEach(function(){
      this.currentUserPoemsStub = sinon.stub(HaikuApp.currentUser, 'poems', function(){
        return 'filtered array'
      });
      this.myPoemsStub = sinon.stub(HaikuApp.Views,'FilteredPoemIndex')

      this.renderLeftBarStub = sinon.stub(this.router, "renderLeftBar")
      this.router.bind("route:myPoetry", this.routeSpy);
      this.router.navigate("elsewhere");
      this.router.navigate("myPoetry", true);
    });

    afterEach(function(){
      this.currentUserPoemsStub.restore();
      this.renderLeftBarStub.restore();
      this.myPoemsStub.restore();
    })

    it("fires the myPoetry route with a myPoetry hash", function() {
      expect(this.routeSpy.calledOnce).toBeTruthy();
      expect(this.routeSpy.calledWithExactly()).toBeTruthy();  
    });

    describe("when an aboutView exists", function(){
      beforeEach(function(){
        this.router.rightBarView = null
        this.router.aboutView = new Backbone.View();
        this.removeAboutViewSpy = sinon.spy(this.router.aboutView, 'remove')
        this.router.navigate("elsewhere");
        this.router.navigate("myPoetry", true);
      });

      afterEach(function(){
        this.removeAboutViewSpy.restore();
      });
      it('removes the aboutView', function(){
        expect(this.removeAboutViewSpy.calledOnce).toBeTruthy();
      });
      it('sets it to null', function(){
        expect(this.router.aboutView).toBeNull();
      });
    })
    
    describe("when a right bar view already exists", function(){
      beforeEach(function(){
        this.router.rightBarView = new Backbone.View()
        this.rightBarViewSpy = sinon.spy(this.router.rightBarView,'remove')
        this.router.navigate("elsewhere");
        this.router.navigate("myPoetry", true);
      });

      afterEach(function(){
        this.rightBarViewSpy.restore();
      });

      it("removes previous right bar view", function(){
        expect(this.rightBarViewSpy.calledOnce).toBeTruthy();
      });
    });
    describe("when there is a current user", function(){
      it("filters all poems to get current user's poems", function(){
        expect(this.currentUserPoemsStub.calledOnce).toBeTruthy();
        expect(this.currentUserPoemsStub.calledWithExactly(this.poems)).toBeTruthy();
      });    

      it("makes poem index view with all poems and filtered", function(){
        expect(this.myPoemsStub.calledOnce).toBeTruthy();
        expect(this.myPoemsStub.calledWithExactly({collection: this.poems, filtered: 'filtered array'})).toBeTruthy();
      });
    });

    it("renders left-bar with new poem/sign in", function(){
      expect(this.renderLeftBarStub.calledOnce).toBeTruthy();
    });
  });

  describe('renderLeftBar', function(){
    beforeEach(function(){
      this.router.leftBarView = {setup: function(){return true}, remove: function(){return true} }
      this.leftBarViewSetupSpy = sinon.spy(this.router.leftBarView, 'setup')
      this.leftBarViewRemoveSpy = sinon.spy(this.router.leftBarView, 'remove')
    })
    
    afterEach(function(){
      this.leftBarViewSetupSpy.restore();
      this.leftBarViewRemoveSpy.restore();
    });
    
    describe('when there is a user for the router', function(){
      beforeEach(function(){
        this.poemNewStub.returns(this.router.leftBarView);
      });

      describe('and when the current leftBarView is a PoemNew view', function(){
        beforeEach(function(){
          this.poemNewStub.restore();
          this.router.leftBarView = new HaikuApp.Views.PoemNew({collection: this.poems, user: this.currentUser})
          this.router.renderLeftBar();
        })

        it('does not remove the left bar view', function(){
          expect(this.leftBarViewRemoveSpy.calledOnce).toBeFalsy();
        }); 

        it('does not create a new PoemNew view with collection', function(){
          expect(this.poemNewStub.calledOnce).toBeFalsy();
        });

        it('does not call setup on the LeftBarView', function(){
          expect(this.leftBarViewSetupSpy.calledOnce).toBeFalsy();
        });
      });

      describe('and when the current leftBarView is not a PoemNew view', function(){    
        beforeEach(function(){
          this.router.renderLeftBar();
        });

        describe('when a current leftBarView exists', function(){
          it('removes the left bar view', function(){
            expect(this.leftBarViewRemoveSpy.calledOnce).toBeTruthy();
          }); 
        });

        it('creates a new PoemNew view with collection', function(){
          expect(this.poemNewStub.calledOnce).toBeTruthy();
          expect(this.poemNewStub.calledWith({ collection: this.poems })).toBeTruthy();
        });

        it('calls setup on the new LeftBarView', function(){
          expect(this.leftBarViewSetupSpy.calledOnce).toBeTruthy();
        });

      });

      it('does not create new sign in view', function(){
        this.router.renderLeftBar()
        expect(this.signInStub.calledOnce).toBeFalsy();
      });
    })

    describe('when there is no user for the router', function(){
      beforeEach(function(){
        HaikuApp.currentUser = null
        this.signInStub.returns(this.router.leftBarView);
      });
      
      describe('and when the current leftBarView is SignIn view', function(){
        beforeEach(function(){
          this.signInStub.restore();
          this.router.leftBarView = new HaikuApp.Views.SignIn()
          this.router.renderLeftBar()
        });

        it('does not remove the left bar view', function(){
          expect(this.leftBarViewRemoveSpy.calledOnce).toBeFalsy();
        }); 

        it('does not create a new SignIn view with collection', function(){
          expect(this.signInStub.calledOnce).toBeFalsy();
        });

        it('does not call setup on the LeftBarView', function(){
          expect(this.leftBarViewSetupSpy.calledOnce).toBeFalsy();
        });
      });

      describe('and when the current leftBarView is not SignIn view', function(){
        beforeEach(function(){
          this.router.renderLeftBar();
        });

        describe('when a current leftBarView exists', function(){
          it('removes the left bar view', function(){
            expect(this.leftBarViewRemoveSpy.calledOnce).toBeTruthy();
          }); 
        });
        
        it('creates a new sign in view', function(){
          expect(this.signInStub.calledOnce).toBeTruthy();
          expect(this.signInStub.calledWithExactly()).toBeTruthy();
        });

        it('calls setup on the new LeftBarView', function(){
          expect(this.leftBarViewSetupSpy.calledOnce).toBeTruthy();
        });
      });

        it('does not create new PoemNew view', function(){
          this.router.renderLeftBar()
          expect(this.poemNewStub.calledOnce).toBeFalsy();
        });
    });
  });
});