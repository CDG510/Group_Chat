$(document).ready(function(){
            $("#container").hide()
              $('#textarea1').val('New Text');
                $('#textarea1').trigger('autoresize');
            //this is just for the textarea
            
            var user= prompt('Please Sign in with your Name');
            
            var socket = io.connect();          
            socket.emit('sign_in', {name: user});
            //send to server that a new user + info
            $("#container").show();
            //show the board
            socket.on('user_connected', function(data){
                $("#chatBoard").append("<div class='row'><p class='col s10'>" + data.message + "</p></div>");
                });
            //once connected, show add message to board
            
            socket.on("old_messages", function(data){
                //show previous messages if available
                for (messages in data.message) {
                    $("#chatBoard").append("<div class='row'><p class='col s10'>"+ data.message[messages] +"</p></div>");
                    }});
            
            //for new messages
            $("form").submit(function(){
                var newMessage = user + ": " + $("#messageData").val();
                socket.emit('send_message', {message: newMessage});
                return false;
                //take new message data
            });

            socket.on('new_message', function(data){
                $("#messageData").val('');
                $("#messageData").attr("placeholder", "Send a new message");
                //this is supposed to replace the text area
                $("#chatBoard").append("<div class='row'><p class='col s10'>" + data.messages + "</p></div>");
                });
              
            
        });
    