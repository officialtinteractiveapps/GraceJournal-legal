
let bugCounters = {};
let friendCounter = 0;

// Handle radio button changes for bug reporting
document.addEventListener('change', function(e) {
    if (e.target.type === 'radio' && e.target.name.endsWith('-bug')) {
        const section = e.target.name.replace('-bug', '');
        const bugForm = document.getElementById(section + '-bug-form');

        if (e.target.value === 'yes') {
            bugForm.style.display = 'block';
            if (!bugCounters[section]) {
                bugCounters[section] = 0;
                addBugReport(section);
            }
        } else {
            bugForm.style.display = 'none';
        }
    }

    // Handle recommendation changes
    if (e.target.name === 'recommend-grace') {
        const friendReferral = document.getElementById('friendReferral');
        if (e.target.value === 'definitely' || e.target.value === 'probably') {
            friendReferral.style.display = 'block';
            if (friendCounter === 0) {
                addFriendForm();
            }
        } else {
            friendReferral.style.display = 'none';
        }
    }
});

// Handle file uploads
function setupFileUpload(fileInput) {
    const wrapper = fileInput.closest('.file-input-wrapper');
    const preview = wrapper.querySelector('.file-preview') || createFilePreview(wrapper);

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            showFilePreview(preview, file, fileInput);
        } else {
            hideFilePreview(preview);
        }
    });
}

function createFilePreview(wrapper) {
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    preview.innerHTML = `
                <img style="display: none;">
                <div class="file-info">
                    <span class="file-name"></span>
                    <button type="button" class="remove-file-btn" onclick="removeFile(this)">Remove</button>
                </div>
            `;
    wrapper.appendChild(preview);
    return preview;
}

function showFilePreview(preview, file, fileInput) {
    const img = preview.querySelector('img');
    const fileName = preview.querySelector('.file-name');

    fileName.textContent = file.name;
    preview.style.display = 'block';

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        img.style.display = 'none';
    }

    // Store reference to the input for removal
    preview.querySelector('.remove-file-btn').fileInput = fileInput;
}

function hideFilePreview(preview) {
    preview.style.display = 'none';
    const img = preview.querySelector('img');
    img.src = '';
    img.style.display = 'none';
}

function removeFile(button) {
    const fileInput = button.fileInput;
    const preview = button.closest('.file-preview');

    // Clear the file input
    fileInput.value = '';

    // Hide the preview
    hideFilePreview(preview);
}

function addBugReport(section) {
    if (!bugCounters[section]) bugCounters[section] = 0;
    bugCounters[section]++;

    const bugReports = document.getElementById(section + '-bug-reports');
    const bugId = section + '-bug-' + bugCounters[section];

    const bugItem = document.createElement('div');
    bugItem.className = 'bug-item';
    bugItem.innerHTML = `
                <button type="button" class="bug-remove" onclick="removeBugReport('${bugId}', '${section}')">&times;</button>
                <div class="form-group" style="margin-bottom: 12px;">
                    <label for="${bugId}-what">What's the Bug?</label>
                    <textarea id="${bugId}-what" name="${bugId}-what" placeholder="Describe what went wrong..." required></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                    <label for="${bugId}-where">Where is the Bug?</label>
                    <textarea id="${bugId}-where" name="${bugId}-where" placeholder="Where in the app did this happen?" required></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="${bugId}-picture">Picture (Optional)</label>
                    <div class="file-input-wrapper">
                        <input type="file" id="${bugId}-picture" name="${bugId}-picture" accept="image/*">
                        <label for="${bugId}-picture" class="file-input-label">Choose File</label>
                    </div>
                </div>
            `;
    bugItem.id = bugId;

    bugReports.appendChild(bugItem);

    // Setup file upload for the new input
    const fileInput = bugItem.querySelector('input[type="file"]');
    setupFileUpload(fileInput);
}

function removeBugReport(bugId, section) {
    const bugItem = document.getElementById(bugId);
    if (bugItem) {
        bugItem.remove();
    }

    // If no more bugs, hide the form
    const bugReports = document.getElementById(section + '-bug-reports');
    if (bugReports.children.length === 0) {
        const bugForm = document.getElementById(section + '-bug-form');
        bugForm.style.display = 'none';
        // Uncheck the "Yes" radio button
        const yesRadio = document.getElementById(section + '-bug-yes');
        if (yesRadio) yesRadio.checked = false;
        // Check the "No" radio button
        const noRadio = document.getElementById(section + '-bug-no');
        if (noRadio) noRadio.checked = true;
    }
}

function addFriendForm() {
    friendCounter++;
    const friendForms = document.getElementById('friend-forms');
    const friendId = 'friend-' + friendCounter;

    const friendItem = document.createElement('div');
    friendItem.className = 'friend-item';
    friendItem.innerHTML = `
                <button type="button" class="friend-remove" onclick="removeFriendForm('${friendId}')">&times;</button>
                <div class="friend-inputs">
                    <div>
                        <label for="${friendId}-name">Friend's Name</label>
                        <input type="text" id="${friendId}-name" name="${friendId}-name" placeholder="Friend's name" required>
                    </div>
                    <div>
                        <label for="${friendId}-email">Friend's Email</label>
                        <input type="email" id="${friendId}-email" name="${friendId}-email" placeholder="friend@example.com" required>
                    </div>
                </div>
            `;
    friendItem.id = friendId;

    friendForms.appendChild(friendItem);
}

function removeFriendForm(friendId) {
    const friendItem = document.getElementById(friendId);
    if (friendItem) {
        friendItem.remove();
    }

    // If no more friends, hide the referral section
    const friendForms = document.getElementById('friend-forms');
    if (friendForms.children.length === 0) {
        const friendReferral = document.getElementById('friendReferral');
        friendReferral.style.display = 'none';
        // Uncheck positive recommendation radio buttons
        const recommendRadios = document.querySelectorAll('input[name="recommend-grace"]');
        recommendRadios.forEach(radio => {
            if (radio.value === 'definitely' || radio.value === 'probably') {
                radio.checked = false;
            }
        });
    }
}

document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    const form = this;

    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Create FormData from the form
    const formData = new FormData(form);

    // Submit to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                // Success - hide form and show thank you
                form.style.display = 'none';
                const thankYou = document.getElementById('thankYou');
                thankYou.style.display = 'block';
                thankYou.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error('Form submission failed with status: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Submission error:', error);
            // Reset button and show error
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('There was an error submitting your feedback. Please try again.');
        });
});


