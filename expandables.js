/*
 * Expandables JS
 * Simple vanilla JS to toggle visibility
 * of boxes by adjusting thier height
 *
 * @author jrudenstam
 * @version 0.2
 */

(function(definition, ctx){
	"use strict";

	if (typeof define === "function") {
		define(['../helper-js/helper'], definition);
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
			dataTargetAttr: 'data-target',
			closeBtnClass: 'close-btn',
			openOne: true
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

			// We need at least inner, outer, wrapper and btn elements
			var hasRequiredElemnets = helper.getByClass(this.settings.btnClass, document, true) && 
			helper.getByClass(this.settings.wrapperClass, document, true) && 
			helper.getByClass(this.settings.outerClass, document, true) && 
			helper.getByClass(this.settings.innerClass, document, true) ? true : false;
			
			if ( !hasRequiredElemnets ) {
				return;
			}

			// Get all btns
			this.btns = helper.getByClass(this.settings.btnClass, document, false);

			// Start things up
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
			// Since you can´t animate with height auto set height value if expanded onLoad
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

			// Get all the elements needed to expand/contract
			var btn = self.closestByClass(this, self.settings.btnClass),
			dataTargetWrapper = helper.getByClass(helper.getAttribute(btn, self.settings.dataTargetAttr), document, true),
			wrapper = dataTargetWrapper || self.closestByClass(btn, self.settings.wrapperClass),
			outer = helper.getByClass(self.settings.outerClass, wrapper, true),
			parentWrapper = self.closestByClass(wrapper.parentNode, self.settings.wrapperClass);

			// We will need to see if current wrapper is initiated by dataTargetAttr
			wrapper.usingDataTarget = dataTargetWrapper ? true : false;
			wrapper.dataTarget = helper.getAttribute(btn, self.settings.dataTargetAttr);

			// Close all open elems by triggering click on the btns
			if ( self.settings.openOne ) {
				for (var i = self.btns.length - 1; i >= 0; i--) {
					if ( helper.hasClass(self.btns[i], self.settings.expandedClass) && self.btns[i] !== btn ) {
						self.btns[i].click();
					}
				};
			}

			// If close button just close otherwise toggle
			if ( helper.hasClass(btn, self.settings.closeBtnClass) ) {
				self.close( btn, outer, wrapper );
			} else {
				self.toggle( btn, outer, wrapper );
			}
		},

		closestByClass: function( fromElem, targetClass ) {
			// Less clutter wrapper for helper.up()
			return helper.up(fromElem, function(node){
				if (helper.hasClass(node, targetClass)) {
					return true;
				}
			},this );
		},

		open: function( btn, outer, wrapper ) {
			// Get height by inner elem
			var inner = helper.getByClass(this.settings.innerClass, wrapper, true);

			outer.style.height = inner.clientHeight + 'px';
			helper.addClass(outer, this.settings.expandedClass);
			helper.addClass(btn, this.settings.expandedClass);
			helper.addClass(wrapper, this.settings.expandedClass);

			if (helper.getAttribute(btn, this.settings.closeTextAttr)) {
				// Save text from DOM in property
				if (!wrapper.initialBtnText) {
					wrapper.initialBtnText = btn.innerHTML;
				}
				btn.innerHTML = helper.getAttribute(btn, this.settings.closeTextAttr);
			}
		},

		close: function( btn, outer, wrapper ) {
			outer.style.height = 0;
			helper.removeClass(outer, this.settings.expandedClass);
			helper.removeClass(btn, this.settings.expandedClass);
			helper.removeClass(wrapper, this.settings.expandedClass);

			if (wrapper.initialBtnText && helper.getAttribute(btn, this.settings.closeTextAttr)) {
				btn.innerHTML = wrapper.initialBtnText;
			}
		},

		toggle: function( btn, outer, wrapper ) {
			// If expanded
			if ( helper.hasClass(wrapper, this.settings.expandedClass) ) {
				this.close( btn, outer, wrapper );

			} else {
				this.open( btn, outer, wrapper );
			}
		}
	};

	return expandables;
}, this);