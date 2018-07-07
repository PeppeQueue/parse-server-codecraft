function Menu() {

}

Menu.init = function () {
    Parse.initialize(Config.PARSE_APP_ID);
    Parse.serverURL = Config.PARSE_SERVER_URL;
    var currentUser = Parse.User.current();

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
    enableListItemClick();
}