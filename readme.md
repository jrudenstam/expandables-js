# Expandables JS
To expand boxes by changing their height. Works with CSS-transforms and nested expandboxes.

## Usage
The module expects a couple of classes to be used on every expand box. The wrapper <code>.expand-box</code> wich will normally wrap even the toggle button. The <code>.expandable</code> wich is the element that will have it´s height set. The <code>.inner</code> wich needs to be just below <code>.expandable</code> to give the correct height. The <code>.toggle-visibility</code> on the element that is used to expand/contract.
Basic usage:
<pre>
&lt;div class="expand-box"&gt;
	&lt;h2&gt;You might want some content here that is always visible&lt;/h2&gt;
	&lt;button class="toggle-visibility"&gt;Toggle&lt;/button&gt;
	&lt;div class="expandable"&gt;
		&lt;div class="inner"&gt;
			This content will be hidden until the box is expanded.
		&lt;/div&gt;
	&lt;/div&gt;
&lt;/div&gt;
</pre>
Initalize
<pre>
require(['expandables'], function( expandables ){
	expandables.init();

	// Or with settings
	expandables.init({
		wrapperClass: 'expand-box',
		outerClass: 'expandable',
		innerClass: 'inner',
		btnClass: 'toggle-visibility',
		expandedClass: 'expanded',
		closeTextAttr: 'data-close-text',
		closeBtnClass: 'close-btn'
	});
});
</pre>

### Nesting expandable items
If you want an expandable box inside another the parent will not be transitioned when contracting. This is because the parent box will need to have flexilbe height (<code>height: auto;</code>) in order for the nested boxes to be transitioned. When an element has a height transition and is set from fixed height to the initial value 'auto' it will transition to <code>height: 0;</code> THEN get the correct height.

## Dependencies
Expandables JS uses [Helper JS](https://github.com/jrudenstam/helper-js) wich makes vanilla JavaScript development smoother.

## AMD
Expandables JS will expose itself to window if require.js is not used. The helper dependency should work since Helper JS does the same.