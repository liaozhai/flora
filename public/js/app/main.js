$(document).ready(function(){
  new AppRouter();
  var AppView = Thorax.Views['app'];
  new AppView().appendTo('body');
  Backbone.history.start();
});
