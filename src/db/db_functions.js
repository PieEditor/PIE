require("https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js")

var DATABASE = "http://127.0.0.1:5984";


function addUser(){//not operational
    var username = prompt("Enter user name");
    var passwd = prompt("Enter password");
    if (username && passwd){
        var newUser = {
            "_id": "org.couchdb.user:" + username,
            "name": username,
            "roles": [],
            "type": "user",
            "password": passwd
        }
    };

    $.ajax({
        type:"PUT",
        url:DATABASE + "/_users",
        contentType: "application/json",
        data: JSON.stringify(newUser)
    });
}


function createDB(){
    var dbname = prompt("Enter database name");
    if (dbname){
        $.ajax({
            type: "PUT",
            url: DATABASE + "/" + dbname,
            success: function(){
                DATABASE = "http://127.0.0.1:5984/" + dbname;
            } 
        })	
    } 
}

function deleteDB(){
    var doit = confirm("Do you want to delete the database '" + db + "'?");
    if (doit){
        $.ajax({
            type:"DELETE",
            url: DATABASE,
            success: function(){
                DATABASE = "http://127.0.0.1:5984";
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
            url: DATABASE,
            contentType: "application/json",
            data: JSON.stringify(task),
            success: function () {
                getTasks();
            }
        });
    }
}

function getTasks() {
    var db = DATABASE - "http://127.0.0.1:5984";
    $.ajax({
        url: DATABASE + "/_view/" + db,
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
    var doit = confirm("Do you really want to delete the task '" + task.task + "'?");
    if (doit) {
        $.ajax({
            type: "DELETE",
            url: DATABASE + "/" + task._id + "?rev=" + task._rev,
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
            url: DATABASE + "/" + task._id,
            contentType: "application/json",
            data: JSON.stringify(task),
            success: function () {
                getTasks();
            }
        });
    }
}