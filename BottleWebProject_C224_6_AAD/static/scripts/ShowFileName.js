document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('graphFile');
    const fileNameDisplay = document.getElementById('fileName');

    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function () {
            const fileName = this.files[0]?.name || 'No file selected';
            fileNameDisplay.textContent = `Selected: ${fileName}`;
        });
    }
});
