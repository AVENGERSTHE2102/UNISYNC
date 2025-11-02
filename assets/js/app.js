document.addEventListener('DOMContentLoaded', function () {
    // --- Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname.split('/').pop();

    // Set active class for current page in navigation
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // Hamburger menu toggle for mobile
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }

    // --- Generic Filter Function ---
    /**
     * Filters a list of cards based on a selected category/type.
     * @param {HTMLElement} filterElement - The select element used for filtering.
     * @param {string} cardSelector - CSS selector for the cards to be filtered.
     * @param {string} dataAttribute - The data attribute on the cards (e.g., 'data-event-type').
     */
    function applyFilter(filterElement, cardSelector, dataAttribute) {
        if (filterElement) {
            const cards = document.querySelectorAll(cardSelector);
            filterElement.addEventListener('change', () => {
                const selectedValue = filterElement.value;

                cards.forEach(card => {
                    const cardValue = card.getAttribute(dataAttribute);
                    if (selectedValue === 'all' || selectedValue === cardValue) {
                        card.style.display = card.tagName === 'DIV' ? 'flex' : 'block'; // Maintain original display type
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }

    // --- Page Specific Logic ---

    // Events Page Filter
    applyFilter(document.getElementById('event-type'), '.event-card', 'data-event-type');

    // Mentorship Page Filter
    applyFilter(document.getElementById('mentor-expertise'), '.mentor-card', 'data-expertise');

    // Jobs Page Filter and Details Toggle
    const jobTypeFilter = document.getElementById('job-type');
    if (jobTypeFilter) {
        applyFilter(jobTypeFilter, '.job-item', 'data-job-type');

        const jobDetailsToggle = document.querySelectorAll('.job-details-toggle a');
        jobDetailsToggle.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const jobItem = toggle.closest('.job-item');
                const jobDescription = jobItem.nextElementSibling;
                // Toggle display of job description
                if (jobDescription.style.display === 'block') {
                    jobDescription.style.display = 'none';
                    toggle.textContent = 'View Details';
                } else {
                    jobDescription.style.display = 'block';
                    toggle.textContent = 'Hide Details';
                }
            });
        });
    }

    // Community Page Filters
    applyFilter(document.getElementById('community-category'), '.community-card', 'data-category');
    applyFilter(document.getElementById('thread-category'), '.thread-item', 'data-thread-category');

    // Signup Page User Type Toggle
    const userTypeSelect = document.getElementById('user-type');
    const studentFields = document.getElementById('student-fields');
    const alumniFields = document.getElementById('alumni-fields');

    if (userTypeSelect && studentFields && alumniFields) {
        // Initial state based on default selection
        if (userTypeSelect.value === 'student') {
            studentFields.style.display = 'block';
            alumniFields.style.display = 'none';
        } else {
            studentFields.style.display = 'none';
            alumniFields.style.display = 'block';
        }

        userTypeSelect.addEventListener('change', () => {
            if (userTypeSelect.value === 'student') {
                studentFields.style.display = 'block';
                alumniFields.style.display = 'none';
            } else {
                studentFields.style.display = 'none';
                alumniFields.style.display = 'block';
            }
        });
    }

    // --- Form Submission Logic ---

    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const closeBtn = document.querySelector('.close-btn');

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = 'flex';
    }

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    if(popup) {
        window.addEventListener('click', (e) => {
            if (e.target == popup) {
                popup.style.display = 'none';
            }
        });
    }

    // Validation functions
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        // At least 8 characters, one uppercase, one lowercase, one number, one special character
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(String(password));
    }

    function setFeedback(element, isValid, message) {
        element.textContent = message;
        element.classList.remove('valid', 'invalid');
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.add('invalid');
        }
    }

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailFeedback = document.getElementById('email-feedback');
        const passwordFeedback = document.getElementById('password-feedback');

        // (Your validation functions can stay here if you want)

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                showPopup('Please enter both email and password.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                // --- THIS IS THE CRITICAL STEP ---
                // Save the token to localStorage
                localStorage.setItem('unisyncToken', data.token);

                showPopup('Login successful! Redirecting...');
                
                // Redirect to the dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);

            } catch (error) {
                console.error('Login error:', error);
                showPopup(error.message);
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const userTypeSelect = document.getElementById('user-type');
        
        // (Your validation listeners can stay here)

        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            // Collect all form data
            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                userType: userTypeSelect.value
            };

            // You can add the student/alumni fields here too
            if (formData.userType === 'student') {
                formData.yearOfStudy = document.getElementById('year').value;
                formData.branch = document.getElementById('branch').value;
            } else {
                formData.company = document.getElementById('company').value;
                formData.role = document.getElementById('role').value;
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (!response.ok) {
                    // Handle validation errors from the backend
                    if (data.errors) {
                        const errorMsg = data.errors.map(err => Object.values(err)[0]).join('\n');
                        throw new Error(errorMsg);
                    }
                    throw new Error(data.message || 'Signup failed');
                }

                showPopup('Signup successful! Please log in.');
                
                // Redirect to the login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (error) {
                console.error('Signup error:', error);
                showPopup(error.message);
            }
        });
    }
})