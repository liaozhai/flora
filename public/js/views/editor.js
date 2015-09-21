(function () {
  var template ='<form style="display:none"><input type="file" name="text" /></form>\
  {{#button "upload"}}Upload{{/button}}\
  <div></div>';

  function render_response(res) {
    var t = '{{#each lines}}\
      {{#each segments}}\
        <span data-pos="{{p}}">{{w}}</span>\
      {{/each}}<br/>\
    {{/each}}';
    var h = Handlebars.compile(t);
    return h(res);
  }
  Thorax.Views['editor'] = Thorax.View.extend({
    name: 'editor',
    template: Handlebars.compile(template),
    events: {
      'change input[type="file"]': function(event){
        var fd = new FormData(this.$el.find('form').get(0));
        if(fd.get('text')) {
          var xhr = new XMLHttpRequest();
          xhr.open('POST', '/annotate');
          xhr.onload = _.bind(function () {
              if (xhr.status === 200) {
                fd.delete('text');
                var res = JSON.parse(xhr.responseText);
                this.$el.find('div').html(render_response(res));
              }
              else{
                console.log(xhr.responseText);
              }
          }, this);
          xhr.send(fd);
        }
      }
    },
    upload: function (ev) {
      var fd = new FormData(this.$el.find('form').get(0));
      $(fd).find('input').click();
    }
  });
}());
