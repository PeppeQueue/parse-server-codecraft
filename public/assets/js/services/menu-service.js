
function MenuService() {

}

MenuService.createMenu = (name, description, note, restaurant) => {
	const RestaurantMenu = Parse.Object.extend('RestaurantMenu');
	const restaurantMenu = new RestaurantMenu();

	restaurantMenu.set('active', true);
	restaurantMenu.set('name', name);
	restaurantMenu.set('display', name);
	restaurantMenu.set('description', description);
	restaurantMenu.set('note', note);
	restaurantMenu.set('restaurant', { __type: 'Pointer', className: 'RestaurantBiz', objectId: restaurant.id });
	restaurantMenu.set('owner', { __type: 'Pointer', className: '_User', objectId: Parse.User.current().id });

	NProgress.start();
	restaurantMenu.save(null).then(
		(resMenu) => {
			restaurant.relation('menus').add(resMenu).save().then(
				(success) => {
					MenuService.getRestaurantMenuList(restaurant);
					setTimeout(() => { NProgress.done(); }, 100);
				},
				(error) => {
					MenuService.getRestaurantMenuList(restaurant);
					setTimeout(() => { NProgress.done(); }, 100);
				},
			);
		},
		(error) => {
			MenuService.getRestaurantMenuList(restaurant);
			setTimeout(() => { NProgress.done(); }, 100);
		},
	);
};

MenuService.getRestaurantMenuList = (restaurant) => {
	const relation = restaurant.relation('menus');
	const query = relation.query();
	query.descending('createdAt');
	NProgress.start();
	query.find().then(
		(menus) => {
			Menu.displayMenuList(menus);
			setTimeout(() => { NProgress.done(); }, 100);
		},
		(error) => {
			Menu.displayMenuList([]);
			setTimeout(() => { NProgress.done(); }, 100);
		},
	);
};

MenuService.editMenu = (menu, name, description, note) => {
	menu.set('active', true);
	menu.set('name', name);
	menu.set('display', name);
	menu.set('description', description);
	menu.set('note', note);

	NProgress.start();
	menu.save().then(
		(res) => {
			setTimeout(() => { NProgress.done(); }, 100);
			MenuService.getRestaurantMenuList(Menu.restaurant);
		},
		(error) => {
			MenuService.getRestaurantMenuList(Menu.restaurant);
			setTimeout(() => { NProgress.done(); }, 100);
		},
	);
};

MenuService.updateMenuState = (menu, state) => {
	menu.set('active', state);
	menu.save();
};

MenuService.destroyMenu = (menu) => {
	NProgress.start();
	menu.destroy().then(
		(res) => {
			MenuService.getRestaurantMenuList(Menu.restaurant);
			setTimeout(() => { NProgress.done(); }, 100);
		},
		(error) => {
			MenuService.getRestaurantMenuList(Menu.restaurant);
			setTimeout(() => { NProgress.done(); }, 100);
		},
	);
};



