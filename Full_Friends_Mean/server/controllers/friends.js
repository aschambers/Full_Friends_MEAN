var mongoose = require('mongoose');
var Friend = mongoose.model('Friend');

module.exports = (function() {
  return {
    show: function(req, res) {
      Friend.find({}, function(err, results){
        if(err) {
          console.log(err);
        } else {
          res.json(results);
        }
      });
    },

    post: function(req, res) {
      console.log("im in my controllers");
      Friend.create(req.body, function(err, results){
        if(err) {
          console.log(err);
        } else {
          res.json(results);
        }
      });
    },

    delete: function(req, res){
      Friend.remove({_id: req.params.id}, function (err, results){
      console.log(results);
      });
    }

  };
})();