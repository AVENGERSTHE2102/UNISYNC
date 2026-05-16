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

    const eventsGrid = document.querySelector('.events-grid');
    if (eventsGrid) {
        fetch('/api/events')
            .then(response => response.json())
            .then(events => {
                eventsGrid.innerHTML = '';
                events.forEach(event => {
                    const eventCard = `
                        <div class="event-card" data-event-type="${event.eventType}">
                            <div class="event-date">
                                <div class="month">${new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                                <div class="day">${new Date(event.date).getDate()}</div>
                            </div>
                            <div class="event-details">
                                <h3>${event.title}</h3>
                                <div class="event-meta">${event.eventType}</div>
                                <p>${event.description}</p>
                            </div>
                        </div>
                    `;
                    eventsGrid.innerHTML += eventCard;
                });
            });
    }

    // Mentorship Page Filter
    applyFilter(document.getElementById('mentor-expertise'), '.mentor-card', 'data-expertise');

    const mentorshipGrid = document.querySelector('.mentorship-grid');
    if (mentorshipGrid) {
        fetch('/api/mentorships')
            .then(response => response.json())
            .then(mentorships => {
                mentorshipGrid.innerHTML = '';
                mentorships.forEach(mentor => {
                    const mentorCard = `
                        <div class="mentor-card" data-expertise="${mentor.expertise}">
                            <img src="assets/img/Aditya_photo.jpg" alt="${mentor.mentorName}">
                            <h3>${mentor.mentorName}</h3>
                            <div class="mentor-role">${mentor.expertise}</div>
                            <p class="mentor-bio">${mentor.bio}</p>
                            <div class="mentor-skills">
                                <span>Web Development</span>
                                <span>UI/UX Design</span>
                            </div>
                            <a href="#" class="btn btn-primary">Connect</a>
                        </div>
                    `;
                    mentorshipGrid.innerHTML += mentorCard;
                });
            });
    }

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

    const jobsList = document.querySelector('.jobs-list');
    if (jobsList) {
        fetch('/api/jobs')
            .then(response => response.json())
            .then(jobs => {
                jobsList.innerHTML = '';
                jobs.forEach(job => {
                    const jobItem = `
                        <div class="job-item" data-job-type="${job.jobType}">
                            <div class="job-info">
                                <h3>${job.title}</h3>
                                <div class="job-company">${job.company}</div>
                                <div class="job-location">${job.location}</div>
                            </div>
                            <div class="job-details-toggle">
                                <a href="#">View Details</a>
                            </div>
                        </div>
                        <div class="job-description">
                            <h4>Job Description</h4>
                            <p>${job.description}</p>
                            <a href="#" class="btn btn-primary apply-btn">Apply Now</a>
                        </div>
                    `;
                    jobsList.innerHTML += jobItem;
                });
            });
    }

    // Community Page Filters
    applyFilter(document.getElementById('community-category'), '.community-card', 'data-category');
    applyFilter(document.getElementById('thread-category'), '.thread-item', 'data-thread-category');

    const communityGrid = document.querySelector('.community-grid');
    if (communityGrid) {
        fetch('/api/communities')
            .then(response => response.json())
            .then(communities => {
                communityGrid.innerHTML = '';
                communities.forEach(community => {
                    const communityCard = `
                        <div class="community-card" data-category="${community.category}">
                            <div class="community-icon"><span class="material-icons">groups</span></div>
                            <div class="community-details">
                                <h3>${community.name}</h3>
                                <p>${community.description}</p>
                                <div class="community-tags">
                                    <span>${community.category}</span>
                                </div>
                                <a href="#" class="btn btn-primary">Join Community</a>
                            </div>
                        </div>
                    `;
                    communityGrid.innerHTML += communityCard;
                });
            });
    }

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

        emailInput.addEventListener('input', () => {
            if (validateEmail(emailInput.value)) {
                setFeedback(emailFeedback, true, 'Valid email');
            } else {
                setFeedback(emailFeedback, false, 'Please enter a valid email');
            }
        });

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            if (validatePassword(password)) {
                setFeedback(passwordFeedback, true, 'Strong password');
            } else {
                setFeedback(passwordFeedback, false, 'Weak password');
            }
        });

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            if (validateEmail(email) && validatePassword(password)) {
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        localStorage.setItem('token', data.token);
                        showPopup('User logged in successfully!');
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 2000);
                    } else {
                        showPopup(data.message);
                    }
                } catch (error) {
                    showPopup('Error logging in');
                }
            } else {
                showPopup('Please correct the errors in the form.');
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailFeedback = document.getElementById('email-feedback');
        const passwordFeedback = document.getElementById('password-feedback');

        emailInput.addEventListener('input', () => {
            if (validateEmail(emailInput.value)) {
                setFeedback(emailFeedback, true, 'Valid email');
            } else {
                setFeedback(emailFeedback, false, 'Please enter a valid email');
            }
        });

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            if (validatePassword(password)) {
                setFeedback(passwordFeedback, true, 'Strong password');
            } else {
                setFeedback(passwordFeedback, false, 'Weak password');
            }
        });

        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const userType = document.getElementById('user-type').value;
            const year = document.getElementById('year').value;
            const branch = document.getElementById('branch').value;
            const company = document.getElementById('company').value;
            const role = document.getElementById('role').value;
            const interests = Array.from(document.getElementById('interests').selectedOptions).map(option => option.value);

            if (name && validateEmail(email) && validatePassword(password)) {
                try {
                    const response = await fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, password, userType, year, branch, company, role, interests })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showPopup('User created successfully!');
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        showPopup(data.message);
                    }
                } catch (error) {
                    showPopup('Error creating user');
                }
            } else {
                showPopup('Please correct the errors in the form.');
            }
        });
    }
});
