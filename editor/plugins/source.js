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
	ATEditor.addbutton('source', 'Source Mode', true, function()
	{
		ATEditor.cleanup();
		ATEditor.$source = $('<textarea />');
		ATEditor.$source.val(ATEditor.$wysiwyg.hide().html());
		ATEditor.$source.addClass('ate_source');
		ATEditor.$wysiwyg.after(ATEditor.$source);
		ATEditor.$source.focus();
		ATEditor.$source.bind('keydown', ATEditor.keymapcheck);
		ATEditor.$source.bind('keydown keypress keyup mousedown mouseup focus', ATEditor.check_btns);
		ATEditor.check_btns();
		ATEditor.mode = 'source';
		return false;
	}, function()
	{
		$div = $('<div />');
		$div.html(ATEditor.$source.val());
		ATEditor.cleanup($div);
		ATEditor.$wysiwyg.html($div.html()).show();
		ATEditor.$source.remove();
		ATEditor.mode = 'wysiwyg';
		ATEditor.check_btns();
		return false;
	}, function() {
		return ATEditor.mode == 'source';
	});
	

};