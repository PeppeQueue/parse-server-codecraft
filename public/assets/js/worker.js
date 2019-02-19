function Worker() {

}
Worker.workers = [];
Worker.restaurants = [];
Worker.restaurant= null;

Worker.init = function (restaurant) {

    Parse.initialize(Config.PARSE_APP_ID);
    Parse.serverURL = Config.PARSE_SERVER_URL;
    var currentUser = Parse.User.current();
    $('#workerView').show();
    $('#workerCreateView').hide();

    if(restaurant == undefined){
        WorkerService.getWorkerList(currentUser);
        WorkerService.getRestaurantList();
        Worker.restaurant = null;
        $('#workerSelectedRestaurantName').html("");
    }else{
        Worker.restaurant = restaurant;
        WorkerService.getWorkerListByRestaurant(restaurant);
        $('#workerSelectedRestaurantName').html(restaurant.get("name"));

    WorkerService.getRestaurantList();
    }

    
    
    
    $('#worker-container').show();
    $('#addWorkerIcon').click(Worker.clickAddNewWorkerButton);
    $("#createWorkerButton").unbind('click');
    $('#createWorkerButton').click(Worker.createNewWorker);

    $('#workerCreateViewBackButton').click(Worker.goBackToWorkerView);

    

    Worker.registerInputEvents();
    
}

Worker.goBackToWorkerView = function(event){
    event.preventDefault();
    $('#workerCreateView').hide();
    $('#workerView').show();
}

Worker.displayRestaurantList = function (results) {
    var items = '';
    for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var id = object.id;

        var name = object.get("name");        
        Worker.restaurants.push(object);      

        items += '<option  value=' + id + ' data-name=' + name
            + '>' + name + '</option>';

    }
    $('#workerRestaurant').empty();
    $('#workerRestaurant').append(items);

}

Worker.getRestaurant = function (id) {
    for (var i = 0; i < Worker.restaurants.length; i++) {
        var restaurant = Worker.restaurants[i];
        if (restaurant.id == id) {
            return restaurant;
        }
    }
}

Worker.createNewWorker = function(event){
    event.preventDefault();    
    var name = $("#workerName").val();
    var phone = $("#workerPhone").val();
    var email = $("#workerEmail").val();
    var restaurantId = $("#workerRestaurant").val();
    var restaurant = Worker.getRestaurant(restaurantId);

    if (name == "" || phone == "" || email == "") {
        $('.create-workerName, .create-workerPhone, .create-workerEmail').blur();
    } else {        
        WorkerService.createWorker(name, phone, email,restaurant);
    }
}


Worker.showPin = function(e){    
    e.preventDefault();
    var target = $( e.target );    
    var parent = target.parent();
    parent.find(".worker-pin").toggle();
   
    
}

Worker.clickAddNewWorkerButton = function(event){
    event.preventDefault();
    $("#workerView").hide();
    $("#workerCreateView").show();   
    $('#createWorkerButton').show();
    $('#editWorkerButton').hide();
    
    $("#workerName").val("");
    $("#workerPhone").val("");
    $("#workerEmail").val("");

    if(Worker.restaurant != null){
        $("#workerRestaurant").val(Worker.restaurant.id);        
        $("#workerRestaurant").prop("disabled", true);      
    }else{
        $("#workerRestaurant").prop("disabled", false);  
    }
}

Worker.displayWorkerList = function (results) {
    
    $('#workerView').show();
    $('#workerCreateView').hide();
    Worker.workers = [];
    var items = '';
    for (var i = 0; i < results.length; i++) {
        var object = results[i];
        
        var id = object.id;
        var name = object.get("name");
        var phone = object.get("phone");
        var email = object.get("email");    
        var pin = object.get("pin");          
        var active = object.get("active");
        var restaurant = object.get("restaurant").get("name");

        Worker.workers.push(object);
        console.log(Worker.workers)   ;
        var checked = "";
        if (active) {
            checked = "checked"
        } else {
            checked = "";
        }


        items += '<li class="list-group-item"'
            + '"> <label class="switch pull-right"><input type="checkbox"  class="worker-active" data-id=' + id + '  ' + checked + '>  <span class="slider round"></span> </label>'
            + '<div class="workerName">' + name + '</div>'
            + '<div>' + restaurant + '</div>'
            + '<div> <p>' + " " + '</p></div>'
            + '<div>' + phone + '</div>'
            + '<div>' + email + '</div>'             
            + '<div> <p>' + " " + '</p></div>'
            + '<div> <span class="pinButton">PIN</span>  <span class="worker-pin" style="display: none" >'+ pin+'</span></div>'

            + '<div class="action-items-menu">'           
            + '</a><a href="" rel="tooltip" title="Edit" data-id=' + id + '>'
            + '<i class="fas fa-edit fa-lg" ></i>'
            + '</a> <a href=""  rel="tooltip" title="Delete" data-id=' + id + '>'
            + '<i class="fa fa-trash fa-lg" ></i></a>'
            + '</div>'
            + '</li>';
    }
    $('#workerList').empty();
    $('#workerList').append(items);
    $('.worker-active').change(Worker.onChangeCheckBox);
    $(".pinButton").click(Worker.showPin);
    $('#worker .action-items-menu a').click(Worker.selectOption);
}

Worker.onChangeCheckBox = function(){
    var id = $(this).attr("data-id");
    var worker = Worker.getSelectedWorker(id);
    if (!$(this).is(':checked')) {
        WorkerService.updateWorkerState(worker, false);
    } else {
        WorkerService.updateWorkerState(worker, true);
    }
}
  
Worker.getSelectedWorker = function (id) {
    
    for (var i = 0; i < Worker.workers.length; i++) {
        var worker = Worker.workers[i];
        if (worker.id == id) {
            return worker;
        }
    }
}

Worker.selectOption = function(event){
    event.preventDefault();
    var title = $(this).attr('title');
    var id = $(this).attr('data-id');
    if (title == "Edit") {
        Worker.selectWorker(id);
    }   
    if (title == "Delete") {
        Worker.destroyWorker(id);
    }
}

Worker.selectWorker = function(id){
    var worker = Worker.getSelectedWorker(id);   
    $("#workerView").hide();
    $("#workerCreateView").show();
   
    $("#workerId").val(worker.id);
    $("#workerName").focus();
    $("#workerName").val(worker.get("name"));
    $("#workerPhone").focus();
    $("#workerPhone").val(worker.get("phone"));
    $("#workerEmail").focus();
    $("#workerEmail").val(worker.get("email"));
    $("#workerRestaurant").val(worker.get("restaurant").id);
    $('#createWorkerButton').hide();
    if(Worker.restaurant != null){        
        $("#workerRestaurant").prop("disabled", true);      
    }else{
        $("#workerRestaurant").prop("disabled", false);  
    }
    $('#editWorkerButton').show();
    $('#editWorkerButton').click(Worker.editWorker);
}

Worker.editWorker = function (event) {
    event.preventDefault();
    var name = $("#workerName").val();
    var phone = $("#workerPhone").val();
    var email = $("#workerEmail").val();
    var restaurantId = $("#workerRestaurant").val();
    var restaurant = Worker.getRestaurant(restaurantId);
    if (name == "" || phone == "" || email == "") {
        $('.create-workerName, .create-workerPhone, .create-workerEmail').blur();
    } else {
        var id = $("#workerId").val();
        var worker = Worker.getSelectedWorker(id);
        WorkerService.editWorker(worker, name, phone, email,restaurant);
    }
}

Worker.destroyWorker = function (id) {
    swal({
        title: "Are you sure?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                var worker = Worker.getSelectedWorker(id);
                WorkerService.destroyWorker(worker);
            } else {

            }
        });
}

Worker.registerInputEvents = function () {
    $('input').blur(function () {

        if ($(this).hasClass('create-workerName')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type worker name').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
            }
        }

        if ($(this).hasClass('create-workerPhone')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type worker phone').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
            }
        }

        if ($(this).hasClass('create-workerEmail')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type worker email').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
            }
        }


    });
}