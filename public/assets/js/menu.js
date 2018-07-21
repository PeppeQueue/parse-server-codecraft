function Menu() {

}

Menu.init = function () {
    Parse.initialize(Config.PARSE_APP_ID);
    Parse.serverURL = Config.PARSE_SERVER_URL;
    var currentUser = Parse.User.current();
    enableListItemClick();
    Menu.createDummaydata();
    Menu.registerInputEvents();

    $('#people').multiSelect();
    $('#newMenuItemGroupEnterDiv').hide();
    
    
    $('#fixedMenuItemCategoryDiv').html(Menu.getFixedMenuItemCatHtml());


    //menu item group related functions
    $('#addNewMenuItemGroup').click(Menu.clickAddNewMenuItemGroup);
    Menu.registerMenuItemGroupInputEvents();
    $('#createNewMenuItemGroupButton').click(Menu.clickAddNewMenuItemGroupButton);
    Menu.loadMenuItemGroups();
}

Menu.loadMenuItemGroups = function(){
    var restaurantMenuItemGroup = Parse.Object.extend("RestaurantMenuItemGroup");
    var query = new Parse.Query(restaurantMenuItemGroup);    
    NProgress.start();
    
    query.find().then(
        function (results) {

    var items = '';
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var id = object.id;
                
                var name = object.get("name");
                var display = object.get("display");
                	
                items += '<option  value=' + id + ' data-name=' + name 
                    + '>' + display +  '</option>';  
                            
               
            }
            $('#menuItemGroup').empty();
            //console.log(items);
            $('#menuItemGroup').append(items);
            
            setTimeout(function(){NProgress.done();},100); 

            
        },
        function (error) {
            console.log("error"); 
            setTimeout(function(){NProgress.done();},100);          

        }
    );
}

Menu.clickAddNewMenuItemGroup = function(event){
    event.preventDefault();
    if($('#newMenuItemGroupEnterDiv').is(':visible')){ 
        $('#newMenuItemGroupEnterDiv').hide();
    }else{
        $('#newMenuItemGroupEnterDiv').show();
    }
   
}

Menu.clickAddNewMenuItemGroupButton = function(event){
    
    event.preventDefault();
    var newMenuItemGroupNameText = $("#newMenuItemGroupName").val();
    if (newMenuItemGroupNameText == "") {
        $('#newMenuItemGroupName').blur();
    }else{
       
        var RestaurantMenuItemGroup = Parse.Object.extend("RestaurantMenuItemGroup");
        var restaurantMenuItemGroup = new RestaurantMenuItemGroup();
        restaurantMenuItemGroup.set("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
        restaurantMenuItemGroup.set("name",newMenuItemGroupNameText);
        restaurantMenuItemGroup.set("description",newMenuItemGroupNameText);
        restaurantMenuItemGroup.set("display",newMenuItemGroupNameText);
        restaurantMenuItemGroup.set("note",newMenuItemGroupNameText);
        NProgress.start();
        
        restaurantMenuItemGroup.save(null).then(
            function (res) {
                console.log("saved");  
                setTimeout(function(){NProgress.done();},100);
                $("#newMenuItemGroupName").val("");
                $('#newMenuItemGroupEnterDiv').hide();
                Menu.loadMenuItemGroups();
            },
            function (error) {
                console.log("error"); 
                setTimeout(function(){NProgress.done();},100);

            }
        );
    }
}

Menu.registerMenuItemGroupInputEvents = function(){
    $('#newMenuItemGroupName').blur(function () {
        if ($(this).val().length == '') {
            $(this).siblings('span.error').text('Please type group name').fadeIn().parent('.form-group').addClass('hasError');
            
        } else {
            $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
            
        }
    });
}

Menu.registerInputEvents = function(){
    $('input').blur(function () {

        if ($(this).hasClass('create-menuName')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type menu name').fadeIn().parent('.form-group').addClass('hasError');
                
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                
            }
        }

        if ($(this).hasClass('create-menuDes')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type description').fadeIn().parent('.form-group').addClass('hasError');
                
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                
            }
        }

        if ($(this).hasClass('create-menuNote')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type note').fadeIn().parent('.form-group').addClass('hasError');
                
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                
            }
        }
    });
}

Menu.createDummaydata = function(){
    var items = '';
    for (var i = 0; i < 2; i++) {
        var id = i;
        var name = "Menu" + i;
        items += '<li class="list-group-item"  data-containerID=' + id
            + ' data-id=' + id + ' data-role-id=' + id
            + ' data-name="' + name
            + '"><input type="checkbox" class="checkboxes">' + name
            + '</li>';
    }
    $('#menuList').empty();
    $('#menuList').append(items);
    
    var menuItems = '';
    for (var i = 0; i < 5; i++) {
        var id = i;
        var name = "MenuItem" + i;
        menuItems += '<li class="list-group-item"  data-containerID=' + id
            + ' data-id=' + id + ' data-role-id=' + id
            + ' data-name="' + name
            + '"><input type="checkbox" class="checkboxes">' + name
            + '</li>';
    }
    $('#menuItemList').empty();
    $('#menuItemList').append(menuItems);

    var menuItems2 = '';
    for (var i = 5; i < 10; i++) {
        var id = i;
        var name = "MenuItem" + i;
        menuItems2 += '<li class="list-group-item"  data-containerID=' + id
            + ' data-id=' + id + ' data-role-id=' + id
            + ' data-name="' + name
            + '"><input type="checkbox" class="checkboxes">' + name
            + '</li>';
    }
    $('#menuItemList2').empty();
    $('#menuItemList2').append(menuItems2);
            }
                
Menu.getFixedMenuItemCatHtml = function(){
    return '<div class="col-12 col-sm-12" style="background:#465f75;min-height: 60px;">'+
    '<div class="row">'+
      '<div class="col-6 col-sm-4">'+
        '<form>'+
          '<div class="form-group">'+
            '<label for="name" class="menu-item-lbl">Calori Range</label>'+
            '<span class="error"></span>'+
          '</div>'+
        '</form>'+
      '</div>'+
      '<div class="col-4 col-sm-4">'+
        '<form>'+
          '<div class="form-group">'+
            '<label for="name"></label>'+
            '<select class="form-control" id="menuItemCategory6" name="menuItemCategory6">'+
              '<option value="1">Select</option>'+
              '<option value="2">Food</option>'+
              '<option value="3">Beverage</option>'+
            '</select>'+
          '</div>'+
        '</form>'+
      '</div>'+
      '<div class="col-2 col-sm-4">'+
      '</div>'+
                
    '</div>'+
  '</div>'
}