ATEditor.plugins['bold'] = function()
{
	ATEditor.addbutton('bold', 'Bold | Ctrl+B', {
		extraclass: 'fa fa-bold',
		trigger: function()
		{
			return ATEditor.mode == 'wysiwyg';
		},
		active: function()
		{
			if(ATEditor.mode == 'source')
			{
				ATEditor.source.insertTag('<b>','</b>');
			}
			else
			{
				ATEditor.execCommand('bold');
			}
			return false;
		},
		deactive: function()
		{
			ATEditor.execCommand('bold');
			return false;
		},
		isactive: function() {
			r = false;
			ATEditor.$wysiwyg.find('b, strong').each(function(){
				r = r || (true && $(this).selection());
				if(r == true)
					return false;
			});
			return r;
		}
	});
	
	ATEditor.addKey('ctrl+b', function()
	{
		ATEditor.runHook('events.run.bold');
		return false;
	});
};