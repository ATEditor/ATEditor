ATEditor.plugins['removeformat'] = function()
{
	ATEditor.addbutton('removeformat', 'Remove Format', {
		extraclass: 'fa fa-eraser',
		isenabled: function()
		{
			return ATEditor.mode == 'wysiwyg';
		},
		trigger: function()
		{
			return false;
		},
		active: function()
		{
			if(ATEditor.mode == 'source')
			{
				return false;
			}
			selection = ATEditor.getSelection();
			html = ATEditor.getSelectionHtml();
			$elm = $('<div />');
			$elm.html(html);
			$elm.find('span, strong, bold, em, u, i, del, small, big, s, strike, sub, sup').each(function()
			{
				$(this)[0].outerHTML = $(this).html();
			});
			ATEditor.$wysiwyg.html(ATEditor.nullChar+ATEditor.$wysiwyg.html()+ATEditor.nullChar);
			ATEditor.$wysiwyg.html(ATEditor.getHtmlRange(1, selection.start)+$elm.html()+ATEditor.getHtmlRange(selection.end+1, ATEditor.getText().length-selection.end-1));
			ATEditor.check_btns();
			ATEditor.setSelection(selection.start, selection.width);
			return false;
		}
	});
};