//
// Javascript/jQuery for making AJAX calls
//
$(document).ready(() => {

  //
  // Add a new burger
  //
  $("#add-burger").on("submit", function(event) {
    event.preventDefault();

    // Get the name of the new burger
    const aBurger= {
      burgerName: $("#burger").val().trim(),
    };

    // Send the POST request.
    $.ajax("/add", {
      type: "POST",
      data: aBurger
    }).then(
      function(res) {
        $("#burger").val("");
        console.log("Added a burger");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
  
  //
  // Devour a burger on button click
  //
  $(".devour").on("click", function(event) {
    event.preventDefault();

    // Find the "id" of this burger to devour
    const burgerId = $(this).attr("burgerId");
    const userName = $(`#${burgerId}`).val().trim();
    const aBurger= {
      devoured: true,
      userName: userName
    };
    
    if (userName.length > 0) {
      // Send the PUT request.
      $.ajax("/devour/" + burgerId, {
        type: "PUT",
        data: aBurger
      }).then(res => {
          console.log("burger id(" + burgerId + ") is eaten by " + userName);
          // Reload the page to get the updated list
          location.reload();
        })
        .catch(error => {
          console.log(error);
          // Hopefully still able to recover gracefully... 
          location.reload();
        });
    } else {
      alert('Please enter your name');
    }

  });
  
  //
  // Remove a burger on button click
  //
  $(".remove").on("click", function(event) {
    event.preventDefault();

    // Find the "id" of this burger to be removed
    const burgerId = $(this).attr("burgerId");
    const aBurger= {
      devoured: true
    };
    
    // Send the DELETE request.
    $.ajax("/remove/" + burgerId, {
      type: "DELETE",
      data: aBurger
    }).then(res => {
        console.log("burger id(" + burgerId + ") is removed");
        // Reload the page to get the updated list
        location.reload();
      })
      .catch(error => {
        console.log(error);
        // Hopefully still able to recover gracefully... 
        location.reload();
      });
  });
});
