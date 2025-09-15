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
    focusMode: false
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

// Storage functions
let storageData = {
    courseProgress: null
};

function saveToStorage(key, data) {
    try {
        storageData[key] = data;
        console.log(`Saved ${key}:`, data);
    } catch (error) {
        console.error('Failed to save data:', error);
    }
}

function loadFromStorage(key) {
    try {
        return storageData[key] || null;
    } catch (error) {
        console.error('Failed to load data:', error);
        return null;
    }
}

// Progress functions
function saveProgressData() {
    const progressData = {
        currentLesson: appState.currentLesson,
        completed: Array.from(appState.completedLessons),
        focusMode: appState.focusMode
    };
    saveToStorage('courseProgress', progressData);
}

function loadProgressData() {
    const savedProgress = loadFromStorage('courseProgress');
    
    if (savedProgress) {
        appState.currentLesson = savedProgress.currentLesson || 1;
        appState.completedLessons = new Set(savedProgress.completed || []);
        appState.focusMode = savedProgress.focusMode || false;
    }
}

function calculateCompletionPercentage() {
    return (appState.completedLessons.size / courseConfig.totalLessons) * 100;
}

function checkForMilestones() {
    const percentage = calculateCompletionPercentage();
    const milestones = [25, 50, 75, 100];
    
    milestones.forEach(milestone => {
        if (percentage >= milestone && !storageData[`milestone_${milestone}`]) {
            storageData[`milestone_${milestone}`] = true;
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
    
    if (elements.prevBtn) {
        elements.prevBtn.disabled = appState.currentLesson === 1;
    }
    if (elements.nextBtn) {
        elements.nextBtn.disabled = appState.currentLesson === courseConfig.totalLessons;
    }
    
    if (elements.videoFrame) {
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
    }
}

function nextLesson() {
    if (appState.currentLesson < courseConfig.totalLessons) {
        appState.completedLessons.add(appState.currentLesson);
        appState.currentLesson++;
        updateVideoPlayer();
        updateUI();
        saveProgressData();
        checkForMilestones();
    }
}

function prevLesson() {
    if (appState.currentLesson > 1) {
        appState.currentLesson--;
        updateVideoPlayer();
        updateUI();
        saveProgressData();
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
            elements.focusIndicator.style.display = 'flex';
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
            elements.focusIndicator.style.display = 'none';
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
    
    storageData = {
        courseProgress: null
    };
    
    updateVideoPlayer();
    updateUI();
    updateFocusMode();
}

// UI update functions
function updateUI() {
    if (elements.lessonInfo) {
        elements.lessonInfo.textContent = `Lesson ${appState.currentLesson} of ${courseConfig.totalLessons}`;
    }
    if (elements.completedInfo) {
        elements.completedInfo.textContent = `${appState.completedLessons.size} completed`;
    }
    
    if (elements.lessonProgressBar) {
        const lessonProgress = (appState.currentLesson / courseConfig.totalLessons) * 100;
        elements.lessonProgressBar.style.width = `${lessonProgress}%`;
    }
    
    if (elements.progressCircle && elements.progressPercentage && elements.progressText) {
        const completionPercentage = calculateCompletionPercentage();
        const circumference = 2 * Math.PI * 55;
        const offset = circumference - (completionPercentage / 100) * circumference;
        elements.progressCircle.style.strokeDashoffset = offset;
        elements.progressPercentage.textContent = `${Math.round(completionPercentage)}%`;
        elements.progressText.textContent = `${appState.completedLessons.size} of ${courseConfig.totalLessons} lessons completed`;
    }
    
    if (elements.prevBtn) {
        elements.prevBtn.disabled = appState.currentLesson === 1;
        if (elements.prevBtn.disabled) {
            elements.prevBtn.classList.add('btn-disabled');
        } else {
            elements.prevBtn.classList.remove('btn-disabled');
        }
    }
    
    if (elements.nextBtn) {
        elements.nextBtn.disabled = appState.currentLesson === courseConfig.totalLessons;
        if (elements.nextBtn.disabled) {
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
    
    if (elements.celebrationIcon) elements.celebrationIcon.innerHTML = icons.star;
    if (elements.celebrationTitle) elements.celebrationTitle.textContent = messages[milestone] || `${milestone}% complete!`;
    if (elements.celebrationMessage) elements.celebrationMessage.textContent = "Keep up the great work!";
    
    elements.celebrationModal.classList.remove('hidden');
    setTimeout(() => {
        elements.celebrationModal.classList.add('hidden');
    }, 3000);
}

// Event listeners
function setupEventListeners() {
    if (elements.prevBtn) elements.prevBtn.addEventListener('click', prevLesson);
    if (elements.nextBtn) elements.nextBtn.addEventListener('click', nextLesson);
    if (elements.focusToggle) elements.focusToggle.addEventListener('click', toggleFocusMode);
    
    if (elements.goToBtn && elements.goToModal && elements.goToInput) {
        elements.goToBtn.addEventListener('click', () => {
            elements.goToModal.classList.remove('hidden');
            elements.goToInput.focus();
        });
    }
    
    if (elements.resetBtn && elements.resetModal) {
        elements.resetBtn.addEventListener('click', () => {
            elements.resetModal.classList.remove('hidden');
        });
    }
    
    if (elements.goToCancelBtn && elements.goToModal && elements.goToInput) {
        elements.goToCancelBtn.addEventListener('click', () => {
            elements.goToModal.classList.add('hidden');
            elements.goToInput.value = '';
        });
    }
    
    if (elements.goToConfirmBtn && elements.goToInput && elements.goToModal) {
        elements.goToConfirmBtn.addEventListener('click', () => {
            const lessonNum = parseInt(elements.goToInput.value);
            if (lessonNum && lessonNum >= 1 && lessonNum <= courseConfig.totalLessons) {
                goToLesson(lessonNum);
                elements.goToModal.classList.add('hidden');
                elements.goToInput.value = '';
            }
        });
    }
    
    if (elements.goToInput && elements.goToConfirmBtn) {
        elements.goToInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                elements.goToConfirmBtn.click();
            }
        });
    }
    
    if (elements.resetCancelBtn && elements.resetModal) {
        elements.resetCancelBtn.addEventListener('click', () => {
            elements.resetModal.classList.add('hidden');
        });
    }
    
    if (elements.resetConfirmBtn && elements.resetModal) {
        elements.resetConfirmBtn.addEventListener('click', () => {
            resetAll();
            elements.resetModal.classList.add('hidden');
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevLesson();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextLesson();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                toggleFocusMode();
                break;
            case 'g':
            case 'G':
                if (elements.goToModal && elements.goToInput) {
                    e.preventDefault();
                    elements.goToModal.classList.remove('hidden');
                    elements.goToInput.focus();
                }
                break;
            case 'r':
            case 'R':
                if ((e.ctrlKey || e.metaKey) && elements.resetModal) {
                    e.preventDefault();
                    elements.resetModal.classList.remove('hidden');
                }
                break;
        }
    });
}

// Initialize the application
function init() {
    console.log("Initializing Course Tracker...");
    
    initializeDOMElements();
    
    if (elements.courseTitle) elements.courseTitle.textContent = courseConfig.courseTitle;
    if (elements.courseDescription) elements.courseDescription.textContent = courseConfig.courseDescription;
    
    loadProgressData();
    
    updateVideoPlayer();
    updateUI();
    updateFocusMode();
    
    setupEventListeners();
    
    console.log("Course Tracker initialized successfully");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
