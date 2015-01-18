ATEditor.plugins['italic'] = function()
{
	ATEditor.addbutton('italic', 'Italic', {
		trigger: function()
		{
			return ATEditor.mode == 'wysiwyg';
		},
		active: function()
		{
			if(ATEditor.mode == 'source')
			{
				ATEditor.source.insertTag('<i>','</i>');
			}
			else
			{
				ATEditor.execCommand('italic');
			}
			return false;
		},
		deactive: function()
		{
			ATEditor.execCommand('italic');
			return false;
		},
		isactive: function() {
			r = false;
			ATEditor.$wysiwyg.find('em, i').each(function(){
				r = r || (true && $(this).selection());
				if(r == true)
					return false;
			});
			return r;
		}
	});
	
	ATEditor.addKey('ctrl+i', function()
	{
		ATEditor.runHook('events.run.italic');
		return false;
	});
};