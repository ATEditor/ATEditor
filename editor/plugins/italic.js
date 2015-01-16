ATEditor.plugins['italic'] = function()
{
	ATEditor.addbutton('italic', 'Italic', true, function()
	{
		ATEditor.execCommand('italic');
		return false;
	}, function()
	{
		ATEditor.execCommand('italic');
		return false;
	}, function() {
		r = false;
		ATEditor.$wysiwyg.find('em, i').each(function(){
			r = r || (true && $(this).selection());
			if(r == true)
				return false;
		});
		return r;
	});
	
	ATEditor.addKey('ctrl+i', function()
	{
		ATEditor.runHook('events.run.italic');
		return false;
	});
};