/*
 * In the name of GOD
 *
 *
 * ATEditor
 * By: AliReza_Tofighi
 * Version: 0.0001 Alfa
 */

var ATEditor = {
	id: null,
	textarea: null,
	$editor: null,
	$wysiwyg: null,
	$source: null,
	nullChar: '&#8203',
	plugins: {},
	activeplugins: 'source bold italic underline strike subsup removeformat miximize',
	mode: 'wysiwyg',

	run: function(id)
	{
		ATEditor.id = id;
		ATEditor.textarea = $('#'+id);
		if(ATEditor.textarea)
		{
			ATEditor.textarea.after('<div id="ATEditor"><div class="ate_head"></div><div class="ate_body" contenteditable></div><div class="ate_foot"></div>');
			ATEditor.$editor = $('#ATEditor');
			ATEditor.$wysiwyg = ATEditor.$editor.find('.ate_body');
			ATEditor.textarea.addClass('ate_hidden_important');

			ATEditor.runplugins();
			
			ATEditor.$wysiwyg.bind('keydown keypress keyup mousedown mouseup focus', ATEditor.check_btns);
			ATEditor.$wysiwyg.bind('keydown', ATEditor.keymapcheck);
		}
		else
		{
			console.log("ATEditor-Error: Can't find the textarea");
		}
	},

	check: function()
	{
		return (ATEditor.id && ATEditor.textarea);
	},

	getSelection: function()
	{
		if(ATEditor.mode == 'wysiwyg')
		{
			if(!ATEditor.$wysiwyg.selection())
			{
				l = ATEditor.$wysiwyg.text().length;
				if(l == 0)
				{
					ATEditor.$wysiwyg.focus();
				}
				else
				{
					ATEditor.$wysiwyg.append('&#8203;');
					ATEditor.$wysiwyg.selection(l, l+1);
				}
				
			}
			return ATEditor.$wysiwyg.selection();
		}
		else
		{
			return ATEditor.$source.selection();
		}
	},

	getSelectionHtml: function(dontempty) {
		var selection = ATEditor.getSelection();
		if(ATEditor.mode == 'source')
		{
			return ATEditor.$source.val().substr(selection.start, selection.width);
		}
		var html = "";
		if (typeof window.getSelection != "undefined") {
			var sel = window.getSelection();
			if (sel.rangeCount) {
				var container = document.createElement("div");
				for (var i = 0, len = sel.rangeCount; i < len; ++i) {
					container.appendChild(sel.getRangeAt(i).cloneContents());
				}
				html = container.innerHTML;
			}
		} else if (typeof document.selection != "undefined") {
			if (document.selection.type == "Text") {
				html = document.selection.createRange().htmlText;
			}
		}
		if(html == "" && dontempty)
			html = '&#8203;';
		return html;
	},
	
	setSelection: function(start, length)
	{
		// http://jsfiddle.net/WeWy7/3/
		if(ATEditor.mode == 'source')
		{
			return ATEditor.$source.selection(start, start+length);
		}
		containerEl = ATEditor.$wysiwyg[0];
		savedSel = {
			start: start,
			end: start+length
		}
		if (window.getSelection && document.createRange)
		{
			var charIndex = 0, range = document.createRange();
			range.setStart(containerEl, 0);
			range.collapse(true);
			var nodeStack = [containerEl], node, foundStart = false, stop = false;
			
			while (!stop && (node = nodeStack.pop())) {
				if (node.nodeType == 3) {
					var nextCharIndex = charIndex + node.length;
					if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
						range.setStart(node, savedSel.start - charIndex);
						foundStart = true;
					}
					if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
						range.setEnd(node, savedSel.end - charIndex);
						stop = true;
					}
					charIndex = nextCharIndex;
				} else {
					var i = node.childNodes.length;
					while (i--) {
						nodeStack.push(node.childNodes[i]);
					}
				}
			}

			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
		else if (document.selection && document.body.createTextRange)
		{
			var textRange = document.body.createTextRange();
			textRange.moveToElementText(containerEl);
			textRange.collapse(true);
			textRange.moveEnd("character", savedSel.end);
			textRange.moveStart("character", savedSel.start);
			textRange.select();
		}
	},
	
	getHtml: function()
	{
		if(ATEditor.mode == 'source')
			return ATEditor.$source.val();
		return ATEditor.$wysiwyg.html();
	},
	
	getText: function()
	{
		if(ATEditor.mode == 'source')
		{
			var $elm = $('<div />');
			$elm.html(ATEditor.$source.val());
			return $elm.text();
		}
		return ATEditor.$wysiwyg.text();
	},
	
	getHtmlRange: function(start, length)
	{
		var selection = ATEditor.getSelection();
		ATEditor.setSelection(start, length);
		var html = ATEditor.getSelectionHtml();
		ATEditor.setSelection(selection.start, selection.width);
		return html;
	},
	

	buttons: {},

	addbutton: function(name, title, opts)
	{
		opts = $.extend({
			trigger: false,
			active: function(){},
			deactive: function(){},
			isactive: function(){ return false;},
			isenabled: function(){ return true;},
			extraclass: '',
			tooltip: true,
		}, opts);
		ATEditor.runHook('addbutton.start', {name:name,title:title,opts:opts});
		var $btn = $('<div />');
		$btn.attr('id', 'ate_btn_'+name);
		$btn.addClass('ate_btn');
		$btn.addClass(opts.extraclass);

		if(opts.tooltip)
		{
			var $tooltip = $('<div />');
			$tooltip.addClass('ate_tooltip');
			$tooltip.text(title);
			$btn.append($tooltip);
		}
		else
		{
			$btn.attr('title', title);
		}
		
		var click = function()
		{
			ATEditor.runHook('button.click');
			ccc = opts.trigger;
			if(typeof opts.trigger == 'function')
				ccc = opts.trigger();
			if(ccc && opts.isactive())
				opts.deactive();
			else
				opts.active();
			if(ccc)
			{
				$btn.toggleClass('ate_active');
			}
			return false;
		};

		$btn.mousedown(click);
		
		ATEditor.addHook('events.run.'+name, click);

		$('.ate_head').append($btn);
		if(opts.tooltip)
		{
			$tooltip.css('bottom', (-1*($tooltip.outerHeight()))+'px');
			$tooltip.css('left', (($btn.outerWidth()-$tooltip.outerWidth())/2)+'px');
			$tooltip.css('right', (($btn.outerWidth()-$tooltip.outerWidth())/2)+'px');
			$tooltip.hide();
			$btn.hover(function(){
				$tooltip.show();
			}, function() {
				$tooltip.hide();
			});
			$tooltip.hover(function(){$(this).hide();});
		}
		
		if(typeof ATEditor['btn_'+name] == 'function')
		{
			ATEditor['btn_'+name]();
		}

		ATEditor.buttons[name] = {
			'name': name,
			'title': title,
			'click': click,
			'isactive': opts.isactive,
			'isenabled': opts.isenabled,
			'btn': $btn
		}

		ATEditor.runHook('addbutton.end', {name:name,title:title,opts:opts});
		return $btn;
	},

	runplugins: function()
	{
		plugins = ATEditor.activeplugins.split(' ');
		$.each(plugins, function(index, value){
			if(typeof ATEditor.plugins[value] == 'function')
			{
				ATEditor.plugins[value]();
			}
		});
	},
	check_btns: function()
	{
		$.each(ATEditor.buttons, function(key, value)
		{
			if(value.isactive())
			{
				value.btn.addClass('ate_active');
			}
			else
			{
				value.btn.removeClass('ate_active');
			}
			if(value.isenabled())
			{
				value.btn.removeClass('ate_disabled');
			}
			else
			{
				value.btn.addClass('ate_disabled');
			}
		})
	},

	insertTag: function(start, end, isempty, parser)
	{
		slc = ATEditor.getSelection();
		html = ATEditor.getSelectionHtml(isempty);
		if(typeof parser == 'function')
		{
			html = parser(html);
		}
		document.execCommand('insertHTML', false, start+html+end);
	},

	execCommand: function(commad, value)
	{
		if(!value)
			value = null;
		slc = ATEditor.getSelection();
		document.execCommand(commad, false, value);
	},
	
	hooks:{},
	
	addHook: function(hook, func)
	{
		if(typeof ATEditor.hooks[hook] == 'undefined')
		{
			ATEditor.hooks[hook] = [];
		}
		ATEditor.hooks[hook].push(func);
	},
	
	runHook: function(hook, args)
	{
		if(!args)
			args = {};
		if(typeof ATEditor.hooks[hook] == 'undefined')
		{
			ATEditor.hooks[hook] = [];
		}

		var n = ATEditor.hooks[hook].length;
		for(var i = 0; i < n;i++)
		{
			if(typeof ATEditor.hooks[hook][i] == 'function')
				ATEditor.hooks[hook][i](args);
		}
	},
	
	
	
	cleanup: function($elm)
	{
		if(!$elm)
			$elm = ATEditor.$wysiwyg;
		ATEditor.runHook('cleanup.start', {'elm': $elm});
		$elm.find('*').each(function(){
			ATEditor.runHook('cleanup.do', {'elm': this});
			if($(this)[0].tagName.toLowerCase() == 'script')
			{
				$(this).remove();
			}
		});
		ATEditor.runHook('cleanup.end', {'elm': $elm});
	},

	keys: [],

	keymapcheck: function(event)
	{
		var isCtrl = event.ctrlKey, isAlt = event.altKey, isShift = event.shiftKey;
		var charCode = (event.which) ? event.which : event.keyCode;
		var key = String.fromCharCode(charCode);

		// Copied from http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		if (charCode == 8) key = "backspace"; //  backspace
		if (charCode == 9) key = "tab"; //  tab
		if (charCode == 13) key = "enter"; //  enter
		if (charCode == 16) key = "shift"; //  shift
		if (charCode == 17) key = "ctrl"; //  ctrl
		if (charCode == 18) key = "alt"; //  alt
		if (charCode == 19) key = "pause/break"; //  pause/break
		if (charCode == 20) key = "caps lock"; //  caps lock
		if (charCode == 27) key = "escape"; //  escape
		if (charCode == 33) key = "page up"; // page up, to avoid displaying alternate character and confusing people	         
		if (charCode == 34) key = "page down"; // page down
		if (charCode == 35) key = "end"; // end
		if (charCode == 36) key = "home"; // home
		if (charCode == 37) key = "left arrow"; // left arrow
		if (charCode == 38) key = "up arrow"; // up arrow
		if (charCode == 39) key = "right arrow"; // right arrow
		if (charCode == 40) key = "down arrow"; // down arrow
		if (charCode == 45) key = "insert"; // insert
		if (charCode == 46) key = "delete"; // delete
		if (charCode == 91) key = "left-window"; // left window
		if (charCode == 92) key = "right-window"; // right window
		if (charCode == 93) key = "select-key"; // select key
		if (charCode == 96) key = "numpad-0"; // numpad 0
		if (charCode == 97) key = "numpad-1"; // numpad 1
		if (charCode == 98) key = "numpad-2"; // numpad 2
		if (charCode == 99) key = "numpad-3"; // numpad 3
		if (charCode == 100) key = "numpad-4"; // numpad 4
		if (charCode == 101) key = "numpad-5"; // numpad 5
		if (charCode == 102) key = "numpad-6"; // numpad 6
		if (charCode == 103) key = "numpad-7"; // numpad 7
		if (charCode == 104) key = "numpad-8"; // numpad 8
		if (charCode == 105) key = "numpad-9"; // numpad 9
		if (charCode == 106) key = "multiply"; // multiply
		if (charCode == 107) key = "add"; // add
		if (charCode == 109) key = "subtract"; // subtract
		if (charCode == 110) key = "decimal-point"; // decimal point
		if (charCode == 111) key = "divide"; // divide
		if (charCode == 112) key = "F1"; // F1
		if (charCode == 113) key = "F2"; // F2
		if (charCode == 114) key = "F3"; // F3
		if (charCode == 115) key = "F4"; // F4
		if (charCode == 116) key = "F5"; // F5
		if (charCode == 117) key = "F6"; // F6
		if (charCode == 118) key = "F7"; // F7
		if (charCode == 119) key = "F8"; // F8
		if (charCode == 120) key = "F9"; // F9
		if (charCode == 121) key = "F10"; // F10
		if (charCode == 122) key = "F11"; // F11
		if (charCode == 123) key = "F12"; // F12
		if (charCode == 144) key = "num-lock"; // num lock
		if (charCode == 145) key = "scroll-lock"; // scroll lock
		if (charCode == 186) key = ";"; // semi-colon
		if (charCode == 187) key = "="; // equal-sign
		if (charCode == 188) key = ","; // comma
		if (charCode == 189) key = "-"; // dash
		if (charCode == 190) key = "."; // period
		if (charCode == 191) key = "/"; // forward slash
		if (charCode == 192) key = "`"; // grave accent
		if (charCode == 219) key = "["; // open bracket
		if (charCode == 220) key = "\\"; // back slash
		if (charCode == 221) key = "]"; // close bracket
		if (charCode == 222) key = "'"; // single quote

		key = key.toLowerCase();
		var returnn = true;
		$.each(ATEditor.keys, function(i, me)
		{
			val = me.key.split('+');
			if(((val[0] == 'ctrl' && isCtrl) || (val[0] == 'alt' && isAlt) || (val[0] == 'shift' && isShift)) && val[1] == key)
			{
				if(!me.func())
				{
					returnn = false;
				}
			}
		});
		return returnn;
	 
	},
	
	addKey: function(key, func)
	{
		key = key.toLowerCase();
		ATEditor.keys.push({'key':key,'func':func});
	}
};