ATEditor.plugins['underline'] = function()
{
	ATEditor.addbutton('underline', 'Underline | Ctrl+U', {
		extraclass: 'fa fa-underline',
		trigger: function()
		{
			return ATEditor.mode == 'wysiwyg';
		},
		active: function()
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
		},
		deactive: function()
		{
			ATEditor.execCommand('underline');
			return false;
		},
		isactive: function() {
			r = false;
			ATEditor.$wysiwyg.find('u').each(function(){
				r = r || (true && $(this).selection());
				if(r == true)
					return false;
			});
			return r;
		}
	});
	
	ATEditor.addKey('ctrl+u', function()
	{
		ATEditor.runHook('events.run.underline');
		return false;
	});
};