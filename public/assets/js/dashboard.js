function Dashboard() {

}

Dashboard.init = function () {
	Parse.initialize(Config.PARSE_APP_ID);
	Parse.serverURL = Config.PARSE_SERVER_URL;
	const currentUser = Parse.User.current();
	$('.main').hide();
	$('#restaurant-container').show();

	if (currentUser) {
		console.log(JSON.stringify(currentUser));
		$('#usernameLabel').html(`${currentUser.get('name')}<span class='caret'></span>`);
	} else {
		window.location.href = '/';
	}
	$('#logoutLink').click(Dashboard.clickLogoutLink);
	Dashboard.initConfigurations();
};

Dashboard.clickLogoutLink = function () {
	Parse.User.logOut().then(() => {
		const currentUser = Parse.User.current(); // this will now be null
		console.log(currentUser);
		window.location.href = '/';
	});
};

Dashboard.initConfigurations = function () {
	Parse.Config.get().then((config) => {
		const dashboardMessage = config.get('dashboardMessage');
		const defaultRestaurantImageUrl = config.get('defaultRestaurantImage');
		localStorage.setItem('defaultRestaurantImageUrl', defaultRestaurantImageUrl);
		const defaultMenuItemImageUrl = config.get('defaultMenuItemImage');
		localStorage.setItem('defaultMenuItemImageUrl', defaultMenuItemImageUrl);
		const text = '';
		$('#dashboardMessage').text(dashboardMessage);
		const jsArray = config.get('fixedRestaurantMenuItemCats');
		console.log(jsArray.length);
		for (let i = 0; i < jsArray.length; i++) {
			const obj = jsArray[i];
			console.log(obj.class);
		}
	}, (error) => {

	});
};
