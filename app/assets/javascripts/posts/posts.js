angular.module('g-list')
.factory('posts', ['$http', function($http){
  var factory = {
    posts: []
  };

  factory.getAll = function() {
    return $http.get('/posts.json').then(function(res) {
      angular.copy(res.data, factory.posts);
    });
  };

  factory.create = function(post) {
    return $http.post('/posts.json', post).then(function(data) {
      factory.posts.push(data.data);
    });
  };

  factory.upvote = function(post) {
    return $http.put('/posts/' +  post.id + '/upvote.json')
      .then(function(data) {
        post.upvotes += 1;
      });
  };

  factory.get = function(id) {
    return $http.get('/posts/' + id + '.json').then(function(res){
      return res.data;
    });
  };

  factory.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments.json', comment);
  };

  factory.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post.id + '/comments/'+ comment.id + '/upvote.json')
      .then(function(data){
        comment.upvotes += 1;
      });
  };

  return factory;
}]);
