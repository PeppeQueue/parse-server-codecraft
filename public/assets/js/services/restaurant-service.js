function RestaurantService(){

}

RestaurantService.getRestaurantList = function(){
    var restaurantBiz = Parse.Object.extend("RestaurantBiz");
    var query = new Parse.Query(restaurantBiz);
    query.equalTo("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
    query.include("contact");
    query.include("address");
    NProgress.start();    

    query.find().then(
        function (results) {
            Restaurant.displayRestaurantList(results);
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function(error){
            Restaurant.displayRestaurantList([]);
            setTimeout(function () { NProgress.done(); }, 100);
        }
    );
}

RestaurantService.updateRestaurantState = function(restaurant,state){
    restaurant.set("active", state);
    restaurant.save();
}

RestaurantService.destroyRestaurant = function(restaurant){
    NProgress.start();
    restaurant.destroy().then(
        function (res) {            
            RestaurantService.getRestaurantList();
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function (error) {
            RestaurantService.getRestaurantList();
            setTimeout(function () { NProgress.done(); }, 100);
        }
    );
}

RestaurantService.loadCuisine = function(){
    var cuisine = Parse.Object.extend("WorldCuisine");
    var query = new Parse.Query(cuisine);
    query.ascending("code");
    NProgress.start();

    query.find().then(
        function (results) {
            Restaurant.displayCuisine(results);
            setTimeout(function () { NProgress.done(); }, 100);

        },
        function (error) {
            Restaurant.displayCuisine([]);
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

RestaurantService.loadServiceStyle = function(){
    var serviceStyle = Parse.Object.extend("RestaurantBizServiceStyle");
    var query = new Parse.Query(serviceStyle);
    query.ascending("code");
    NProgress.start();

    query.find().then(
        function (results) {
            Restaurant.displayServiceStyle(results);
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function (error) {
            Restaurant.displayServiceStyle([]);
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

RestaurantService.loadAmbienceStyle = function(){
    var ambienceStyle = Parse.Object.extend("RestaurantBizAmbienceStyle");
    var query = new Parse.Query(ambienceStyle);
    query.ascending("code");
    NProgress.start();

    query.find().then(
        function (results) {
            Restaurant.displayAmbienceStyle(results);
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function (error) {
            Restaurant.displayAmbienceStyle([]);
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

