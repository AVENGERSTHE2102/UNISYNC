document.addEventListener('DOMContentLoaded', function () {
    // =========================================================================
    // 1. FIREBASE CORE CONFIGURATION & INITIALIZATION
    // =========================================================================
    const firebaseConfig = {
        apiKey: "FIREBASE_API_KEY",
        authDomain: "FIREBASE_AUTH_DOMAIN",
        projectId: "FIREBASE_PROJECT_ID",
        storageBucket: "FIREBASE_STORAGE_BUCKET",
        messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
        appId: "FIREBASE_APP_ID"
    };
    
    // Check to prevent accidental double initialization
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();

    // =========================================================================
    // 2. GLOBAL ROLE-BASED ACCESS CONTROL (RBAC) UI MODIFIER
    // =========================================================================
    const currentUserType = localStorage.getItem('userType');
    if (currentUserType !== 'admin') {
        // Hides all admin elements on page load if user is not an admin
        const adminOnlyElements = document.querySelectorAll('.admin-only-btn, #create-btn, .creation-form-container');
        adminOnlyElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    // =========================================================================
    // 3. NAVIGATION LOGIC
    // =========================================================================
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

    // =========================================================================
    // 4. GENERIC FILTER FUNCTION
    // =========================================================================
    function applyFilter(filterElement, cardSelector, dataAttribute) {
        if (filterElement) {
            filterElement.addEventListener('change', () => {
                const cards = document.querySelectorAll(cardSelector);
                const selectedValue = filterElement.value;

                cards.forEach(card => {
                    const cardValue = card.getAttribute(dataAttribute);
                    if (selectedValue === 'all' || selectedValue === cardValue) {
                        card.style.display = card.tagName === 'DIV' ? 'flex' : 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }

    // =========================================================================
    // 5. DYNAMIC VIEWS FETCHING & LISTENING LOGIC
    // =========================================================================

    // Events Page Filter and Fetch
    applyFilter(document.getElementById('event-type'), '.event-card', 'data-event-type');

    const eventsGrid = document.querySelector('.events-grid');
    if (eventsGrid) {
        fetch('/api/events')
            .then(response => response.json())
            .then(events => {
                eventsGrid.innerHTML = '';
                events.forEach(event => {
                    const eventCard = `
                        <div class="event-card" data-event-type="${event.eventType || 'General'}">
                            <div class="event-date">
                                <div class="month">${new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                                <div class="day">${new Date(event.date).getDate()}</div>
                            </div>
                            <div class="event-details">
                                <h3>${event.title}</h3>
                                <div class="event-meta">${event.eventType || 'General'}</div>
                                <p>${event.description}</p>
                            </div>
                        </div>
                    `;
                    eventsGrid.innerHTML += eventCard;
                });
                // Re-apply visibility check to freshly generated cards if needed
            });
    }

    // Mentorship Page Filter and Fetch
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

    // Jobs Page List and Filter Fetch
    const jobTypeFilter = document.getElementById('job-type');
    if (jobTypeFilter) {
        applyFilter(jobTypeFilter, '.job-item', 'data-job-type');
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
                                <a href="#" class="view-details-link">View Details</a>
                            </div>
                        </div>
                        <div class="job-description" style="display: none;">
                            <h4>Job Description</h4>
                            <p>${job.description}</p>
                            <a href="#" class="btn btn-primary apply-btn">Apply Now</a>
                        </div>
                    `;
                    jobsList.innerHTML += jobItem;
                });

                // Attach Event Listeners to dynamic "View Details" buttons
                document.querySelectorAll('.view-details-link').forEach(toggle => {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        const jobItem = toggle.closest('.job-item');
                        const jobDescription = jobItem.nextElementSibling;
                        if (jobDescription.style.display === 'block') {
                            jobDescription.style.display = 'none';
                            toggle.textContent = 'View Details';
                        } else {
                            jobDescription.style.display = 'block';
                            toggle.textContent = 'Hide Details';
                        }
                    });
                });
            });
    }

    // Community Page Filters and Fetch
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

    // Signup Dynamic Field Toggle Setup
    const userTypeSelect = document.getElementById('user-type');
    const studentFields = document.getElementById('student-fields');
    const alumniFields = document.getElementById('alumni-fields');

    if (userTypeSelect && studentFields && alumniFields) {
        const toggleRoleFields = (role) => {
            if (role === 'student') {
                studentFields.style.display = 'block';
                alumniFields.style.display = 'none';
            } else if (role === 'mentor') {
                studentFields.style.display = 'none';
                alumniFields.style.display = 'block';
            } else {
                // If it is 'admin', hide specialized student/mentor fields
                studentFields.style.display = 'none';
                alumniFields.style.display = 'none';
            }
        };

        // Run immediately for initialization
        toggleRoleFields(userTypeSelect.value);
        userTypeSelect.addEventListener('change', () => toggleRoleFields(userTypeSelect.value));
    }

    // =========================================================================
    // 6. FORM CUSTOM POPUP SYSTEM
    // =========================================================================
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const closeBtn = document.querySelector('.close-btn');

    function showPopup(message) {
        if (popupMessage && popup) {
            popupMessage.textContent = message;
            popup.style.display = 'flex';
        } else {
            alert(message);
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => { popup.style.display = 'none'; });
    }
    if (popup) {
        window.addEventListener('click', (e) => {
            if (e.target == popup) popup.style.display = 'none';
        });
    }

    // Validation Regex Rules
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(String(password));
    }

    function setFeedback(element, isValid, message) {
        if (!element) return;
        element.textContent = message;
        element.classList.remove('valid', 'invalid');
        element.classList.add(isValid ? 'valid' : 'invalid');
    }

    // =========================================================================
    // 7. FIREBASE AUTH INTEGRATION (LOGIN & SIGNUP PATHS)
    // =========================================================================

    // LOGIN PROCESS
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailFeedback = document.getElementById('email-feedback');
        const passwordFeedback = document.getElementById('password-feedback');

        if (emailInput) {
            emailInput.addEventListener('input', () => {
                validateEmail(emailInput.value) 
                    ? setFeedback(emailFeedback, true, 'Valid email format') 
                    : setFeedback(emailFeedback, false, 'Please enter a valid email address');
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                validatePassword(passwordInput.value)
                    ? setFeedback(passwordFeedback, true, 'Strong password format match')
                    : setFeedback(passwordFeedback, false, 'Password needs 8+ characters, uppercase, lowercase, number, & symbol');
            });
        }

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            if (validateEmail(email) && validatePassword(password)) {
                try {
                    // 1. Authenticate with Firebase Authentication Services
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    const fbUser = userCredential.user;

                    // 2. Extract verification ID Token string from Firebase session
                    const firebaseIdToken = await fbUser.getIdToken();

                    // 3. Send authorization verify signature to local backend
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, firebaseToken: firebaseIdToken })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Cache values to check roles instantly on page headers
                        localStorage.setItem('token', firebaseIdToken);
                        localStorage.setItem('userType', data.userType);
                        
                        showPopup('User authenticated successfully! Syncing space channels...');
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 2000);
                    } else {
                        showPopup(data.message || 'Firebase login succeeded, but backend verification mapping rejected.');
                    }
                } catch (error) {
                    console.error("Firebase Login Error:", error);
                    showPopup(error.message || 'Authentication failed. Please verify credentials.');
                }
            } else {
                showPopup('Please correct the validation structural formatting errors in your form fields.');
            }
        });
    }

    // SIGNUP PROCESS
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailFeedback = document.getElementById('email-feedback');
        const passwordFeedback = document.getElementById('password-feedback');

        if (emailInput) {
            emailInput.addEventListener('input', () => {
                validateEmail(emailInput.value) 
                    ? setFeedback(emailFeedback, true, 'Valid email structure') 
                    : setFeedback(emailFeedback, false, 'Please enter a valid email structure');
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                validatePassword(passwordInput.value)
                    ? setFeedback(passwordFeedback, true, 'Strong configuration structure')
                    : setFeedback(passwordFeedback, false, 'Requires 8+ letters, uppercase, lowercase, numbers, and symbols');
            });
        }

        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            
            const userType = document.getElementById('user-type').value; // 'student', 'mentor', or 'admin'
            const year = document.getElementById('year')?.value || null;
            const branch = document.getElementById('branch')?.value || null;
            const company = document.getElementById('company')?.value || null;
            const role = document.getElementById('role')?.value || null;
            
            const interestsElement = document.getElementById('interests');
            const interests = interestsElement 
                ? Array.from(interestsElement.selectedOptions).map(option => option.value) 
                : [];

            if (name && validateEmail(email) && validatePassword(password)) {
                try {
                    // 1. Initialize creation schema record inside Firebase Auth Cloud platform
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    const fbUser = userCredential.user;

                    // 2. Synchronize configuration profiles down directly inside your Supabase relational tables
                    const response = await fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            name, email, password, userType, year, branch, company, role, interests,
                            firebaseUid: fbUser.uid // Send UID to track across systems if needed
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showPopup('User created successfully via Firebase! Redirecting to setup portal login space...');
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        showPopup(data.message || 'Firebase initialization ran, but database storage engine failed.');
                    }
                } catch (error) {
                    console.error("Firebase Registration Error:", error);
                    showPopup(error.message || 'Registration failure running Cloud Auth pipeline.');
                }
            } else {
                showPopup('Please fix the structural layout inputs inside the form validation constraints.');
            }
        });
    }

    // =========================================================================
    // 8. ADMIN DYNAMIC FORM CREATION SUBMISSION (EVENTS / COMMUNITIES / JOBS)
    // =========================================================================
    const adminCreationForm = document.getElementById('creation-form');
    if (adminCreationForm) {
        adminCreationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const token = localStorage.getItem('token');
            const titleInput = document.getElementById('title-input')?.value;
            const descInput = document.getElementById('desc-input')?.value;
            const typeInput = document.getElementById('type-input')?.value || 'General';

            // Identify current working file path viewport context to route to the correct API endpoint dynamically
            let targetEndpoint = '/api/events';
            let payload = { title: titleInput, description: descInput, eventType: typeInput, date: new Date() };

            if (window.location.pathname.includes('community')) {
                targetEndpoint = '/api/communities';
                payload = { name: titleInput, description: descInput, category: typeInput };
            } else if (window.location.pathname.includes('jobs')) {
                targetEndpoint = '/api/jobs';
                payload = { title: titleInput, description: descInput, jobType: typeInput, company: 'UniSync Admin Panel', location: 'Remote/On-Campus' };
            }

            try {
                const response = await fetch(targetEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    showPopup('Success! Content created and saved into the database.');
                    adminCreationForm.reset();
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showPopup(data.message || 'Action forbidden. High level admin credentials needed.');
                }
            } catch (error) {
                console.error('Admin Form Submission Error:', error);
                showPopup('Could not reach the backend API handler.');
            }
        });
    }
});