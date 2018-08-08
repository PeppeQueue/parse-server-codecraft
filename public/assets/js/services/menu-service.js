function MenuService() {

}

MenuService.createMenu = function(name,description,note,restaurant){
    var RestaurantMenu = Parse.Object.extend("RestaurantMenu");
    var restaurantMenu = new RestaurantMenu();

    restaurantMenu.set('active', true);
    restaurantMenu.set('name', name);
    restaurantMenu.set('display', name);
    restaurantMenu.set('description', description);
    restaurantMenu.set('note', note);
    restaurantMenu.set("restaurant", { "__type": "Pointer", "className": "RestaurantBiz", "objectId": restaurant.id });
    restaurantMenu.set("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });

    NProgress.start();
    restaurantMenu.save(null).then(
            function (resMenu) {                
                restaurant.relation("menus").add(resMenu).save().then(
                    function(success){                           
                        MenuService.getRestaurantMenuList(restaurant); 
                        setTimeout(function () { NProgress.done(); }, 100); 
                    },
                    function(error){                            
                        MenuService.getRestaurantMenuList(restaurant); 
                        setTimeout(function () { NProgress.done(); }, 100); 
                    }                    
                );

            },
            function (error) {                    
                MenuService.getRestaurantMenuList(restaurant);                 
                setTimeout(function () { NProgress.done(); }, 100);
            }
        );
}

MenuService.getRestaurantMenuList = function(restaurant){
    var relation = restaurant.relation("menus");
    var query = relation.query();
    NProgress.start();
    query.find().then(
        function (menus) {
            Menu.displayMenuList(menus);
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function(error){
            Menu.displayMenuList([]);
            setTimeout(function () { NProgress.done(); }, 100);
        }
    );
}

MenuService.editMenu = function(menu,name,description,note){
    menu.set('active', true);
    menu.set('name', name);
    menu.set('display', name);
    menu.set('description', description);
    menu.set('note', note);    

    NProgress.start();
    menu.save().then(
        function (res) {
            setTimeout(function () { NProgress.done(); }, 100);
            MenuService.getRestaurantMenuList(Menu.restaurant);
        },
        function (error) {
            MenuService.getRestaurantMenuList(Menu.restaurant);
            setTimeout(function () { NProgress.done(); }, 100);
        }
    );
}

MenuService.updateMenuState = function(menu,state){
    menu.set("active", state);
    menu.save();
}

MenuService.destroyMenu = function(menu){
    NProgress.start();
    menu.destroy().then(
        function (res) {            
            MenuService.getRestaurantMenuList(Menu.restaurant);
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function (error) {
            MenuService.getRestaurantMenuList(Menu.restaurant);
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}