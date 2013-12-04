/*
 * Expandables JS v0.1
 * Simple vanilla JS to toggle visibility
 * of boxes by adjusting thier height
 *
 * Author: jrudenstam
 * http://typisktmig.se
 */

(function(definition, ctx){
	"use strict";

	if (typeof define === "function") {
		define(['/helper-js/helper.js'], definition);
	} else {
		ctx["expandables"] = definition;
	}
})(function( helper ){
	var expandables = {
		defaults: {
			wrapperClass: 'expand-box',
			outerClass: 'expandable',
			innerClass: 'inner',
			btnClass: 'toggle-visibility',
			expandedClass: 'expanded',
			closeTextAttr: 'data-close-text',
			closeBtnClass: 'close-btn'
		},

		btns: [],

		init: function( settings ){
			// Extend settings
			this.settings = h.create(this.defaults);

			if (settings) {
				for (var setting in settings) {
					this.settings[setting] = settings[setting];
				}
			}

			// Get all btns
			this.btns = h.getByClass(this.settings.btnClass, document, false);

			this.bindUiEvents();
			this.heightMeUpBeforeYouGoGo();
		},

		bindUiEvents: function(){
			// Bind click on expand/unexpand buttons
			var btns = this.btns;
			for (var i = btns.length - 1; i >= 0; i--) {
				h.addEvent(btns[i], 'click', this.clickHandler, this);
			};
		},

		heightMeUpBeforeYouGoGo: function(){
			// Since you can´t animate with height auto
			var outers = h.getByClass(this.settings.outerClass, document);

			for (var i = outers.length - 1; i >= 0; i--) {
				if(h.hasClass(outers[i], this.settings.expandedClass)){
					var inner = h.getByClass(this.settings.innerClass, outers[i], true),
					height = inner.clientHeight;
					outers[i].style.height = height + 'px';
				}
			};
		},

		clickHandler: function( event ){
			event.stop();
			this.setHeight(event.target);
			if (this.settings.callback) {
				this.settings.callback(event, wrapper, this.setHeight);
			}
		},

		setHeight: function( btn, safeHeight ) {
			// To get wrapper we traverse up until match with wrapper class is found
			// as a fallback we take the closest parent to button unless 'data-target' is set
			var btn = h.up(btn, function(node){
				if (h.hasClass(node, this.settings.btnClass)) {
					return true;
				}
			},this),
			usingDataTarget = h.getByClass(h.getAttribute(btn, 'data-target'), document, true) ? true : false;
			wrapper = usingDataTarget ? h.getByClass(h.getAttribute(btn, 'data-target'), document, true) : h.up(btn, function(node){
				if (h.hasClass(node, this.settings.wrapperClass)) {
					return true;
				}
			}, this),
			outer = h.getByClass(this.settings.outerClass, wrapper, true),
			inner = h.getByClass(this.settings.innerClass, wrapper, true),
			parentBox = h.up(wrapper.parentNode, function(node){
				if (h.hasClass(node, this.settings.wrapperClass)) {
					return true;
				}
			}, this);

			// We will need to see if current wrapper is initiated by 'data-target'
			wrapper.usingDataTarget = usingDataTarget;
			wrapper.dataTarget = h.getAttribute(btn, 'data-target');

			if (safeHeight) {
				outer.style.transition = 'none';
				outer.style.height = 'auto';
			} else if (outer.style.height === 'auto') {
				outer.style.removeProperty('transition');
				outer.style.removeProperty('height');
			}

			if (!safeHeight) {
				// If expanded or close btn
				if (h.hasClass(outer, this.settings.expandedClass) || h.hasClass(btn, this.settings.closeBtnClass)) {
					outer.style.height = 0;
					h.removeClass(outer, this.settings.expandedClass);
					h.removeClass(btn, this.settings.expandedClass);
					h.removeClass(wrapper, this.settings.expandedClass);

					if (wrapper.initialBtnText && h.getAttribute(btn, this.settings.closeTextAttr)) {
						btn.innerHTML = wrapper.initialBtnText;
					}

				} else {
					var height = inner.clientHeight;
					outer.style.height = height + 'px';
					h.addClass(outer, this.settings.expandedClass);
					h.addClass(btn, this.settings.expandedClass);
					h.addClass(wrapper, this.settings.expandedClass);

					if (h.getAttribute(btn, this.settings.closeTextAttr)) {
						if (!wrapper.initialBtnText) {
							wrapper.initialBtnText = btn.innerHTML;
						}
						btn.innerHTML = h.getAttribute(btn, this.settings.closeTextAttr);
					}
				}

				if (parentBox) {
					// Pass parent box button to this function
					if (parentBox.usingDataTarget) {
						var allBtnsWithTargetAttr = h.getByAttr('data-target', document),
						parentBtn = allBtnsWithTargetAttr[0];

						for (var i = allBtnsWithTargetAttr.length - 1; i >= 0; i--) {
							if (h.getAttribute(allBtnsWithTargetAttr[i], 'data-target') === parentBox.dataTarget) {
								parentBtn = allBtnsWithTargetAttr[i];
							}
						};
					}

					this.setHeight(parentBtn, true);
				}
			}
		}
	};

	return expandables;
}, this);