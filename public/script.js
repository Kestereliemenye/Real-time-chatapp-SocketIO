// const { text } = require("express");

(function(){
    const app = document.querySelector(".app")
    const socket = io()

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        let username = app.querySelector(".join-screen #username ").value
        if(username.length === 0){
            return alert("What is your name");
        } else{
            socket.emit("newuser", username)
            uname = username;
            app.querySelector(".join-screen").classList.remove("active")
            app.querySelector(".chat-screen").classList.add("active")
        }
     
    })

    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector(".chat-screen .typebox #message-input").value
        if(message.length === 0){
            return;
        } else{
            renderMessage("my",{
                username: uname,
                text:message
            })
            socket.emit("chat",{
                username: uname,
                text:message
            })
            app.querySelector(".chat-screen .typebox #message-input").value = "";
        }

    })

    

    app.querySelector("#exit-btn").addEventListener("click", function(){
        const answer = confirm("Are you sure")
        if(answer){
            socket.emit("exituser", uname)
            window.location.href = window.location.href
        } else{
            return;
        }

    });

    socket.on("update", function(update){
        renderMessage("update", update)
    })
    socket.on("chat", function(message){
        renderMessage("other", message)
    })
    socket.on("typing", function(message){
        renderMessage("type", message)
    })

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type === "my"){
            let el = document.createElement("div")
            el.setAttribute("class", "message")
            el.setAttribute("id", "my-message")
            el.innerHTML = `
            <div>
            <div class="name">You</div>
            <div class="text">${message.text}</div> 
            </div>
            `;
            messageContainer.appendChild(el)
        } else if(type === "other"){
            let el = document.createElement("div")
            el.setAttribute("class", "message")
            el.setAttribute("id", "other-message")
            el.innerHTML = `
            <div>
            <div class="name">${message.username}</div>
            <div class="text">${message.text}</div> 
            </div>
            `;
            messageContainer.appendChild(el)
        } else if(type === "update"){
            let el = document.createElement("div")
            el.setAttribute("class", "message")
            el.setAttribute("id", "my-message")
            el.innerText = message ;
            messageContainer.appendChild(el)
        }
         else if(type === "type"){
             document.getElementById("message-input").addEventListener("keydown", function(){
                let el = document.createElement("div")
                el.setAttribute("class", "message")
                el.setAttribute("id", "my-message")
                el.textContent = "typing" ;
            
                messageContainer.appendChild(el)
            })
        }

        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    };

        
    
    
    
})();

