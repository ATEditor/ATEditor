ATEditor.plugins['strike'] = function()
{
	ATEditor.addbutton('strike', 'Strike', {
		extraclass: 'fa fa-strikethrough',
		trigger: function()
		{
			return ATEditor.mode == 'wysiwyg';
		},
		active: function()
		{
			if(ATEditor.mode == 'source')
			{
				ATEditor.source.insertTag('<strike>','</strike>');
			}
			else
			{
				ATEditor.execCommand('strikeThrough');
			}
			return false;
		},
		deactive: function()
		{
			ATEditor.execCommand('strikeThrough');
			return false;
		},
		isactive: function() {
			if(ATEditor.mode == 'source')
				return false;
			r = false;
			ATEditor.$wysiwyg.find('s, del, strike').each(function(){
				r = r || (true && $(this).selection());
				if(r == true)
					return false;
			});
			return r;
		}
	});
};