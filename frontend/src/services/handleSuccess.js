const handleSuccess = (response) => {
    const idToken = response.credential;

    // Send this token to your backend for verification
    fetch('/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from your backend
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};
