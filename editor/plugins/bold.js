ATEditor.plugins['bold'] = function()
{
	ATEditor.addbutton('bold', 'Bold', {
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
			if(ATEditor.mode == 'source')
				return false;
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
	
	/*
	ATEditor.addHook('cleanup.do', function(args)
	{
		elm = args.elm;
		$elm = $(elm);
		if(elm.tagName.toLowerCase() == 'b')
		{
			elm.tagName = 'STRONG';
		}
	});*/
};