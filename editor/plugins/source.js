ATEditor.plugins['source'] = function()
{
	ATEditor.addbutton('source', 'Source Mode', true, function()
	{
		ATEditor.cleanup();
		ATEditor.$source = $('<textarea />');
		ATEditor.$source.val($('.ate_body').hide().html());
		ATEditor.$source.addClass('ate_source');
		$('.ate_body').after(ATEditor.$source);
		ATEditor.$source.focus();
		ATEditor.mode = 'source';
		return false;
	}, function()
	{
		$div = $('<div />');
		$div.html(ATEditor.$source.val());
		ATEditor.cleanup($div);
		$('.ate_body').html($div.html()).show();
		ATEditor.$source.remove();
		ATEditor.mode = 'wysiwyg';
		return false;
	}, function() {
		return ATEditor.mode == 'source';
	});
	

};