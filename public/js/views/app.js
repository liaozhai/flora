(function () {
  var template = '{{view "editor"}}';
  Thorax.Views['app'] = Thorax.View.extend({
    name: 'app',
    template: Handlebars.compile(template)
  });
}());
