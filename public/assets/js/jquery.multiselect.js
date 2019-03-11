// jquery.multi-select.js
// by mySociety
// https://github.com/mysociety/jquery-multi-select

(function ($) {
	const pluginName = 'multiSelect';
	const defaults = {
		containerHTML: '<div class="multi-select-container">',
		menuHTML: '<div class="multi-select-menu">',
		buttonHTML: '<span class="multi-select-button">',
		menuItemsHTML: '<div class="multi-select-menuitems">',
		menuItemHTML: '<label class="multi-select-menuitem">',
		presetsHTML: '<div class="multi-select-presets">',
		activeClass: 'multi-select-container--open',
		noneText: 'Select',
		allText: undefined,
		presets: undefined,
		positionedMenuClass: 'multi-select-container--positioned',
		positionMenuWithin: undefined,
		viewportBottomGutter: 20,
		menuMinHeight: 200,
	};

	/**
     * @constructor
     */
	function MultiSelect(element, options) {
		this.element = element;
		this.$element = $(element);
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	function arraysAreEqual(array1, array2) {
		if (array1.length != array2.length) {
			return false;
		}

		array1.sort();
		array2.sort();

		for (let i = 0; i < array1.length; i++) {
			if (array1[i] !== array2[i]) {
				return false;
			}
		}

		return true;
	}

	$.extend(MultiSelect.prototype, {

		init() {
			this.checkSuitableInput();
			this.findLabels();
			this.constructContainer();
			this.constructButton();
			this.constructMenu();

			this.setUpBodyClickListener();
			this.setUpLabelsClickListener();

			this.$element.hide();
		},

		checkSuitableInput(text) {
			if (this.$element.is('select[multiple]') === false) {
				throw new Error('$.multiSelect only works on <select multiple> elements');
			}
		},

		findLabels() {
			this.$labels = $(`label[for="${this.$element.attr('id')}"]`);
		},

		constructContainer() {
			this.$container = $(this.settings.containerHTML);
			this.$element.data('multi-select-container', this.$container);
			this.$container.insertAfter(this.$element);
		},

		constructButton() {
			const _this = this;
			this.$button = $(this.settings.buttonHTML);
			this.$button.attr({
				role: 'button',
				'aria-haspopup': 'true',
				tabindex: 0,
				'aria-label': this.$labels.eq(0).text(),
			})
				.on('keydown.multiselect', (e) => {
					const key = e.which;
					const returnKey = 13;
					const spaceKey = 32;
					if ((key === returnKey) || (key === spaceKey)) {
						_this.$button.click();
					}
				}).on('click.multiselect', (e) => {
					_this.menuToggle();
				})
				.appendTo(this.$container);

			this.$element.on('change.multiselect', () => {
				_this.updateButtonContents();
			});

			this.updateButtonContents();
		},

		updateButtonContents() {
			const _this = this;
			const options = [];
			const selected = [];

			this.$element.children('option').each(function () {
				const text = /** @type string */ ($(this).text());
				options.push(text);
				if ($(this).is(':selected')) {
					selected.push($.trim(text));
				}
			});

			this.$button.empty();

			if (selected.length == 0) {
				this.$button.text(this.settings.noneText);
			} else if ((selected.length === options.length) && this.settings.allText) {
				this.$button.text(this.settings.allText);
			} else {
				this.$button.text(selected.join(', '));
			}
		},

		constructMenu() {
			const _this = this;

			this.$menu = $(this.settings.menuHTML);
			this.$menu.attr({
				role: 'menu',
			}).on('keyup.multiselect', (e) => {
				const key = e.which;
				const escapeKey = 27;
				if (key === escapeKey) {
					_this.menuHide();
				}
			})
				.appendTo(this.$container);

			this.constructMenuItems();

			if (this.settings.presets) {
				this.constructPresets();
			}
		},

		constructMenuItems() {
			const _this = this;

			this.$menuItems = $(this.settings.menuItemsHTML);
			this.$menu.append(this.$menuItems);

			this.$element.on('change.multiselect', (e, internal) => {
				// Don't need to update the menu items if this
				// change event was fired by our tickbox handler.
				if (internal !== true) {
					_this.updateMenuItems();
				}
			});

			this.updateMenuItems();
		},

		updateMenuItems() {
			const _this = this;
			this.$menuItems.empty();

			this.$element.children('option').each((option_index, option) => {
				const $item = _this.constructMenuItem($(option), option_index);
				_this.$menuItems.append($item);
			});
		},

		constructPresets() {
			const _this = this;
			this.$presets = $(this.settings.presetsHTML);
			this.$menu.prepend(this.$presets);

			$.each(this.settings.presets, (i, preset) => {
				const unique_id = `${_this.$element.attr('name')}_preset_${i}`;
				const $item = $(_this.settings.menuItemHTML)
					.attr({
						for: unique_id,
						role: 'menuitem',
					})
					.text(` ${preset.name}`)
					.appendTo(_this.$presets);

				const $input = $('<input>')
					.attr({
						type: 'radio',
						name: `${_this.$element.attr('name')}_presets`,
						id: unique_id,
					})
					.prependTo($item);

				$input.on('change.multiselect', () => {
					_this.$element.val(preset.options);
					_this.$element.trigger('change');
				});
			});

			this.$element.on('change.multiselect', () => {
				_this.updatePresets();
			});

			this.updatePresets();
		},

		updatePresets() {
			const _this = this;

			$.each(this.settings.presets, (i, preset) => {
				const unique_id = `${_this.$element.attr('name')}_preset_${i}`;
				const $input = _this.$presets.find(`#${unique_id}`);

				if (arraysAreEqual(preset.options || [], _this.$element.val() || [])) {
					$input.prop('checked', true);
				} else {
					$input.prop('checked', false);
				}
			});
		},

		constructMenuItem($option, option_index) {
			const unique_id = `${this.$element.attr('name')}_${option_index}`;
			const $item = $(this.settings.menuItemHTML)
				.attr({
					for: unique_id,
					role: 'menuitem',
				})
				.text(` ${$option.text()}`);

			const $input = $('<input>')
				.attr({
					type: 'checkbox',
					id: unique_id,
					value: $option.val(),
				})
				.prependTo($item);

			if ($option.is(':disabled')) {
				$input.attr('disabled', 'disabled');
			}
			if ($option.is(':selected')) {
				$input.prop('checked', 'checked');
			}

			$input.on('change.multiselect', function () {
				if ($(this).prop('checked')) {
					$option.prop('selected', true);
				} else {
					$option.prop('selected', false);
				}

				// .prop() on its own doesn't generate a change event.
				// Other plugins might want to do stuff onChange.
				$option.trigger('change', [true]);
			});

			return $item;
		},

		setUpBodyClickListener() {
			const _this = this;

			// Hide the $menu when you click outside of it.
			$('html').on('click.multiselect', () => {
				_this.menuHide();
			});

			// Stop click events from inside the $button or $menu from
			// bubbling up to the body and closing the menu!
			this.$container.on('click.multiselect', (e) => {
				e.stopPropagation();
			});
		},

		setUpLabelsClickListener() {
			const _this = this;
			this.$labels.on('click.multiselect', (e) => {
				e.preventDefault();
				e.stopPropagation();
				_this.menuToggle();
			});
		},

		menuShow() {
			$('html').trigger('click.multiselect'); // Close any other open menus
			this.$container.addClass(this.settings.activeClass);

			if (this.settings.positionMenuWithin && this.settings.positionMenuWithin instanceof $) {
				const menuLeftEdge = this.$menu.offset().left + this.$menu.outerWidth();
				const withinLeftEdge = this.settings.positionMenuWithin.offset().left
            + this.settings.positionMenuWithin.outerWidth();

				if (menuLeftEdge > withinLeftEdge) {
					this.$menu.css('width', (withinLeftEdge - this.$menu.offset().left));
					this.$container.addClass(this.settings.positionedMenuClass);
				}
			}

			const menuBottom = this.$menu.offset().top + this.$menu.outerHeight();
			const viewportBottom = $(window).scrollTop() + $(window).height();
			if (menuBottom > viewportBottom - this.settings.viewportBottomGutter) {
				this.$menu.css({
					maxHeight: Math.max(
						viewportBottom - this.settings.viewportBottomGutter - this.$menu.offset().top,
						this.settings.menuMinHeight,
					),
					overflow: 'scroll',
				});
			} else {
				this.$menu.css({
					maxHeight: '',
					overflow: '',
				});
			}
		},

		menuHide() {
			this.$container.removeClass(this.settings.activeClass);
			this.$container.removeClass(this.settings.positionedMenuClass);
			this.$menu.css('width', 'auto');
		},

		menuToggle() {
			if (this.$container.hasClass(this.settings.activeClass)) {
				this.menuHide();
			} else {
				this.menuShow();
			}
		},

	});

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, `plugin_${pluginName}`)) {
				$.data(this, `plugin_${pluginName}`,
					new MultiSelect(this, options));
			}
		});
	};
}(jQuery));
