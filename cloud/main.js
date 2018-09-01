require("./functions/hello");

Parse.Cloud.beforeSave("RestaurantMenuItemGroup", function(request, response) {

    //check if this is a new or existing item
    if (!request.object.isNew()) {          
          response.success();
    } else { 
      
        var restaurantMenuItemGroup = Parse.Object.extend("RestaurantMenuItemGroup");
        var query = new Parse.Query(restaurantMenuItemGroup);
        query.select("code"); 
        query.descending("code"); 

        query.first().then(
            function(lastItemGroup) {
                //increase the code by 1
                var newId = lastItemGroup.get("code") + 1;
                request.object.set("code", newId); 
                response.success(); 
            }, 
            function (error){
                response.error(error);
            }
        );
    }

});

Parse.Cloud.beforeSave("Worker", function(request, response) {

    //check if this is a new or existing item
    if (!request.object.isNew()) {          
          response.success();
    } else { 
        var autoPin = Math.floor(Math.random() * 10) + ""+ Math.floor(Math.random() * 10)+""+Math.floor(Math.random() * 10)+
        Math.floor(Math.random() * 10)+""+Math.floor(Math.random() * 10)+""+Math.floor(Math.random() * 10);
        request.object.set("pin", autoPin); 
        response.success(); 
    }

});

