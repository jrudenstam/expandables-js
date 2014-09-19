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
		define(['vendor/helper'], definition);
	} else {
		ctx["expandables"] = definition;
	}
})(function( helper ){
	helper = helper || window.helper; // Get the helper if not using AMD
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
			this.settings = helper.create(this.defaults);

			if (settings) {
				for (var setting in settings) {
					this.settings[setting] = settings[setting];
				}
			}

			// Get all btns
			this.btns = helper.getByClass(this.settings.btnClass, document, false);

			this.bindUiEvents();
			this.heightMeUpBeforeYouGoGo();
		},

		bindUiEvents: function(){
			// Bind click on expand/unexpand buttons
			var btns = this.btns;
			for (var i = btns.length - 1; i >= 0; i--) {
				helper.addEvent(btns[i], 'click', this.clickHandler, this);
			};
		},

		heightMeUpBeforeYouGoGo: function(){
			// Since you can´t animate with height auto
			var outers = helper.getByClass(this.settings.outerClass, document);

			for (var i = outers.length - 1; i >= 0; i--) {
				if(helper.hasClass(outers[i], this.settings.expandedClass)){
					var inner = helper.getByClass(this.settings.innerClass, outers[i], true),
					height = inner.clientHeight;
					outers[i].style.height = height + 'px';
				}
			};
		},

		clickHandler: function( event, self ){
			event.stop();
			self.setHeight(event.target);
			if (self.settings.callback) {
				self.settings.callback(event, wrapper, self.setHeight);
			}
		},

		setHeight: function( btn, safeHeight ) {
			// To get wrapper we traverse up until match with wrapper class is found
			// as a fallback we take the closest parent to button unless 'data-target' is set
			var btn = helper.up(btn, function(node){
				if (helper.hasClass(node, this.settings.btnClass)) {
					return true;
				}
			},this),
			usingDataTarget = helper.getByClass(helper.getAttribute(btn, 'data-target'), document, true) ? true : false;
			wrapper = usingDataTarget ? helper.getByClass(helper.getAttribute(btn, 'data-target'), document, true) : helper.up(btn, function(node){
				if (helper.hasClass(node, this.settings.wrapperClass)) {
					return true;
				}
			}, this),
			outer = helper.getByClass(this.settings.outerClass, wrapper, true),
			inner = helper.getByClass(this.settings.innerClass, wrapper, true),
			parentBox = helper.up(wrapper.parentNode, function(node){
				if (helper.hasClass(node, this.settings.wrapperClass)) {
					return true;
				}
			}, this);

			// We will need to see if current wrapper is initiated by 'data-target'
			wrapper.usingDataTarget = usingDataTarget;
			wrapper.dataTarget = helper.getAttribute(btn, 'data-target');

			if (safeHeight) {
				outer.style.transition = 'none';
				outer.style.height = 'auto';
			} else if (outer.style.height === 'auto') {
				outer.style.removeProperty('transition');
				outer.style.removeProperty('height');
			}

			if (!safeHeight) {
				// If expanded or close btn
				if (helper.hasClass(outer, this.settings.expandedClass) || helper.hasClass(btn, this.settings.closeBtnClass)) {
					outer.style.height = 0;
					helper.removeClass(outer, this.settings.expandedClass);
					helper.removeClass(btn, this.settings.expandedClass);
					helper.removeClass(wrapper, this.settings.expandedClass);

					if (wrapper.initialBtnText && helper.getAttribute(btn, this.settings.closeTextAttr)) {
						btn.innerHTML = wrapper.initialBtnText;
					}

				} else {
					var height = inner.clientHeight;
					outer.style.height = height + 'px';
					helper.addClass(outer, this.settings.expandedClass);
					helper.addClass(btn, this.settings.expandedClass);
					helper.addClass(wrapper, this.settings.expandedClass);

					if (helper.getAttribute(btn, this.settings.closeTextAttr)) {
						if (!wrapper.initialBtnText) {
							wrapper.initialBtnText = btn.innerHTML;
						}
						btn.innerHTML = helper.getAttribute(btn, this.settings.closeTextAttr);
					}
				}

				if (parentBox) {
					// Pass parent box button to this function
					if (parentBox.usingDataTarget) {
						var allBtnsWithTargetAttr = helper.getByAttr('data-target', document),
						parentBtn = allBtnsWithTargetAttr[0];

						for (var i = allBtnsWithTargetAttr.length - 1; i >= 0; i--) {
							if (helper.getAttribute(allBtnsWithTargetAttr[i], 'data-target') === parentBox.dataTarget) {
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