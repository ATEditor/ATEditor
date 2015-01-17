ATEditor.plugins['underline'] = function()
{
	ATEditor.addbutton('underline', 'Underline', function()
	{
		return ATEditor.mode == 'wysiwyg';
	}, function()
	{
		if(ATEditor.mode == 'source')
		{
			ATEditor.source.insertTag('<u>','</u>');
		}
		else
		{
			ATEditor.execCommand('underline');
		}
		return false;
	}, function()
	{
		ATEditor.execCommand('underline');
		return false;
	}, function() {
		r = false;
		ATEditor.$wysiwyg.find('u').each(function(){
			r = r || (true && $(this).selection());
			if(r == true)
				return false;
		});
		return r;
	});
	
	ATEditor.addKey('ctrl+u', function()
	{
		ATEditor.runHook('events.run.underline');
		return false;
	});
};