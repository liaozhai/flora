var Flora = Flora || {};
Flora.Views = Flora.Views || {};

(function($){

	var template = Handlebars.compile(
		'<div>\
			<div class="main-view-items-dialog modal fade" tabindex="-1" role="dialog">\
				<div class="modal-dialog">\
					<div class="modal-content">\
						<div class="modal-header">\
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
							<h4 class="modal-title"></h4>\
						</div>\
						<div class="modal-body"></div>\
						<div class="modal-footer">\
							<button type="button" class="btn btn-primary">Save</button>\
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
						</div>\
					</div>\
				</div>\
			</div>\
			<form style="visibility:visible;height:0px"><input type="file" name="text" style="opacity:0"/></form>\
			<div>\
				<button type="button" class="main-view-upload btn btn-primary">{{upload}}</button>\
			</div>\
			<div class="main-view-text"></div>\
		</div>');

	var response_template = Handlebars.compile(
		'{{#each lines}}\
			{{#each segments}}\
				<span data-pos="{{p}}">{{w}}</span>\
			{{/each}}<br/>\
		{{/each}}');

	var items_template = Handlebars.compile(
		'<div>\
				<h4>{{p}}</h4>\
				{{#each x}}\
					<div>\
						<input type="text" value="{{this}}"/>\
					</div>\
				{{/each}}\
		</div>');

	var View = function(element){
		this.$container = $(template({
			upload: 'Open File'
		})).appendTo(element);

		this.$container.find('.main-view-upload').on('click',this.uploadClick.bind(this));
		this.$container.find('input[type="file"]').on('change',this.upload.bind(this));
		this.$container.find('.main-view-items-dialog').on('show.bs.modal', function(){
			var item = $(this).data('item');
			$(this).find('.modal-title').text(item.w);
			$(this).find('.modal-body').html(items_template(item));
		});
	};

	View.prototype = {
		showItem: function(item){
			var $dlg = this.$container.find('.main-view-items-dialog');
			$dlg.data({item: item});
			$dlg.modal('show');
		},
		uploadClick: function(){
			this.$container.find('input[type="file"]').click();
		},
		upload: function(){
			var fd = new FormData(this.$container.find('form').get(0));
			if(this.$container.find('input[type="file"]').val()) {
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/annotate');
				xhr.onload = function () {
						if (xhr.status === 200) {
							this.$container.find('input[type="file"]').val('');
							var res = JSON.parse(xhr.responseText);
							var panel = this.$container.find('.main-view-text');
							panel.html(response_template(res));
							panel.find('span').click(function (event) {
								$.post('words/find', {text: $(event.target).text()})
									.done(this.showItem.bind(this))
									.fail(console.log);
							}.bind(this));
						}
						else{
							console.log(xhr.responseText);
						}
				}.bind(this);
				xhr.send(fd);
			}
		}
	};

	View.prototype.constructor = View;

	Flora.Views.Main = View;

}(jQuery));
