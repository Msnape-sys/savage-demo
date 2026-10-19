let thumbUp = document.getElementsByClassName("fa-thumbs-up");
let trash = document.getElementsByClassName("fa-trash");
/* Each thumbsUP click triggers a fetch req to express server   */
let thumbsDown= document.getElementsByClassName("fa-thumbs-down"); 



/* Every time the page refreshes, the loop runs again and adds eventListeners() */
Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const _id = this.parentNode.parentNode.childNodes[1].getAttribute('id')
        //console.log( `this message id is: ${id}`)
        // parseFloat converts the string into a number 
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText) // retrieves current count displayed on the webpage
        fetch('/messages/thumbs-up', { // the end point fetch sends thumbs up count to express server 
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'id':_id,
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
            
          })

        })
        .then(response => { // response contains info about the HTTP response( response.status, response.ok response.headers)
          if (response.ok) return response.json() // parses response body into a JS object 
        })
        .then(data => {
          console.log('server responded with data')
          window.location.reload(true)
        })
        .catch(error => {
  console.error('Thumbs-up request failed:', error)
})
      });
});

/*   Thumbs down PUT request */
Array.from(thumbsDown).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const _id = this.parentNode.parentNode.childNodes[1].getAttribute('id')
        //console.log(`the message id is ${id}`)
        // parseFloat converts the string into a number 
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText) // retrieves current count displayed on the webpage
        fetch('/messages/thumbs-down', { // the end point fetch sends thumbs up count to express server 
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'id': _id,
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
                  })
                })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
    window.location.reload()
          })
        });
  });
/* delete request */
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const _id = document.this.parentNode.parentNode.childNodes[1].getAttribute('id')
        //const name = this.parentNode.parentNode.childNodes[1].innerText
        //const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            '_id':_id
            //'name': name,
            //'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
