var DATABASE = "http://127.0.0.1:5984";
var current_db = "";

function addUser(){
    var username = prompt("Enter user name");
    var passwd = prompt("Enter password");
    if (username && passwd){
        var new_user = {
            "_id": "org.couchdb.user:" + username,
            "name": username,
            "roles": [],
            "type": "user",
            "password": passwd
        }
    };

    $.ajax({
        type:"POST",
        url:DATABASE + "/_users",
        contentType: "application/json",
        data: JSON.stringify(new_user)
    });
}


function createDB(){
    var dbname = prompt("Enter database name");
    if (dbname){
        $.ajax({
            type: "PUT",
            url: DATABASE + "/" + dbname,
            success: function(){
                current_db = dbname;
            } 
        })  
    } 
}

function deleteDB(){
    var doit = confirm("Do you want to delete the database '" + current_db + "'?");
    if (doit){
        $.ajax({
            type:"DELETE",
            url: DATABASE + "/" + current_db,
            success: function(){
                current_db = "";
            }
        })
    }
}

function addTask() {
    var desc = prompt("Enter a task description");
    if (desc) {
        var task = {
            "task": desc
        };

        $.ajax({
            type: "POST",
            url: DATABASE + "/" + current_db,
            contentType: "application/json",
            data: JSON.stringify(task),
            success: function () {
                getTasks();
            }
        });
    }
}

function getTasks() {
    
    $.ajax({
        type: "GET",
        url: DATABASE + "/" + current_db,
        success: function (data){
            var view = JSON.parse(data);
            var tasks = [];
            $(view.rows).each( function (index, item) {
                tasks.push (item.value);
            });
            displayTasks(tasks);
        }
    });
}

function displayTasks(tasks) {
    var html = "<table>";
    $(tasks).each( function (index, task) {
        var edit = "<input type='button' value='Edit' " +
        "onclick='editTask(" + JSON.stringify(task) + ")' />";
        var del = "<input type='button' value='Delete' " +
        "onclick='deleteTask(" + JSON.stringify(task) + ")' />";

        html += "<tr>";
        html += "<td>" + task.task + "</td>";
        html += "<td>" + edit + "</td>";
        html += "<td>" + del + "</td>";
        html += "</tr>";
    });
    html += "</table>";
            
    $('#tasks').empty();            
    $('#tasks').append(html);
}

function deleteTask(task) {
    var doit = confirm("Do you want to delete the task '" + task.task + "'?");
    if (doit) {
        $.ajax({
            type: "DELETE",
            url: DATABASE + "/" + current_db + "/" + task._id + "?rev=" + task._rev,
            success: function () {
                getTasks();
            }
        });
    }
}

function editTask(task) {
    var desc = prompt("New task description", task.task);
    if (desc) {
        task.task = desc;

        $.ajax({
            type: "PUT",
            url: DATABASE + "/" + current_db  + "/" + task._id,
            contentType: "application/json",
            data: JSON.stringify(task),
            success: function () {
                getTasks();
            }
        });
    }
}