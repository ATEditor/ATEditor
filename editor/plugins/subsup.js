ATEditor.plugins['subsup'] = function()
{
	ATEditor.addbutton('subscript', 'Subscript', {
		extraclass: 'fa fa-subscript',
		trigger: function()
		{
			return ATEditor.mode == 'wysiwyg';
		},
		active: function()
		{
			if(ATEditor.mode == 'source')
			{
				ATEditor.source.insertTag('<sub>','</sub>');
			}
			else
			{
				ATEditor.execCommand('subscript');
			}
			return false;
		},
		deactive: function()
		{
			ATEditor.execCommand('subscript');
			return false;
		},
		isactive: function() {
			if(ATEditor.mode == 'source')
				return false;
			r = false;
			ATEditor.$wysiwyg.find('sub').each(function(){
				r = r || (true && $(this).selection());
				if(r == true)
					return false;
			});
			return r;
		}
	});

	ATEditor.addbutton('superscript', 'Superscript', {
		extraclass: 'fa fa-superscript',
		trigger: function()
		{
			return ATEditor.mode == 'wysiwyg';
		},
		active: function()
		{
			if(ATEditor.mode == 'source')
			{
				ATEditor.source.insertTag('<sup>','</sup>');
			}
			else
			{
				ATEditor.execCommand('superscript');
			}
			return false;
		},
		deactive: function()
		{
			ATEditor.execCommand('superscript');
			return false;
		},
		isactive: function() {
			if(ATEditor.mode == 'source')
				return false;
			r = false;
			ATEditor.$wysiwyg.find('sup').each(function(){
				r = r || (true && $(this).selection());
				if(r == true)
					return false;
			});
			return r;
		}
	});
};