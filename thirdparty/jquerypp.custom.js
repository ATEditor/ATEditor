/*!
 * jQuery++ - 1.0.1
 * http://jquerypp.com
 * Copyright (c) 2014 Bitovi
 * Mon, 03 Nov 2014 04:05:41 GMT
 * Licensed MIT
 * Download from: http://bitbuilder.herokuapp.com/jquerypp.custom.js?plugins=jquerypp%2Fdom%2Fselection
 */
(function($) {

    // ## jquerypp/dom/compare/compare.js
    var __m4 = (function($) {

        // See http://ejohn.org/blog/comparing-document-position/
        $.fn.compare = function(element) { //usually
            try {
                // Firefox 3 throws an error with XUL - we can't use compare then
                element = element.jquery ? element[0] : element;
            } catch (e) {
                return null;
            }

            // make sure we aren't coming from XUL element
            if (window.HTMLElement) {
                var s = HTMLElement.prototype.toString.call(element)
                if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
                    return null;
                }
            }

            if (this[0].compareDocumentPosition) {
                // For browsers that support it, use compareDocumentPosition
                // https://developer.mozilla.org/en/DOM/Node.compareDocumentPosition
                return this[0].compareDocumentPosition(element);
            }

            // this[0] contains element
            if (this[0] == document && element != document) return 8;

            var number =
            // this[0] contains element
            (this[0] !== element && this[0].contains(element) && 16) +
            // element contains this[0]
            (this[0] != element && element.contains(this[0]) && 8),
                docEl = document.documentElement;

            // Use the sourceIndex
            if (this[0].sourceIndex) {
                // this[0] precedes element
                number += (this[0].sourceIndex < element.sourceIndex && 4)
                // element precedes foo[0]
                number += (this[0].sourceIndex > element.sourceIndex && 2)
                // The nodes are in different documents
                number += (this[0].ownerDocument !== element.ownerDocument ||
                    (this[0] != docEl && this[0].sourceIndex <= 0) ||
                    (element != docEl && element.sourceIndex <= 0)) && 1
            }

            return number;
        }

        return $;
    })($);

    // ## jquerypp/dom/range/range.js
    var __m3 = (function($) {


        $.fn.range = function() {
            return $.Range(this[0])
        }

        var convertType = function(type) {
            return type.replace(/([a-z])([a-z]+)/gi, function(all, first, next) {
                return first + next.toLowerCase()
            }).replace(/_/g, "");
        },
            // reverses things like START_TO_END into END_TO_START
            reverse = function(type) {
                return type.replace(/^([a-z]+)_TO_([a-z]+)/i, function(all, first, last) {
                    return last + "_TO_" + first;
                });
            },
            getWindow = function(element) {
                return element ? element.ownerDocument.defaultView || element.ownerDocument.parentWindow : window
            },
            bisect = function(el, start, end) {
                //split the start and end ... figure out who is touching ...
                if (end - start == 1) {
                    return
                }
            },
            support = {};

        $.Range = function(range) {
            // If it's called w/o new, call it with new!
            if (this.constructor !== $.Range) {
                return new $.Range(range);
            }
            // If we are passed a jQuery-wrapped element, get the raw element
            if (range && range.jquery) {
                range = range[0];
            }
            // If we have an element, or nothing
            if (!range || range.nodeType) {
                // create a range
                this.win = getWindow(range)
                if (this.win.document.createRange) {
                    this.range = this.win.document.createRange()
                } else if (this.win && this.win.document.body && this.win.document.body.createTextRange) {
                    this.range = this.win.document.body.createTextRange()
                }
                // if we have an element, make the range select it
                if (range) {
                    this.select(range)
                }
            }
            // if we are given a point
            else if (range.clientX != null || range.pageX != null || range.left != null) {
                this.moveToPoint(range);
            }
            // if we are given a touch event
            else if (range.originalEvent && range.originalEvent.touches && range.originalEvent.touches.length) {
                this.moveToPoint(range.originalEvent.touches[0])

            }
            // if we are a normal event
            else if (range.originalEvent && range.originalEvent.changedTouches && range.originalEvent.changedTouches.length) {
                this.moveToPoint(range.originalEvent.changedTouches[0])
            }
            // given a TextRange or something else?
            else {
                this.range = range;
            }
        };

        $.Range.

        current = function(el) {
            var win = getWindow(el),
                selection;
            if (win.getSelection) {
                // If we can get the selection
                selection = win.getSelection()
                return new $.Range(selection.rangeCount ? selection.getRangeAt(0) : win.document.createRange())
            } else {
                // Otherwise use document.selection
                return new $.Range(win.document.selection.createRange());
            }
        };

        $.extend($.Range.prototype,

            {

                moveToPoint: function(point) {
                    var clientX = point.clientX,
                        clientY = point.clientY
                    if (!clientX) {
                        var off = scrollOffset();
                        clientX = (point.pageX || point.left || 0) - off.left;
                        clientY = (point.pageY || point.top || 0) - off.top;
                    }
                    if (support.moveToPoint) {
                        this.range = $.Range().range
                        this.range.moveToPoint(clientX, clientY);
                        return this;
                    }

                    // it's some text node in this range ...
                    var parent = document.elementFromPoint(clientX, clientY);

                    //typically it will be 'on' text
                    for (var n = 0; n < parent.childNodes.length; n++) {
                        var node = parent.childNodes[n];
                        if (node.nodeType === 3 || node.nodeType === 4) {
                            var range = $.Range(node),
                                length = range.toString().length;

                            // now lets start moving the end until the boundingRect is within our range
                            for (var i = 1; i < length + 1; i++) {
                                var rect = range.end(i).rect();
                                if (rect.left <= clientX && rect.left + rect.width >= clientX &&
                                    rect.top <= clientY && rect.top + rect.height >= clientY) {
                                    range.start(i - 1);
                                    this.range = range.range;
                                    return this;
                                }
                            }
                        }
                    }

                    // if not 'on' text, recursively go through and find out when we shift to next
                    // 'line'
                    var previous;
                    iterate(parent.childNodes, function(textNode) {
                        var range = $.Range(textNode);
                        if (range.rect().top > point.clientY) {
                            return false;
                        } else {
                            previous = range;
                        }
                    });

                    if (previous) {
                        previous.start(previous.toString().length);
                        this.range = previous.range;
                    } else {
                        this.range = $.Range(parent).range
                    }
                },

                window: function() {
                    return this.win || window;
                },

                overlaps: function(elRange) {
                    if (elRange.nodeType) {
                        elRange = $.Range(elRange).select(elRange);
                    }
                    //if the start is within the element ...
                    var startToStart = this.compare("START_TO_START", elRange),
                        endToEnd = this.compare("END_TO_END", elRange)

                        // if we wrap elRange
                        if (startToStart <= 0 && endToEnd >= 0) {
                            return true;
                        }
                        // if our start is inside of it
                    if (startToStart >= 0 &&
                        this.compare("START_TO_END", elRange) <= 0) {
                        return true;
                    }
                    // if our end is inside of elRange
                    if (this.compare("END_TO_START", elRange) >= 0 &&
                        endToEnd <= 0) {
                        return true;
                    }
                    return false;
                },

                collapse: function(toStart) {
                    this.range.collapse(toStart === undefined ? true : toStart);
                    return this;
                },

                toString: function() {
                    return typeof this.range.text == "string" ? this.range.text : this.range.toString();
                },

                start: function(set) {
                    // return start
                    if (set === undefined) {
                        if (this.range.startContainer) {
                            return {
                                container: this.range.startContainer,
                                offset: this.range.startOffset
                            }
                        } else {
                            // Get the start parent element
                            var start = this.clone().collapse().parent();
                            // used to get the start element offset
                            var startRange = $.Range(start).select(start).collapse();
                            startRange.move("END_TO_START", this);
                            return {
                                container: start,
                                offset: startRange.toString().length
                            }
                        }
                    } else {
                        if (this.range.setStart) {
                            // supports setStart
                            if (typeof set == 'number') {
                                this.range.setStart(this.range.startContainer, set)
                            } else if (typeof set == 'string') {
                                var res = callMove(this.range.startContainer, this.range.startOffset, parseInt(set, 10))
                                this.range.setStart(res.node, res.offset);
                            } else {
                                this.range.setStart(set.container, set.offset)
                            }
                        } else {
                            if (typeof set == "string") {
                                this.range.moveStart('character', parseInt(set, 10))
                            } else {
                                // get the current end container
                                var container = this.start().container,
                                    offset
                                if (typeof set == "number") {
                                    offset = set
                                } else {
                                    container = set.container
                                    offset = set.offset
                                }
                                var newPoint = $.Range(container).collapse();
                                //move it over offset characters
                                newPoint.range.move(offset);
                                this.move("START_TO_START", newPoint);
                            }
                        }
                        return this;
                    }

                },

                end: function(set) {
                    // read end
                    if (set === undefined) {
                        if (this.range.startContainer) {
                            return {
                                container: this.range.endContainer,
                                offset: this.range.endOffset
                            }
                        } else {
                            var
                            // Get the end parent element
                            end = this.clone().collapse(false).parent(),
                                // used to get the end elements offset
                                endRange = $.Range(end).select(end).collapse();
                            endRange.move("END_TO_END", this);
                            return {
                                container: end,
                                offset: endRange.toString().length
                            }
                        }
                    } else {
                        if (this.range.setEnd) {
                            if (typeof set == 'number') {
                                this.range.setEnd(this.range.endContainer, set)
                            } else if (typeof set == 'string') {
                                var res = callMove(this.range.endContainer, this.range.endOffset, parseInt(set, 10))
                                this.range.setEnd(res.node, res.offset);
                            } else {
                                this.range.setEnd(set.container, set.offset)
                            }
                        } else {
                            if (typeof set == "string") {
                                this.range.moveEnd('character', parseInt(set, 10));
                            } else {
                                // get the current end container
                                var container = this.end().container,
                                    offset
                                if (typeof set == "number") {
                                    offset = set
                                } else {
                                    container = set.container
                                    offset = set.offset
                                }
                                var newPoint = $.Range(container).collapse();
                                //move it over offset characters
                                newPoint.range.move(offset);
                                this.move("END_TO_START", newPoint);
                            }
                        }
                        return this;
                    }
                },

                parent: function() {
                    if (this.range.commonAncestorContainer) {
                        return this.range.commonAncestorContainer;
                    } else {

                        var parentElement = this.range.parentElement(),
                            range = this.range;

                        // IE's parentElement will always give an element, we want text ranges
                        iterate(parentElement.childNodes, function(txtNode) {
                            if ($.Range(txtNode).range.inRange(range)) {
                                // swap out the parentElement
                                parentElement = txtNode;
                                return false;
                            }
                        });

                        return parentElement;
                    }
                },

                rect: function(from) {
                    var rect = this.range.getBoundingClientRect();
                    // for some reason in webkit this gets a better value
                    if (!rect.height && !rect.width) {
                        rect = this.range.getClientRects()[0]
                    }
                    if (from === 'page') {
                        // Add the scroll offset
                        var off = scrollOffset();
                        rect = $.extend({}, rect);
                        rect.top += off.top;
                        rect.left += off.left;
                    }
                    return rect;
                },

                rects: function(from) {
                    // order rects by size
                    var rects = $.map($.makeArray(this.range.getClientRects()).sort(function(rect1, rect2) {
                                return rect2.width * rect2.height - rect1.width * rect1.height;
                            }), function(rect) {
                            return $.extend({}, rect)
                        }),
                        i = 0,
                        j,
                        len = rects.length;

                    // safari returns overlapping client rects
                    //     - big rects can contain 2 smaller rects
                    //     - some rects can contain 0 - width rects
                    //     - we don't want these 0 width rects
                    while (i < rects.length) {
                        var cur = rects[i],
                            found = false;

                        j = i + 1;
                        while (j < rects.length) {
                            if (withinRect(cur, rects[j])) {
                                if (!rects[j].width) {
                                    rects.splice(j, 1)
                                } else {
                                    found = rects[j];
                                    break;
                                }
                            } else {
                                j++;
                            }
                        }

                        if (found) {
                            rects.splice(i, 1)
                        } else {
                            i++;
                        }

                    }
                    // safari will be return overlapping ranges ...
                    if (from == 'page') {
                        var off = scrollOffset();
                        return $.each(rects, function(ith, item) {
                            item.top += off.top;
                            item.left += off.left;
                        })
                    }

                    return rects;
                }

            });
        (function() {
            //method branching ....
            var fn = $.Range.prototype,
                range = $.Range().range;


            fn.compare = range.compareBoundaryPoints ? function(type, range) {
                return this.range.compareBoundaryPoints(this.window().Range[reverse(type)], range.range)
            } : function(type, range) {
                return this.range.compareEndPoints(convertType(type), range.range)
            }


            fn.move = range.setStart ? function(type, range) {

                var rangesRange = range.range;
                switch (type) {
                    case "START_TO_END":
                        this.range.setStart(rangesRange.endContainer, rangesRange.endOffset)
                        break;
                    case "START_TO_START":
                        this.range.setStart(rangesRange.startContainer, rangesRange.startOffset)
                        break;
                    case "END_TO_END":
                        this.range.setEnd(rangesRange.endContainer, rangesRange.endOffset)
                        break;
                    case "END_TO_START":
                        this.range.setEnd(rangesRange.startContainer, rangesRange.startOffset)
                        break;
                }

                return this;
            } : function(type, range) {
                this.range.setEndPoint(convertType(type), range.range)
                return this;
            };
            var cloneFunc = range.cloneRange ? "cloneRange" : "duplicate",
                selectFunc = range.selectNodeContents ? "selectNodeContents" : "moveToElementText";

            fn.

            clone = function() {
                return $.Range(this.range[cloneFunc]());
            };

            fn.

            select = range.selectNodeContents ? function(el) {
                if (!el) {
                    var selection = this.window().getSelection();
                    selection.removeAllRanges();
                    selection.addRange(this.range);
                } else {
                    this.range.selectNodeContents(el);
                }
                return this;
            } : function(el) {
                if (!el) {
                    this.range.select()
                } else if (el.nodeType === 3) {
                    //select this node in the element ...
                    var parent = el.parentNode,
                        start = 0,
                        end;
                    iterate(parent.childNodes, function(txtNode) {
                        if (txtNode === el) {
                            end = start + txtNode.nodeValue.length;
                            return false;
                        } else {
                            start = start + txtNode.nodeValue.length
                        }
                    })
                    this.range.moveToElementText(parent);

                    this.range.moveEnd('character', end - this.range.text.length)
                    this.range.moveStart('character', start);
                } else {
                    this.range.moveToElementText(el);
                }
                return this;
            };

        })();

        // helpers  -----------------

        // iterates through a list of elements, calls cb on every text node
        // if cb returns false, exits the iteration
        var iterate = function(elems, cb) {
            var elem, start;
            for (var i = 0; elems[i]; i++) {
                elem = elems[i];
                // Get the text from text nodes and CDATA nodes
                if (elem.nodeType === 3 || elem.nodeType === 4) {
                    if (cb(elem) === false) {
                        return false;
                    }
                    // Traverse everything else, except comment nodes
                } else if (elem.nodeType !== 8) {
                    if (iterate(elem.childNodes, cb) === false) {
                        return false;
                    }
                }
            }

        },
            isText = function(node) {
                return node.nodeType === 3 || node.nodeType === 4
            },
            iteratorMaker = function(toChildren, toNext) {
                return function(node, mustMoveRight) {
                    // first try down
                    if (node[toChildren] && !mustMoveRight) {
                        return isText(node[toChildren]) ?
                            node[toChildren] :
                            arguments.callee(node[toChildren])
                    } else if (node[toNext]) {
                        return isText(node[toNext]) ?
                            node[toNext] :
                            arguments.callee(node[toNext])
                    } else if (node.parentNode) {
                        return arguments.callee(node.parentNode, true)
                    }
                }
            },
            getNextTextNode = iteratorMaker("firstChild", "nextSibling"),
            getPrevTextNode = iteratorMaker("lastChild", "previousSibling"),
            callMove = function(container, offset, howMany) {
                var mover = howMany < 0 ?
                    getPrevTextNode : getNextTextNode;

                // find the text element
                if (!isText(container)) {
                    // sometimes offset isn't actually an element
                    container = container.childNodes[offset] ?
                        container.childNodes[offset] :
                    // if this happens, use the last child
                    container.lastChild;

                    if (!isText(container)) {
                        container = mover(container)
                    }
                    return move(container, howMany)
                } else {
                    if (offset + howMany < 0) {
                        return move(mover(container), offset + howMany)
                    } else {
                        return move(container, offset + howMany)
                    }

                }
            },
            // Moves howMany characters from the start of
            // from
            move = function(from, howMany) {
                var mover = howMany < 0 ?
                    getPrevTextNode : getNextTextNode;

                howMany = Math.abs(howMany);

                while (from && howMany >= from.nodeValue.length) {
                    howMany = howMany - from.nodeValue.length;
                    from = mover(from)
                }
                return {
                    node: from,
                    offset: mover === getNextTextNode ? howMany : from.nodeValue.length - howMany
                }
            },
            supportWhitespace,
            isWhitespace = function(el) {
                if (supportWhitespace == null) {
                    supportWhitespace = 'isElementContentWhitespace' in el;
                }
                return (supportWhitespace ? el.isElementContentWhitespace :
                    (el.nodeType === 3 && '' == el.data.trim()));

            },
            // if a point is within a rectangle
            within = function(rect, point) {

                return rect.left <= point.clientX && rect.left + rect.width >= point.clientX &&
                    rect.top <= point.clientY &&
                    rect.top + rect.height >= point.clientY
            },
            // if a rectangle is within another rectangle
            withinRect = function(outer, inner) {
                return within(outer, {
                        clientX: inner.left,
                        clientY: inner.top
                    }) && //top left
                within(outer, {
                        clientX: inner.left + inner.width,
                        clientY: inner.top
                    }) && //top right
                within(outer, {
                        clientX: inner.left,
                        clientY: inner.top + inner.height
                    }) && //bottom left
                within(outer, {
                        clientX: inner.left + inner.width,
                        clientY: inner.top + inner.height
                    }) //bottom right
            },
            // gets the scroll offset from a window
            scrollOffset = function(win) {
                var win = win || window;
                doc = win.document.documentElement, body = win.document.body;

                return {
                    left: (doc && doc.scrollLeft || body && body.scrollLeft || 0) + (doc.clientLeft || 0),
                    top: (doc && doc.scrollTop || body && body.scrollTop || 0) + (doc.clientTop || 0)
                };
            };

        support.moveToPoint = !! $.Range().range.moveToPoint

        return $;
    })($, __m4);

    // ## jquerypp/dom/selection/selection.js
    var __m1 = (function($) {

        var getWindow = function(element) {
            return element ? element.ownerDocument.defaultView || element.ownerDocument.parentWindow : window
        },
            // A helper that uses range to abstract out getting the current start and endPos.
            getElementsSelection = function(el, win) {
                // get a copy of the current range and a range that spans the element
                var current = $.Range.current(el).clone(),
                    entireElement = $.Range(el).select(el);
                // if there is no overlap, there is nothing selected
                if (!current.overlaps(entireElement)) {
                    return null;
                }
                // if the current range starts before our element
                if (current.compare("START_TO_START", entireElement) < 1) {
                    // the selection within the element begins at 0
                    startPos = 0;
                    // move the current range to start at our element
                    current.move("START_TO_START", entireElement);
                } else {
                    // Make a copy of the element's range.
                    // Move it's end to the start of the selected range
                    // The length of the copy is the start of the selected
                    // range.
                    fromElementToCurrent = entireElement.clone();
                    fromElementToCurrent.move("END_TO_START", current);
                    startPos = fromElementToCurrent.toString().length
                }

                // If the current range ends after our element
                if (current.compare("END_TO_END", entireElement) >= 0) {
                    // the end position is the last character
                    endPos = entireElement.toString().length
                } else {
                    // otherwise, it's the start position plus the current range
                    // TODO: this doesn't seem like it works if current
                    // extends to the left of the element.
                    endPos = startPos + current.toString().length
                }
                return {
                    start: startPos,
                    end: endPos,
                    width: endPos - startPos
                };
            },
            // Text selection works differently for selection in an input vs
            // normal html elements like divs, spans, and ps.
            // This function branches between the various methods of getting the selection.
            getSelection = function(el) {
                var win = getWindow(el);

                // `selectionStart` means this is an input element in a standards browser.
                if (el.selectionStart !== undefined) {

                    if (document.activeElement && document.activeElement != el && el.selectionStart == el.selectionEnd && el.selectionStart == 0) {
                        return {
                            start: el.value.length,
                            end: el.value.length,
                            width: 0
                        };
                    }
                    return {
                        start: el.selectionStart,
                        end: el.selectionEnd,
                        width: el.selectionEnd - el.selectionStart
                    };
                }
                // getSelection means a 'normal' element in a standards browser.
                else if (win.getSelection) {
                    return getElementsSelection(el, win)
                } else {
                    // IE will freak out, where there is no way to detect it, so we provide a callback if it does.
                    try {
                        // The following typically works for input elements in IE:
                        if (el.nodeName.toLowerCase() == 'input') {
                            var real = getWindow(el).document.selection.createRange(),
                                r = el.createTextRange();
                            r.setEndPoint("EndToStart", real);

                            var start = r.text.length
                            return {
                                start: start,
                                end: start + real.text.length,
                                width: real.text.length
                            }
                        }
                        // This works on textareas and other elements
                        else {
                            var res = getElementsSelection(el, win)
                            if (!res) {
                                return res;
                            }
                            // we have to clean up for ie's textareas which don't count for
                            // newlines correctly
                            var current = $.Range.current().clone(),
                                r2 = current.clone().collapse().range,
                                r3 = current.clone().collapse(false).range;

                            r2.moveStart('character', -1)
                            r3.moveStart('character', -1)
                            // if we aren't at the start, but previous is empty, we are at start of newline
                            if (res.startPos != 0 && r2.text == "") {
                                res.startPos += 2;
                            }
                            // do a similar thing for the end of the textarea
                            if (res.endPos != 0 && r3.text == "") {
                                res.endPos += 2;
                            }

                            return res
                        }
                    } catch (e) {
                        return {
                            start: el.value.length,
                            end: el.value.length,
                            width: 0
                        };
                    }
                }
            },
            // Selects text within an element.  Depending if it's a form element or
            // not, or a standards based browser or not, we do different things.
            select = function(el, start, end) {
                var win = getWindow(el);
                // IE behaves bad even if it sorta supports
                // getSelection so we have to try the IE methods first. barf.
                if (el.setSelectionRange) {
                    if (end === undefined) {
                        el.focus();
                        el.setSelectionRange(start, start);
                    } else {
                        el.select();
                        el.selectionStart = start;
                        el.selectionEnd = end;
                    }
                } else if (el.createTextRange) {
                    var r = el.createTextRange();
                    r.moveStart('character', start);
                    end = end || start;
                    r.moveEnd('character', end - el.value.length);

                    r.select();
                } else if (win.getSelection) {
                    var doc = win.document,
                        sel = win.getSelection(),
                        range = doc.createRange(),
                        ranges = [start, end !== undefined ? end : start];
                    getCharElement([el], ranges);
                    range.setStart(ranges[0].el, ranges[0].count);
                    range.setEnd(ranges[1].el, ranges[1].count);

                    // removeAllRanges is necessary for webkit
                    sel.removeAllRanges();
                    sel.addRange(range);

                } else if (win.document.body.createTextRange) { //IE's weirdness
                    var range = document.body.createTextRange();
                    range.moveToElementText(el);
                    range.collapse()
                    range.moveStart('character', start)
                    range.moveEnd('character', end !== undefined ? end : start)
                    range.select();
                }

            },
            // If one of the range values is within start and len, replace the range
            // value with the element and its offset.
            replaceWithLess = function(start, len, range, el) {
                if (typeof range[0] === 'number' && range[0] < len) {
                    range[0] = {
                        el: el,
                        count: range[0] - start
                    };
                }
                if (typeof range[1] === 'number' && range[1] <= len) {
                    range[1] = {
                        el: el,
                        count: range[1] - start
                    }
                }
            },
            getCharElement = function(elems, range, len) {
                var elem,
                    start;

                len = len || 0;
                for (var i = 0; elems[i]; i++) {
                    elem = elems[i];
                    // Get the text from text nodes and CDATA nodes
                    if (elem.nodeType === 3 || elem.nodeType === 4) {
                        start = len
                        len += elem.nodeValue.length;
                        //check if len is now greater than what's in counts
                        replaceWithLess(start, len, range, elem)
                        // Traverse everything else, except comment nodes
                    } else if (elem.nodeType !== 8) {
                        len = getCharElement(elem.childNodes, range, len);
                    }
                }
                return len;
            };

        $.fn.selection = function(start, end) {
            if (start !== undefined) {
                return this.each(function() {
                    select(this, start, end)
                })
            } else {
                return getSelection(this[0])
            }
        };
        // for testing
        $.fn.selection.getCharElement = getCharElement;

        return $;
    })($, __m3);
})(jQuery);