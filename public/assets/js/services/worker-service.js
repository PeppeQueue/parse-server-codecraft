function WorkerService() {

}

WorkerService.getWorkerListByRestaurant = function(restaurant){

    var relation = restaurant.relation("workers");
    var query = relation.query();
    query.include("restaurant");
    query.descending("createdAt");
    NProgress.start();
    query.find().then(
        function (workers) {
            Worker.displayWorkerList(workers);
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function(error){
            Worker.displayWorkerList([]);
            setTimeout(function () { NProgress.done(); }, 100);
        }
    );
}

WorkerService.getWorkerList = function(currentUser){
    var worker = Parse.Object.extend("Worker");
    var query = new Parse.Query(worker);
    query.equalTo("for", { "__type": "Pointer", "className": "_User", "objectId": currentUser.id });
    query.include("restaurant");
    query.descending("createdAt");

    NProgress.start();
    query.find().then(
        function (workers) {
            Worker.displayWorkerList(workers);
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function(error){
            Worker.displayWorkerList([]);
            setTimeout(function () { NProgress.done(); }, 100);
        }
    );
}

WorkerService.updateWorkerState = function(worker,state){
    worker.set("active", state);
    worker.save();
}

WorkerService.destroyWorker = function(worker){
    NProgress.start();
    worker.destroy().then(
        function (res) {            
            if(Worker.restaurant != null){
                WorkerService.getWorkerListByRestaurant(Worker.restaurant);
            }else{
            WorkerService.getWorkerList(Parse.User.current());
            }
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function (error) {
            if(Worker.restaurant != null){
                WorkerService.getWorkerListByRestaurant(Worker.restaurant);
            }else{
            WorkerService.getWorkerList(Parse.User.current());
            }
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

WorkerService.editWorker = function(worker, name, phone, email,restaurant){
    worker.set('active', true);
    worker.set('name', name);
    worker.set('phone', phone);
    worker.set('email', email);
    worker.set("restaurant", { "__type": "Pointer", "className": "RestaurantBiz", "objectId": restaurant.id });  

    NProgress.start();
    worker.save().then(
        function (worker) {
            restaurant.relation("workers").add(worker).save().then(
                function(success){                           
                    setTimeout(function () { NProgress.done(); }, 100);
                    if(Worker.restaurant != null){
                        WorkerService.getWorkerListByRestaurant(Worker.restaurant);
                    }else{
                        WorkerService.getWorkerList(Parse.User.current());
                    }
                },
                function(error){                            
            setTimeout(function () { NProgress.done(); }, 100);
                    if(Worker.restaurant != null){
                        WorkerService.getWorkerListByRestaurant(Worker.restaurant);
                    }else{
            WorkerService.getWorkerList(Parse.User.current());
                    }
                }                    
            );
           
        },
        function (error) {
            WorkerService.getWorkerList(Parse.User.current());
            setTimeout(function () { NProgress.done(); }, 100);
        }
    );
}

WorkerService.getRestaurantList = function(){
    var restaurantBiz = Parse.Object.extend("RestaurantBiz");
    var query = new Parse.Query(restaurantBiz);
    query.equalTo("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
    query.descending("createdAt");    
    NProgress.start();    

    query.find().then(
        function (results) {
            Worker.displayRestaurantList(results);
            setTimeout(function () { NProgress.done(); }, 100);
        },
        function(error){
            Worker.displayRestaurantList([]);
            setTimeout(function () { NProgress.done(); }, 100);
        }
    );
}

WorkerService.createWorker = function(name, phone, email,restaurant){
    var WorkerBiz = Parse.Object.extend("Worker");
    var workerBiz = new WorkerBiz();

    workerBiz.set('active', true);
    workerBiz.set('name', name);
    workerBiz.set('phone', phone);
    workerBiz.set('email', email);  
    workerBiz.set('pin', "34634");    //TODO Remove 
    workerBiz.set("restaurant", { "__type": "Pointer", "className": "RestaurantBiz", "objectId": restaurant.id });
    workerBiz.set("for", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });

    NProgress.start();
    workerBiz.save(null).then(
            function (worker) {     
                restaurant.relation("workers").add(worker).save().then(
                    function(success){                           
                        setTimeout(function () { NProgress.done(); }, 100);
                        if(Worker.restaurant != null){
                            WorkerService.getWorkerListByRestaurant(Worker.restaurant);
                        }else{
                WorkerService.getWorkerList(Parse.User.current()); 
                        }
                        
                    },
                    function(error){                            
                setTimeout(function () { NProgress.done(); }, 100);
                        if(Worker.restaurant != null){
                            WorkerService.getWorkerListByRestaurant(Worker.restaurant);
                        }else{
                            WorkerService.getWorkerList(Parse.User.current());
                        }
                    }                    
                );           
                
            },
            function (error) {                    
                WorkerService.getWorkerList(Parse.User.current());                 
                setTimeout(function () { NProgress.done(); }, 100);
            }
        );
}