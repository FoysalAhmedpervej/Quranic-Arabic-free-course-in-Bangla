// Course configuration
const totalLessons = 26;
let isTheaterMode = false;

// Lesson titles (you can update these with actual titles)
const lessonTitles = [
    "কুরআনের ব্যাকরণ শিক্ষার ভূমিকা",
    "আরবি ব্যাকরণের মূল ভিত্তি",
    "শব্দ গঠন ও বিশ্লেষণ",
    "ক্রিয়াপদের শ্রেণিবিভাগ",
    "নামপদের বিভিন্ন রূপ",
    "বাক্য গঠনের নিয়ম",
    "সর্বনাম ও তার ব্যবহার",
    "বিশেষণ ও তার প্রয়োগ",
    "কাল ও তার বিভিন্ন রূপ",
    "শর্তসূচক বাক্য",
    "প্রশ্নবোধক বাক্য গঠন",
    "নেতিবাচক বাক্যের নিয়ম",
    "সংখ্যাবাচক শব্দ",
    "দিক ও সময়ের বিবরণ",
    "তুলনামূলক বিশেষণ",
    "কুরআনের বিশেষ ব্যাকরণ",
    "আয়াত বিশ্লেষণের পদ্ধতি",
    "শব্দের অর্থ ও প্রসঙ্গ",
    "বাগধারা ও তার ব্যাখ্যা",
    "কুরআনের অলংকার",
    "ছন্দ ও তার প্রভাব",
    "তাফসীরে ব্যাকরণের ভূমিকা",
    "ব্যাকরণগত ভুল ও সংশোধন",
    "অনুশীলন ও প্রয়োগ",
    "পর্যালোচনা ও মূল্যায়ন",
    "সমাপনী ও পরবর্তী পদক্ষেপ"
];

let currentLessonIndex = 0;
let autoPlayActive = false;
let completedLessons = new Set();
let watchedLessons = new Set();

// Initialize the course
function initializeCourse() {
    updateLessonInfo();
    updateProgress();
}

function updateLessonInfo() {
    const lessonNumber = currentLessonIndex + 1;
    const bengaliNumber = convertToBengaliNumber(lessonNumber);
    const totalBengali = convertToBengaliNumber(totalLessons);
    
    document.getElementById('lessonNumber').textContent = `পাঠ ${bengaliNumber} / ${totalBengali}`;
    document.getElementById('lessonTitle').textContent = lessonTitles[currentLessonIndex];
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentLessonIndex === 0;
    document.getElementById('nextBtn').disabled = currentLessonIndex === totalLessons - 1;
    
    // Update video iframe
    const videoFrame = document.getElementById('videoFrame');
    videoFrame.src = `https://www.youtube.com/embed?list=PLKX6RwLbgFxJnQXsUj2ZA5-_FGFQp9tOE&index=${27-lessonNumber}`;
    
    // Mark as watched
    watchedLessons.add(currentLessonIndex);
    updateProgress();
}

function convertToBengaliNumber(num) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, digit => bengaliDigits[digit]);
}

function updateProgress() {
    const completedCount = completedLessons.size;
    const currentProgressPercent = Math.round(((currentLessonIndex + 1) / totalLessons) * 100);
    const completionPercent = Math.round((completedCount / totalLessons) * 100);
    
    // Update circular progress
    const circumference = 2 * Math.PI * 60; // radius = 60
    const progressRing = document.getElementById('progressRing');
    const offset = circumference - (currentProgressPercent / 100) * circumference;
    
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = offset;
    
    // Update text displays
    document.getElementById('completionText').textContent = `${currentProgressPercent}%`;
    document.getElementById('completedCount').textContent = convertToBengaliNumber(completedCount);
    document.getElementById('remainingCount').textContent = convertToBengaliNumber(totalLessons - completedCount);
    
    // Check for milestones
    checkMilestones(currentProgressPercent);
}

function checkMilestones(progressPercent) {
    const milestoneBadge = document.getElementById('milestoneBadge');
    
    if (progressPercent === 25 || progressPercent === 50 || progressPercent === 75) {
        milestoneBadge.textContent = `🎉 ${progressPercent}% সম্পন্ন!`;
        milestoneBadge.classList.add('show');
        
        setTimeout(() => {
            milestoneBadge.classList.remove('show');
        }, 4000);
    }
    
    if (progressPercent === 100) {
        document.getElementById('completionMessage').classList.add('show');
        setTimeout(() => {
            alert('🎓 অভিনন্দন! আপনি সম্পূর্ণ কোর্স শেষ করেছেন! 🎉');
        }, 1000);
    }
}

function nextLesson() {
    if (currentLessonIndex < totalLessons - 1) {
        // Mark current lesson as completed
        completedLessons.add(currentLessonIndex);
        currentLessonIndex++;
        updateLessonInfo();
    }
}

function previousLesson() {
    if (currentLessonIndex > 0) {
        currentLessonIndex--;
        updateLessonInfo();
    }
}

function toggleTheaterMode() {
    isTheaterMode = !isTheaterMode;
    const theaterBtn = document.getElementById('theaterBtn');
    
    // Toggle classes for theater mode
    const elements = {
        body: document.body,
        container: document.querySelector('.container'),
        mainContent: document.querySelector('.main-content'),
        videoSection: document.querySelector('.video-section'),
        videoFrame: document.getElementById('videoFrame'),
        sidebar: document.querySelector('.sidebar'),
        courseProgress: document.querySelector('.course-progress'),
        lessonInfo: document.querySelector('.lesson-info')
    };
    
    if (isTheaterMode) {
        // Enable theater mode
        Object.values(elements).forEach(el => el.classList.add('theater-mode'));
        theaterBtn.textContent = '🖥️ Exit Theater';
        theaterBtn.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    } else {
        // Disable theater mode
        Object.values(elements).forEach(el => el.classList.remove('theater-mode'));
        theaterBtn.textContent = '🎭 Theater Mode';
        theaterBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
    }
}

function toggleAutoPlay() {
    autoPlayActive = !autoPlayActive;
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    
    if (autoPlayActive) {
        autoPlayBtn.textContent = '⏸️ অটো বন্ধ';
        autoPlayBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
        // Auto-advance functionality would need YouTube API integration
    } else {
        autoPlayBtn.textContent = '🔄 অটো প্লে';
        autoPlayBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
}

function resetCourse() {
    currentLessonIndex = 0;
    completedLessons.clear();
    watchedLessons.clear();
    autoPlayActive = false;
    updateLessonInfo();
    document.getElementById('completionMessage').classList.remove('show');
    
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    autoPlayBtn.textContent = '🔄 অটো প্লে';
    autoPlayBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            previousLesson();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextLesson();
            break;
        case 'Escape':
            if (autoPlayActive) toggleAutoPlay();
            if (isTheaterMode) toggleTheaterMode();
            break;
        case 't':
        case 'T':
            e.preventDefault();
            toggleTheaterMode();
            break;
    }
});

// Initialize the course when page loads
document.addEventListener('DOMContentLoaded', initializeCourse);