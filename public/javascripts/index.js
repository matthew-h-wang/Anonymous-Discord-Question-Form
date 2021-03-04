var messageId = null;

var currentlyFetching = false;

const linkButtons = document.getElementsByClassName("link-button")
const deleteButtons = document.getElementsByClassName("delete-button")

function handleRedirect(){
   window.open('/discordRedirect' + (messageId ? "?" + new URLSearchParams({"messageId": messageId}) : ""),'_blank')
}

for (let i = 0; i < linkButtons.length; i++) {
   linkButtons.item(i).onclick = handleRedirect;
}

function updateMessageId(id){

   messageId = (id) ? id : null
   if (messageId !== null) {
      for (let i = 0; i < linkButtons.length; i++) {
         linkButtons.item(i).classList.remove('hidden')
      }
      document.getElementById("MessageId").textContent = `Editing Question - Discord Message ID: ${messageId}`
      document.getElementById("MessageId").classList.remove("hidden");
      document.getElementById("Subject").disabled = true;
      document.getElementById("Submit").classList.add('hidden');
      document.getElementById("Clear").classList.add('hidden');
      document.getElementById("Edit").classList.remove('hidden');
      document.getElementById("NewQuestion").classList.remove('hidden');
      for (let i = 0; i < deleteButtons.length; i++) {
         deleteButtons.item(i).classList.remove('hidden')
      }
   }
   else {
      for (let i = 0; i < linkButtons.length; i++) {
         linkButtons.item(i).classList.add('hidden')
      }
      document.getElementById("MessageId").classList.add("hidden");
      document.getElementById("Subject").disabled = false;
      document.getElementById("Submit").classList.remove('hidden');
      document.getElementById("Clear").classList.remove('hidden');
      document.getElementById("Edit").classList.add('hidden');
      document.getElementById("NewQuestion").classList.add('hidden');
      for (let i = 0; i < deleteButtons.length; i++) {
         deleteButtons.item(i).classList.add('hidden')
      }
   }
}

//If urlParams with messageId exist, start with them.
updateMessageId((new URLSearchParams(window.location.search)).get('messageId'));


function startNewMessage(){
   updateMessageId(null);
   window.history.pushState({"messageId":null},"", "/");
}

document.getElementById("NewQuestion").onclick = startNewMessage;



//handle Forward/Back 
window.onpopstate = function(event) {
   updateMessageId(event.state.messageId);
   closeModalDialog();
}

//handling modal display
const dialogControl = document.getElementById("modal-control")
const dialogTitle = document.getElementById("dialog-title")
const dialogContent = document.getElementById("dialog-content")

function displayModalDialog(title, content){
   dialogControl.checked = true;
   dialogTitle.innerHTML = title;
   dialogContent.innerHTML = content;
}

function closeModalDialog(){
   dialogControl.checked = false;
}

closeModalDialog();

//Handle form submission

async function handleErrors(response) {
   if (!response.ok) {
       throw Error(await response.text() || response.statusText);
   }
   return response;
}

function handlePostSuccess(data){
   updateMessageId(data.id);
   window.history.pushState({"messageId":data.id},"", "?messageId="+data.id);
   displayModalDialog("Question posted!",  "Close to edit post.");
 }

function handlePatchSuccess(data){
   displayModalDialog("Question edited!", "Close to re-edit post.")
}

function handleFailure(error) {
   displayModalDialog("Something went wrong!", `Error message: ${error}`)
   console.log(error);
 }

 document.querySelector('form').addEventListener('submit', (e) => {
   const formData = new FormData(e.target);
   e.preventDefault(); //don't refresh the page.
   if (currentlyFetching)
      return;
   currentlyFetching = true;
   const post_or_patch = !(messageId);
   
   const request_query = "/question" + (post_or_patch ? "" : ("?" + new URLSearchParams({"messageId": messageId})))
   const request_params = {
      method: post_or_patch ? 'POST' : 'PATCH',
      body: formData // body data type must match "Content-Type" header
   }
   const successHandler = post_or_patch ? handlePostSuccess : handlePatchSuccess
   displayModalDialog(post_or_patch ? "Sending question to server..." : "Editing question on server...", 
                      post_or_patch ? "Once posted, a link will be displayed." : "Wait for update to conclude.")
                      
   fetch(request_query, request_params).then(handleErrors)
   .then(response => response.json())
   .then(successHandler)
   .catch(handleFailure)
   .finally(x => {
      currentlyFetching = false;
   });
   

});

function handleDeleteSuccess(){
   updateMessageId(null);
   window.history.pushState({"messageId":null},"", "/");
   displayModalDialog("Question deleted!",  "Close to write a new question.");
 }

function handleDelete(){
   {
      if (currentlyFetching)
         return;
      //Make double confirmation with modal
      const deleteConfirmationTitle = "CONFIRM DELETE QUESTION";
      if ((!dialogControl.checked)
       || (dialogTitle.textContent !== deleteConfirmationTitle)
      ){
         displayModalDialog(deleteConfirmationTitle, "Are you sure you want to delete this question from the Discord Channel?");
         return;
      }
      currentlyFetching = true;
      const request_query = "/question" + "?" + new URLSearchParams({"messageId": messageId});
      const request_params = {
         method: 'DELETE',
      }

      displayModalDialog("Deleting question on server...", "Wait for update to conclude.")

      fetch(request_query, request_params).then(handleErrors)
      // .then(response => response.json())
      .then(handleDeleteSuccess)
      .catch(handleFailure)
      .finally(x => {
         currentlyFetching = false;
      });

   };
}

for (let i = 0; i < deleteButtons.length; i++) {
   deleteButtons[i].onclick = (e) => handleDelete();
}
