ATEditor.plugins['italic'] = function()
{
	ATEditor.addbutton('italic', 'Italic', true, function()
	{
		ATEditor.insertTag('<em>', '</em>', true, function(html) {
			$html = $('<span />');
			$html.append(html);
			$html.find('em').each(function(){
				$(this)[0].outerHTML = $(this).html();
			});
			return $html.html();
		});
		return false;
	}, function()
	{
		ATEditor.insertTag('</em>', '<em>', true, function(html) {
			$html = $('<span />');
			$html.append(html);
			$html.find('em, i').each(function(){
				$(this)[0].outerHTML = $(this).html();
			});
			return $html.html();
		});
		return false;
	}, function() {
		r = false;
		$('.ate_body').find('em, i').each(function(){
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