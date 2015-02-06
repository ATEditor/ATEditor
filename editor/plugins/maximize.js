ATEditor.plugins['maximize'] = function()
{
	ATEditor.addbutton('maximize', 'Maximize | Ctrl + F11', {
		extraclass: 'fa fa-arrows-alt',
		trigger: true,
		active: function()
		{
			ATEditor.$editor.addClass('ate_maximize');
			return false;
		},
		deactive: function()
		{
			ATEditor.$editor.removeClass('ate_maximize');
			return false;
		},
		isactive: function() {
			return ATEditor.$editor.hasClass('ate_maximize');
		}
	});

	ATEditor.addKey('ctrl+f11', function()
	{
		ATEditor.runHook('events.run.maximize');
		return false;
	});
};