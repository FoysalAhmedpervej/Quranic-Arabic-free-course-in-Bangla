// Course Configuration - Easy to customize
const courseConfig = {
    playlistId: "PLKX6RwLbgFxJnQXsUj2ZA5-_FGFQp9tOE", // Your YouTube Course Playlist
    totalLessons: 33,
    courseTitle: "Complete Course Series", 
    courseDescription: "Master new skills with this comprehensive video course series. Track your progress as you learn!"
};

// Global state
let appState = {
    currentLesson: 1,
    completedLessons: new Set(),
    focusMode: false,
    watchedTime: {}, // Store watched time per lesson
    lastUpdateTime: Date.now()
};

// DOM elements
let elements = {};

// SVG Icons
const icons = {
    eyeOff: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>',
    eye: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>',
    star: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>'
};

// Initialize DOM elements function
function initializeDOMElements() {
    elements = {
        videoPlayer: document.getElementById('videoPlayer'),
        videoFrame: document.getElementById('videoFrame'),
        courseTitle: document.getElementById('courseTitle'),
        courseDescription: document.getElementById('courseDescription'),
        lessonInfo: document.getElementById('lessonInfo'),
        lessonNumber: document.getElementById('lessonNumber'),
        lessonTitle: document.getElementById('lessonTitle'),
        completedInfo: document.getElementById('completedInfo'),
        watchedTimeInfo: document.getElementById('watchedTimeInfo'),
        totalTimeInfo: document.getElementById('totalTimeInfo'),
        lessonProgressBar: document.getElementById('lessonProgressBar'),
        progressCircle: document.getElementById('progressCircle'),
        progressPercentage: document.getElementById('progressPercentage'),
        progressText: document.getElementById('progressText'),
        focusToggle: document.getElementById('focusToggle'),
        focusIcon: document.getElementById('focusIcon'),
        focusText: document.getElementById('focusText'),
        focusIndicator: document.getElementById('focusIndicator'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        completeBtn: document.getElementById('completeBtn'),
        goToBtn: document.getElementById('goToBtn'),
        resetBtn: document.getElementById('resetBtn'),
        mainContainer: document.getElementById('mainContainer'),
        header: document.getElementById('header'),
        contentGrid: document.getElementById('contentGrid'),
        videoContainer: document.getElementById('videoContainer'),
        goToModal: document.getElementById('goToModal'),
        goToInput: document.getElementById('goToInput'),
        goToCancelBtn: document.getElementById('goToCancelBtn'),
        goToConfirmBtn: document.getElementById('goToConfirmBtn'),
        resetModal: document.getElementById('resetModal'),
        resetCancelBtn: document.getElementById('resetCancelBtn'),
        resetConfirmBtn: document.getElementById('resetConfirmBtn'),
        celebrationModal: document.getElementById('celebrationModal'),
        celebrationIcon: document.getElementById('celebrationIcon'),
        celebrationTitle: document.getElementById('celebrationTitle'),
        celebrationMessage: document.getElementById('celebrationMessage')
    };
}

// Utility functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m ${secs}s`;
    }
}

function convertToBengaliNumber(number) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().split('').map(digit => bengaliDigits[parseInt(digit)]).join('');
}

// Storage functions using localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Saved ${key} to localStorage:`, data);
    } catch (error) {
        console.error('Failed to save data to localStorage:', error);
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Failed to load data from localStorage:', error);
        return null;
    }
}

// In-memory fallback for milestones (since they're temporary)
let milestoneData = {};

// Progress functions
function saveProgressData() {
    const progressData = {
        currentLesson: appState.currentLesson,
        completed: Array.from(appState.completedLessons),
        focusMode: appState.focusMode,
        watchedTime: appState.watchedTime,
        lastSaved: Date.now()
    };
    saveToStorage('courseProgress', progressData);
}

function loadProgressData() {
    const savedProgress = loadFromStorage('courseProgress');
    
    if (savedProgress) {
        appState.currentLesson = savedProgress.currentLesson || 1;
        appState.completedLessons = new Set(savedProgress.completed || []);
        appState.focusMode = savedProgress.focusMode || false;
        appState.watchedTime = savedProgress.watchedTime || {};
        console.log('Loaded progress from localStorage:', savedProgress);
    } else {
        console.log('No saved progress found, starting fresh');
    }
}

function updateWatchedTime() {
    const currentTime = Date.now();
    const timeDiff = Math.floor((currentTime - appState.lastUpdateTime) / 1000); // seconds
    
    // Only count time if the difference is reasonable (between 1-10 seconds)
    // This prevents counting time when tab was inactive
    if (timeDiff >= 1 && timeDiff <= 10) {
        const lessonKey = `lesson_${appState.currentLesson}`;
        appState.watchedTime[lessonKey] = (appState.watchedTime[lessonKey] || 0) + timeDiff;
        
        // Auto-complete lesson if watched for more than 5 minutes (300 seconds)
        if (appState.watchedTime[lessonKey] >= 300 && !appState.completedLessons.has(appState.currentLesson)) {
            appState.completedLessons.add(appState.currentLesson);
            console.log(`Auto-completed lesson ${appState.currentLesson} after 5 minutes of watch time`);
            updateUI();
            checkForMilestones();
        }
    }
    
    appState.lastUpdateTime = currentTime;
    
    // Save progress every 30 seconds
    if (timeDiff > 0 && Date.now() % 30000 < 1000) {
        saveProgressData();
    }
}

function getTotalWatchedTime() {
    return Object.values(appState.watchedTime).reduce((total, time) => total + time, 0);
}

function getWatchedTimeForLesson(lessonNumber) {
    return appState.watchedTime[`lesson_${lessonNumber}`] || 0;
}

function calculateCompletionPercentage() {
    return (appState.completedLessons.size / courseConfig.totalLessons) * 100;
}

function checkForMilestones() {
    const percentage = calculateCompletionPercentage();
    const milestones = [25, 50, 75, 100];
    
    console.log('Checking milestones. Current percentage:', percentage);
    
    milestones.forEach(milestone => {
        const milestoneKey = `milestone_${milestone}`;
        if (percentage >= milestone && !milestoneData[milestoneKey]) {
            milestoneData[milestoneKey] = true;
            console.log('Milestone reached:', milestone + '%');
            showCelebration(milestone);
        }
    });
}

// Video functions
function updateVideoPlayer() {
    const lessonNumber = appState.currentLesson;
    const bengaliNumber = convertToBengaliNumber(lessonNumber);
    const totalBengali = convertToBengaliNumber(courseConfig.totalLessons);
    
    if (elements.lessonNumber) {
        elements.lessonNumber.textContent = `পাঠ ${bengaliNumber} / ${totalBengali}`;
    }
    
    if (elements.lessonTitle) {
        elements.lessonTitle.textContent = `Lesson ${lessonNumber}`;
    }
    
    if (elements.videoFrame) {
        // Fixed playlist index calculation - YouTube playlist index starts from 1
        const playlistIndex = courseConfig.totalLessons - lessonNumber + 1;
        elements.videoFrame.src = `https://www.youtube.com/embed?list=${courseConfig.playlistId}&index=${playlistIndex}`;
    }
}

// Navigation functions
function goToLesson(lessonNumber) {
    if (lessonNumber >= 1 && lessonNumber <= courseConfig.totalLessons) {
        appState.currentLesson = lessonNumber;
        updateVideoPlayer();
        updateUI();
        saveProgressData();
        console.log('Navigated to lesson:', lessonNumber);
    }
}

function nextLesson() {
    if (appState.currentLesson < courseConfig.totalLessons) {
        // Mark current lesson as completed before moving to next
        appState.completedLessons.add(appState.currentLesson);
        appState.currentLesson++;
        updateVideoPlayer();
        updateUI();
        saveProgressData();
        checkForMilestones();
        console.log('Moved to next lesson:', appState.currentLesson, 'Completed lessons:', Array.from(appState.completedLessons));
    }
}

function prevLesson() {
    if (appState.currentLesson > 1) {
        appState.currentLesson--;
        updateVideoPlayer();
        updateUI();
        saveProgressData();
        console.log('Moved to previous lesson:', appState.currentLesson);
    }
}

function markLessonComplete() {
    appState.completedLessons.add(appState.currentLesson);
    updateUI();
    saveProgressData();
    checkForMilestones();
    console.log('Marked lesson', appState.currentLesson, 'as complete. Total completed:', appState.completedLessons.size);
    
    // Show feedback
    if (elements.completeBtn) {
        const originalText = elements.completeBtn.textContent;
        elements.completeBtn.textContent = '✓ Completed!';
        elements.completeBtn.classList.add('bg-green-700');
        setTimeout(() => {
            elements.completeBtn.textContent = originalText;
            elements.completeBtn.classList.remove('bg-green-700');
        }, 1500);
    }
}

function toggleFocusMode() {
    appState.focusMode = !appState.focusMode;
    updateFocusMode();
    saveProgressData();
}

function updateFocusMode() {
    if (appState.focusMode) {
        if (elements.mainContainer) elements.mainContainer.classList.add('Theater-mode');
        if (elements.header) elements.header.style.display = 'none';
        if (elements.contentGrid) {
            elements.contentGrid.style.gridTemplateColumns = '1fr';
            elements.contentGrid.style.maxWidth = '64rem';
            elements.contentGrid.style.margin = '0 auto';
        }
        if (elements.videoContainer) elements.videoContainer.classList.add('focus-ring');
        if (elements.focusIndicator) {
            elements.focusIndicator.classList.remove('hidden');
        }
        if (elements.focusIcon) elements.focusIcon.innerHTML = icons.eye;
        if (elements.focusText) elements.focusText.textContent = 'Theater Mode ON';
        if (elements.focusToggle) {
            elements.focusToggle.className = elements.focusToggle.className.replace('from-slate-700 to-slate-600', 'from-cyan-500 to-blue-500');
        }
    } else {
        if (elements.mainContainer) elements.mainContainer.classList.remove('Theater-mode');
        if (elements.header) elements.header.style.display = 'block';
        if (elements.contentGrid) {
            elements.contentGrid.style.gridTemplateColumns = '';
            elements.contentGrid.style.maxWidth = '';
            elements.contentGrid.style.margin = '';
        }
        if (elements.videoContainer) elements.videoContainer.classList.remove('focus-ring');
        if (elements.focusIndicator) {
            elements.focusIndicator.classList.add('hidden');
        }
        if (elements.focusIcon) elements.focusIcon.innerHTML = icons.eyeOff;
        if (elements.focusText) elements.focusText.textContent = 'Theater Mode OFF';
        if (elements.focusToggle) {
            elements.focusToggle.className = elements.focusToggle.className.replace('from-cyan-500 to-blue-500', 'from-slate-700 to-slate-600');
        }
    }
}

function resetAll() {
    appState.currentLesson = 1;
    appState.completedLessons = new Set();
    appState.focusMode = false;
    appState.watchedTime = {};
    appState.lastUpdateTime = Date.now();
    
    // Clear localStorage
    localStorage.removeItem('courseProgress');
    
    // Reset milestone data
    milestoneData = {};
    
    updateVideoPlayer();
    updateUI();
    updateFocusMode();
    
    console.log('Reset all progress and localStorage');
}

// UI update functions
function updateUI() {
    console.log('Updating UI with state:', appState);
    
    if (elements.lessonInfo) {
        elements.lessonInfo.textContent = `Lesson ${appState.currentLesson} of ${courseConfig.totalLessons}`;
    }
    if (elements.completedInfo) {
        elements.completedInfo.textContent = `${appState.completedLessons.size} completed`;
    }
    
    // Update watched time info
    if (elements.watchedTimeInfo) {
        const currentLessonTime = getWatchedTimeForLesson(appState.currentLesson);
        elements.watchedTimeInfo.textContent = `${formatTime(currentLessonTime)} watched`;
    }
    
    if (elements.totalTimeInfo) {
        const totalTime = getTotalWatchedTime();
        elements.totalTimeInfo.textContent = `Total: ${formatTime(totalTime)}`;
    }
    
    if (elements.lessonProgressBar) {
        const lessonProgress = (appState.currentLesson / courseConfig.totalLessons) * 100;
        elements.lessonProgressBar.style.width = `${lessonProgress}%`;
        console.log('Lesson progress bar updated to:', lessonProgress + '%');
    }
    
    if (elements.progressCircle && elements.progressPercentage && elements.progressText) {
        const completionPercentage = calculateCompletionPercentage();
        const circumference = 2 * Math.PI * 55; // 345.575
        const offset = circumference - (completionPercentage / 100) * circumference;
        elements.progressCircle.style.strokeDashoffset = offset;
        elements.progressPercentage.textContent = `${Math.round(completionPercentage)}%`;
        elements.progressText.textContent = `${appState.completedLessons.size} of ${courseConfig.totalLessons} lessons completed`;
        console.log('Progress circle updated:', completionPercentage + '%', 'Offset:', offset);
    }
    
    // Update button states
    if (elements.prevBtn) {
        const isDisabled = appState.currentLesson === 1;
        elements.prevBtn.disabled = isDisabled;
        if (isDisabled) {
            elements.prevBtn.classList.add('btn-disabled');
        } else {
            elements.prevBtn.classList.remove('btn-disabled');
        }
    }
    
    if (elements.nextBtn) {
        const isDisabled = appState.currentLesson === courseConfig.totalLessons;
        elements.nextBtn.disabled = isDisabled;
        if (isDisabled) {
            elements.nextBtn.classList.add('btn-disabled');
        } else {
            elements.nextBtn.classList.remove('btn-disabled');
        }
    }
}

// Celebration functions
function showCelebration(milestone) {
    if (!elements.celebrationModal) return;
    
    const messages = {
        25: "Great start! 25% complete!",
        50: "Halfway there! 50% complete!", 
        75: "Almost done! 75% complete!",
        100: "Congratulations! Course completed!"
    };
    
    if (elements.celebrationTitle) elements.celebrationTitle.textContent = messages[milestone] || `${milestone}% complete!`;
    if (elements.celebrationMessage) elements.celebrationMessage.textContent = "Keep up the great work!";
    
    elements.celebrationModal.classList.remove('hidden');
    setTimeout(() => {
        elements.celebrationModal.classList.add('hidden');
    }, 3000);
}

// Event listeners
function setupEventListeners() {
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevLesson();
        });
    }
    
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextLesson();
        });
    }
    
    if (elements.completeBtn) {
        elements.completeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            markLessonComplete();
        });
    }
    
    if (elements.focusToggle) {
        elements.focusToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFocusMode();
        });
    }
    
    if (elements.goToBtn && elements.goToModal && elements.goToInput) {
        elements.goToBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.goToModal.classList.remove('hidden');
            elements.goToInput.focus();
        });
    }
    
    if (elements.resetBtn && elements.resetModal) {
        elements.resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.resetModal.classList.remove('hidden');
        });
    }
    
    if (elements.goToCancelBtn && elements.goToModal) {
        elements.goToCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.goToModal.classList.add('hidden');
            if (elements.goToInput) elements.goToInput.value = '';
        });
    }
    
    if (elements.goToConfirmBtn && elements.goToInput && elements.goToModal) {
        elements.goToConfirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const lessonNum = parseInt(elements.goToInput.value);
            if (lessonNum && lessonNum >= 1 && lessonNum <= courseConfig.totalLessons) {
                goToLesson(lessonNum);
                elements.goToModal.classList.add('hidden');
                elements.goToInput.value = '';
            } else {
                alert(`Please enter a valid lesson number between 1 and ${courseConfig.totalLessons}`);
            }
        });
    }
    
    if (elements.goToInput && elements.goToConfirmBtn) {
        elements.goToInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                elements.goToConfirmBtn.click();
            }
        });
    }
    
    if (elements.resetCancelBtn && elements.resetModal) {
        elements.resetCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.resetModal.classList.add('hidden');
        });
    }
    
    if (elements.resetConfirmBtn && elements.resetModal) {
        elements.resetConfirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetAll();
            elements.resetModal.classList.add('hidden');
        });
    }
    
    // Modal background click to close
    if (elements.goToModal) {
        elements.goToModal.addEventListener('click', (e) => {
            if (e.target === elements.goToModal) {
                elements.goToModal.classList.add('hidden');
                if (elements.goToInput) elements.goToInput.value = '';
            }
        });
    }
    
    if (elements.resetModal) {
        elements.resetModal.addEventListener('click', (e) => {
            if (e.target === elements.resetModal) {
                elements.resetModal.classList.add('hidden');
            }
        });
    }
    
    if (elements.celebrationModal) {
        elements.celebrationModal.addEventListener('click', (e) => {
            if (e.target === elements.celebrationModal) {
                elements.celebrationModal.classList.add('hidden');
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.key.toLowerCase()) {
            case 'arrowleft':
                e.preventDefault();
                prevLesson();
                break;
            case 'arrowright':
                e.preventDefault();
                nextLesson();
                break;
            case 'f':
                e.preventDefault();
                toggleFocusMode();
                break;
            case 'g':
                if (elements.goToModal && elements.goToInput) {
                    e.preventDefault();
                    elements.goToModal.classList.remove('hidden');
                    elements.goToInput.focus();
                }
                break;
            case 'r':
                if ((e.ctrlKey || e.metaKey) && elements.resetModal) {
                    e.preventDefault();
                    elements.resetModal.classList.remove('hidden');
                }
                break;
            case 'escape':
                // Close any open modal
                if (elements.goToModal && !elements.goToModal.classList.contains('hidden')) {
                    elements.goToModal.classList.add('hidden');
                    if (elements.goToInput) elements.goToInput.value = '';
                }
                if (elements.resetModal && !elements.resetModal.classList.contains('hidden')) {
                    elements.resetModal.classList.add('hidden');
                }
                if (elements.celebrationModal && !elements.celebrationModal.classList.contains('hidden')) {
                    elements.celebrationModal.classList.add('hidden');
                }
                break;
        }
    });
}

// Initialize the application
function init() {
    console.log("Initializing Course Tracker...");
    
    // Initialize DOM elements first
    initializeDOMElements();
    
    // Set course information
    if (elements.courseTitle) elements.courseTitle.textContent = courseConfig.courseTitle;
    if (elements.courseDescription) elements.courseDescription.textContent = courseConfig.courseDescription;
    
    // Load saved progress from localStorage
    loadProgressData();
    
    // Update UI
    updateVideoPlayer();
    updateUI();
    updateFocusMode();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start the watch time tracking interval
    setInterval(() => {
        updateWatchedTime();
        updateUI(); // Update UI to show current watched time
    }, 1000); // Update every second
    
    console.log("Course Tracker initialized successfully");
    console.log("Current state:", appState);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
