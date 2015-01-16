ATEditor.plugins['bold'] = function()
{
	ATEditor.addbutton('bold', 'Bold', true, function()
	{
		ATEditor.execCommand('bold');
		return false;
	}, function()
	{
		ATEditor.execCommand('bold');
		return false;
	}, function() {
		r = false;
		ATEditor.$wysiwyg.find('b, strong').each(function(){
			r = r || (true && $(this).selection());
			if(r == true)
				return false;
		});
		return r;
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