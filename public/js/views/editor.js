(function () {
  var template ='<form style="visibility:visible;height:0px"><input type="file" name="text" style="opacity:0" /></form>\
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
        if(this.$el.find('input[type="file"]').val()) {
          var xhr = new XMLHttpRequest();
          xhr.open('POST', '/annotate');
          xhr.onload = _.bind(function () {
              if (xhr.status === 200) {
                this.$el.find('input[type="file"]').val('');
                var res = JSON.parse(xhr.responseText);
                var panel = this.$el.find('div');
                panel.html(render_response(res));
                panel.find('span').click(function (event) {
                  xhr.open('POST', '/words/find');
                  xhr.onload = _.bind(function () {
                    if (xhr.status === 200) {
                      var res = JSON.parse(xhr.responseText);
                    }
                    else {
                      console.log(xhr.responseText);
                    }
                  });
                  xhr.send({text: $(event.target).text()});
                });
              }
              else{
                console.log(xhr.responseText);
              }
          }, this);
          xhr.send(fd);
        }
      }
    },
    upload: function (event) {
      this.$el.find('input[type="file"]').click();
    }
  });
}());
