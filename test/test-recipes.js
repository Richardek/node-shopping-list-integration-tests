const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);


//starts server before we begin our test
describe('Recipes', function() {

    before(function() {
      return runServer();
    });
  
    after(function() {
      return closeServer();
    });


    //test for get request
    it('should list recipes on GET', function() {
        return chai.request(app)
          .get('/recipes')
          .then(function(res) {
    
            res.should.have.status(200);
            res.should.be.json;
            //need this explained
            res.body.should.be.a('array');
    
            res.body.should.have.length.of.at.least(1);
    
            // each item should be an object with key/value pairs
            // for `id`, `name` and `ingredients`.
            res.body.forEach(function(item) {
              item.should.be.a('object');
              item.should.include.keys('id', 'name', 'ingredients');
            });
          });
      });


    //test for post request
    it('should add a recipe on POST', function() {
        const newRecipe = {
            name: 'coffee', ingredients: ['ground coffee', 'hot water']};
        return chai.request(app)
          .post('/recipes')
          .send(newRecipe)
          .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'name', 'ingredients');
            res.body.name.should.equal(newRecipe.name);
            res.body.ingredients.should.be.a('array');
            //why is this here?
            res.body.ingredients.should.include.members(newRecipe.ingredients);
          });
        });


    //test for put/updating
    it('should update recipes on PUT', function() {

        const updateData = {
          name: 'foo',
          ingredients: ['bizz', 'bang']
        };
    
        return chai.request(app)
          .get('/recipes')
          .then(function(res) {
            //i understand but explain exactly whats going on here  
            updateData.id = res.body[0].id;
    
            return chai.request(app)
              .put(`/recipes/${updateData.id}`)
              .send(updateData)
          })
          .then(function(res) {
            res.should.have.status(204);
          });
      });  

    //test for deleteing recipes
    it('should delete recipes on DELETE', function() {
        return chai.request(app)
          .get('/recipes')
          .then(function(res) {
            return chai.request(app)
              .delete(`/recipes/${res.body[0].id}`)
          })
          .then(function(res) {
            res.should.have.status(204);
          });
      });
    });