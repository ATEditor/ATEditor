ATEditorUndo = (function(){
	var editor;
	var undoes = [];
	var now = 0;
	var debug = false;
	function can_do(type)
	{
		this.debug && console.log('ATEditorUndo.can_do', type);
		if(type == 'undo')
		{
			return this.now > 0;
		}
		else
		{
			return this.now < this.undoes.length-1;
		}
	}
	
	function run(type)
	{
		this.debug && console.log('ATEditorUndo.run', type);
		if(this.can_do(type))
		{
			if(type == 'undo')
			{
				this.now--;
				this.setValue();
			}
			else
			{
				this.now++;
				this.setValue();
			}
			this.editor.check_btns();
		}
	}
	
	function setValue()
	{
		this.debug && console.log('ATEditorUndo.setValue');
		this.editor.setHtml(this.undoes[this.now].val);
		this.editor.setSelection(this.undoes[this.now].sel.start, this.undoes[this.now].sel.width)
	}
	
	function add()
	{
		this.debug && console.log('ATEditorUndo.add');
		if(typeof this.undoes[this.now] != 'object' || this.undoes[this.now].val != this.editor.getHtml())
		{
			var n = this.undoes.length;
			for(var i = this.now+1; i < n;i++)
			{
				this.undoes.pop();
			}
			this.undoes.push({
				'val': this.editor.getHtml(),
				'sel': this.editor.getSelection()
			});
			this.now++;
		}
	}
	
	function ATEditorUndo(editor, timeout)
	{
		this.editor = editor;
		this.add();
		this.editor.check_btns();
		setInterval($.proxy(function(){
			this.add();
		}, this), timeout);
	}
	
	ATEditorUndo.prototype = {
		editor: editor,
		undoes: undoes,
		now: now,
		can_do: can_do,
		run: run,
		setValue: setValue,
		add: add,
		debug: debug
	};
	
	return ATEditorUndo;
	
})();

ATEditor.plugins['undo'] = function()
{
	ATEditor.undo = new ATEditorUndo(ATEditor, 2000);
	ATEditor.addbutton('undo', 'Undo | Ctrl+Z', {
		extraclass: 'fa fa-undo',
		trigger: function()
		{
			return false;
		},
		active: function()
		{
			ATEditor.undo.run('undo');
			return false;
		},
		isenabled: function() {
			return ATEditor.undo.can_do('undo');
		}
	});
	
	ATEditor.addKey('ctrl+z', function()
	{
		ATEditor.runHook('events.run.undo');
		return false;
	});



	ATEditor.addbutton('redo', 'Redo | Ctrl+Y', {
		extraclass: 'fa fa-repeat',
		trigger: function()
		{
			return false;
		},
		active: function()
		{
			ATEditor.undo.run('redo');
			return false;
		},
		isenabled: function() {
			return ATEditor.undo.can_do('redo');
		}
	});
	
	ATEditor.addKey('ctrl+y', function()
	{
		ATEditor.runHook('events.run.redo');
		return false;
	});
};