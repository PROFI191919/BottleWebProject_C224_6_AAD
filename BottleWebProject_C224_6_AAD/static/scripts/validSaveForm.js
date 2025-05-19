document.getElementById('saveForm').addEventListener('submit', function (event) {
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');

    let valid = true;
    usernameError.textContent = '';
    emailError.textContent = '';

    if (!username.value.trim()) {
        usernameError.textContent = 'Name is required.';
        valid = false;
    }

    if (!email.value.trim()) {
        emailError.textContent = 'Email is required.';
        valid = false;
    } else {
        const emailPattern = /^(?=[a-zA-Z0-9])(?!.*\.\.)[a-zA-Z0-9_.-]{2,64}@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            valid = false;
        }
    }

    if (!valid) {
        event.preventDefault(); // Не отправлять форму
    }
});
