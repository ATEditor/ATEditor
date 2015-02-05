ATEditor.plugins['miximize'] = function()
{
	ATEditor.addbutton('maximize', 'Maximize', {
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
};