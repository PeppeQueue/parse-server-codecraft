function Menu() {

}

Menu.menus = [];
Menu.restaurant;

Menu.init = function (restaurant) {
	Parse.initialize(Config.PARSE_APP_ID);
	Parse.serverURL = Config.PARSE_SERVER_URL;
	const currentUser = Parse.User.current();

	Menu.restaurant = restaurant;

	$('#restaurantView').hide();
	$('#menuCreateView').hide();
	$('#menuItemView').hide();
	$('#menuItemCreateView').hide();
	$('#menu-container').show();
	$('#menuView').show();
	$('#selectedRestaurantName').html(restaurant.get('name'));

	$('#newMenuItemGroupEnterDiv').hide();

	MenuService.getRestaurantMenuList(restaurant);

	$('#addMenuIcon').click(Menu.clickAddNewMenuButton);

	$('#createMenuButton').unbind('click');
	$('#createMenuButton').click(Menu.createNewMenu);

	$('.menuBackButton').click(Menu.goBackToRestaurantView);
	$('#menuCreateViewBackButton').click(Menu.goBackToMenuView);
	Menu.registerInputEvents();
};

Menu.goBackToMenuView = function (event) {
	event.preventDefault();
	$('#menuCreateView').hide();
	$('#menuView').show();
};

Menu.goBackToRestaurantView = function (event) {
	event.preventDefault();
	$('#menuView').hide();
	$('#restaurantView').show();
};

Menu.createNewMenu = function (event) {
	event.preventDefault();
	const name = $('#menuName').val();
	const description = $('#menuDes').val();
	const note = $('#menuNote').val();

	if (name == '' || description == '' || note == '') {
		$('.create-menuName, .create-menuDes, .create-menuNote').blur();
	} else {
		MenuService.createMenu(name, description, note, Menu.restaurant);
	}
};

Menu.clickAddNewMenuButton = function (event) {
	event.preventDefault();
	$('#menuView').hide();
	$('#menuItemCreateView').hide();
	$('#menuCreateView').show();
	$('#createMenuButton').show();
	$('#editMenuButton').hide();
	$('#restaurantName').html(Menu.restaurant.get('name'));
	$('#menuName').val('');
	$('#menuDes').val('');
	$('#menuNote').val('');
};

Menu.displayMenuList = function (results) {
	$('#menuCreateView').hide();
	$('#menuView').show();
	Menu.menus = [];
	let items = '';
	for (let i = 0; i < results.length; i++) {
		const object = results[i];
		const { id } = object;
		const name = object.get('name');
		const display = object.get('display');
		const description = object.get('description');
		const note = object.get('note');
		const active = object.get('active');

		Menu.menus.push(object);
		let checked = '';
		if (active) {
			checked = 'checked';
		} else {
			checked = '';
		}


		items += `${'<li class="list-group-item"'
            + '"> <label class="switch pull-right"><input type="checkbox"  class="menu-active" data-id='}${id}  ${checked}>  <span class="slider round"></span> </label>`
            + `<div class="menuName">${name}</div>`
            + `<div>${note}</div>`
            + `<div>${description}</div>`
            + '<div> <p>' + ' ' + '</p></div>'

            + '<div class="action-items-menu">'
            + `</a><a href="" rel="tooltip" title="MenuItems" data-id=${id}>`
            + '<i class="far fa-list-alt fa-lg" ></i>'
            + `</a><a href="" rel="tooltip" title="Edit" data-id=${id}>`
            + '<i class="fas fa-edit fa-lg" ></i>'
            + `</a> <a href=""  rel="tooltip" title="Delete" data-id=${id}>`
            + '<i class="fa fa-trash fa-lg" ></i></a>'
            + '</div>'
            + '</li>';
	}
	$('#menuList').empty();
	$('#menuList').append(items);
	$('.menu-active').change(Menu.onChangeCheckBox);
	$('#menus .action-items-menu a').click(Menu.selectOption);
};

Menu.onChangeCheckBox = function () {
	const id = $(this).attr('data-id');
	const menu = Menu.getSelectedMenu(id);
	if (!$(this).is(':checked')) {
		MenuService.updateMenuState(menu, false);
	} else {
		MenuService.updateMenuState(menu, true);
	}
};


Menu.selectOption = function (event) {
	event.preventDefault();
	const title = $(this).attr('title');
	const id = $(this).attr('data-id');
	if (title == 'Edit') {
		Menu.selectMenu(id);
	}
	if (title == 'MenuItems') {
		Menu.selectMenuItemView(id);
	}
	if (title == 'Delete') {
		Menu.destroyMenu(id);
	}
};

Menu.destroyMenu = function (id) {
	swal({
		title: 'Are you sure?',
		text: '',
		icon: 'warning',
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				const menu = Menu.getSelectedMenu(id);
				MenuService.destroyMenu(menu);
			} else {

			}
		});
};


Menu.selectMenuItemView = function (id) {
	const menu = Menu.getSelectedMenu(id);
	MenuItem.init(Menu.restaurant, menu);
};

Menu.selectMenu = function (id) {
	const menu = Menu.getSelectedMenu(id);
	console.log(menu);
	$('#menuView').hide();
	$('#menuCreateView').show();
	$('#restaurantName').html(Menu.restaurant.get('name'));
	$('#menuId').val(menu.id);
	$('#menuName').focus();
	$('#menuName').val(menu.get('name'));
	$('#menuDes').focus();
	$('#menuDes').val(menu.get('description'));
	$('#menuNote').focus();
	$('#menuNote').val(menu.get('note'));
	$('#createMenuButton').hide();
	$('#editMenuButton').show();
	$('#editMenuButton').click(Menu.editMenu);
};

Menu.editMenu = function (event) {
	event.preventDefault();
	const name = $('#menuName').val();
	const description = $('#menuDes').val();
	const note = $('#menuNote').val();
	if (name == '' || description == '' || note == '') {
		$('.create-menuName, .create-menuDes, .create-menuNote').blur();
	} else {
		const id = $('#menuId').val();
		const menu = Menu.getSelectedMenu(id);
		MenuService.editMenu(menu, name, description, note);
	}
};

Menu.getSelectedMenu = function (id) {
	console.log(Menu.menus);
	for (let i = 0; i < Menu.menus.length; i++) {
		const menu = Menu.menus[i];
		if (menu.id == id) {
			return menu;
		}
	}
};


Menu.selectMenuItem = function () {
	const checkbox = $(this).find('input');
	if (!checkbox.is(':checked')) {
		// check user selected item and apply style
		$(this).addClass('active animated fadeIn').siblings().removeClass(
			'active animated fadeIn',
		);
		$('#menuItemList .checkboxes').prop('checked', false);
		checkbox.prop('checked', true);
		const id = $(this).attr('data-id');
		const item = Menu.getMenuItemById(id);
		$('#menuItemName').val(item.name);
		$('#menuItemDes').val(item.description);
		$('#menuItemNote').val(item.note);
		$('#menuItemGroup').val(item.group.value);

		const selectedItemCats = item.dynamicCats;
		Menu.selectMenuItemCategory(1, selectedItemCats, 'RestaurantMenuItemCatStart');
		const attributeList = $('select[name^=fixed-]');
		const selectedFixedItemCats = item.fixedCats;
		$(attributeList).each((index, element) => {
			const elementId = element.id;
			const values = Menu.getFixedItemCategoryValueByName(elementId, selectedFixedItemCats);
			$(`#${elementId}`).val(values);
			// check whether control is multiselect
			if (Array.isArray(values)) {
				const container = $(`#${elementId}`).multiSelect().data('multiSelectContainer');
				container.find('input').prop('checked', false);
				for (let i = 0; i < values.length; i++) {
					const val = values[i];
					const checkbox = container.find(`input[value='${val}']`);
					checkbox.trigger('click').trigger('change');
				}
			}
		});
	} else if (checkbox.is(':checked')) {
		$(this).removeClass('active animated fadeIn');
		checkbox.prop('checked', false);
	}
};

Menu.getFixedItemCategoryValueByName = function (name, selectedFixedItemCats) {
	for (let i = 0; i < selectedFixedItemCats.length; i++) {
		const item = selectedFixedItemCats[i];
		if (item.name == name) {
			return item.value;
		}
	}
};

Menu.getMenuItemById = function (id) {
	const items = Menu.menuItems;
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (item.id == id) {
			return item;
		}
	}
};


Menu.showSubMenuCategoryLevel = function (level) {
	$(`#menuItemCategoryDiv${level}`).show();
};


Menu.registerInputEvents = function () {
	$('input').blur(function () {
		if ($(this).hasClass('create-menuName')) {
			if ($(this).val().length == '') {
				$(this).siblings('span.error').text('Please type menu name').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
			}
		}

		if ($(this).hasClass('create-menuDes')) {
			if ($(this).val().length == '') {
				$(this).siblings('span.error').text('Please type description').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
			}
		}

		if ($(this).hasClass('create-menuNote')) {
			if ($(this).val().length == '') {
				$(this).siblings('span.error').text('Please type note').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
			}
		}
	});
};
