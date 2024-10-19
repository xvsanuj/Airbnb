// JavaScript for Bootstrap validation
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
          }

          form.classList.add('was-validated')
      }, false)
  })
})()
document.querySelector('form').addEventListener('submit', function(event) {
    const ratingInput = document.getElementById('rating');
    const commentInput = document.getElementById('comment');

    if (ratingInput.value < 1 || ratingInput.value > 5) {
        alert('Please select a rating between 1 and 5.');
        event.preventDefault();
    } else if (commentInput.value.trim() === '') {
        alert('Please enter a comment.');
        event.preventDefault();
    }
});