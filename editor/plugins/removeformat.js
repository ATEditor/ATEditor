ATEditor.plugins['removeformat'] = function()
{
	ATEditor.addbutton('removeformat', 'Remove Format', {
		extraclass: 'fa fa-eraser',
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
			ATEditor.$wysiwyg.html(ATEditor.getHtmlRange(0, selection.start)+$elm.text()+ATEditor.getHtmlRange(selection.end, ATEditor.getText().length-selection.end));
			ATEditor.check_btns();
			return false;
		}
	});
};