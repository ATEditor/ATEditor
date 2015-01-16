ATEditor.plugins['bold'] = function()
{
	ATEditor.addbutton('bold', 'Bold', true, function()
	{
		ATEditor.insertTag('<strong>', '</strong>', true, function(html) {
			$html = $('<span />');
			$html.append(html);
			$html.find('strong').each(function(){
				$(this)[0].outerHTML = $(this).html();
			});
			return $html.html();
		});
		return false;
	}, function()
	{
		ATEditor.insertTag('</strong>', '<strong>', true, function(html) {
			$html = $('<span />');
			$html.append(html);
			$html.find('strong, b').each(function(){
				$(this)[0].outerHTML = $(this).html();
			});
			return $html.html();
		});
		return false;
	}, function() {
		r = false;
		$('.ate_body').find('b, strong').each(function(){
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