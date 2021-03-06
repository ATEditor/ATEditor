ATEditor.plugins['source'] = function()
{
	ATEditor.source = {
		insertTag: function(start, end)
		{
			var sel = ATEditor.getSelection();
			var val = ATEditor.$source.val();
			ATEditor.$source.val(val.substr(0, sel.start)+start+val.substr(sel.start, sel.width)+end+val.substr(sel.end));
			ATEditor.setSelection(sel.start+end.length-1, sel.width);
		}
	};
	ATEditor.addbutton('source', 'Source Mode', {
		extraclass: 'fa fa-code',
		trigger: true,
		active: function()
		{
			ATEditor.cleanup();
			ATEditor.$source = $('<textarea />');
			ATEditor.$source.val(ATEditor.$wysiwyg.hide().html());
			ATEditor.$source.addClass('ate_source');
			ATEditor.$wysiwyg.after(ATEditor.$source);
			ATEditor.$source.focus();
			ATEditor.$source.bind('keydown', ATEditor.keymapcheck);
			ATEditor.$source.bind('keydown keypress keyup mousedown mouseup focus', ATEditor.check_btns);
			ATEditor.mode = 'source';
			ATEditor.check_btns();
			ATEditor.buttons['source'].btn.removeClass('ate_active');
			return false;
		},
		deactive: function()
		{
			$div = $('<div />');
			$div.html(ATEditor.$source.val());
			ATEditor.cleanup($div);
			ATEditor.$wysiwyg.html($div.html()).show();
			ATEditor.$source.remove();
			ATEditor.$wysiwyg.focus();
			ATEditor.mode = 'wysiwyg';
			ATEditor.check_btns();
			ATEditor.buttons['source'].btn.addClass('ate_active');
			return false;
		},
		isactive: function() {
			return ATEditor.mode == 'source';
		}
	});
	

};