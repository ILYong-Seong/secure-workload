// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-up').forEach(element => {
    observer.observe(element);
});

// Form Submission (Google Sheets Integration)
// To use this, replace GOOGLE_APPS_SCRIPT_URL with your actual deployed web app URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbze8iIFpbtu1hfjTVnjubm20If5Q-_1_8Rcbmsy8pqoTxavviMz6PjuQCeoJI5PQxK5gw/exec';

const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loader = submitBtn.querySelector('.loader');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI Loading State
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';
    submitBtn.disabled = true;
    formMessage.textContent = '';
    formMessage.className = 'form-message';
    
    // Get form data
    const formData = new FormData(form);
    
    try {
        if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            // Simulation mode if URL is not set
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form data:', Object.fromEntries(formData));
            
            formMessage.textContent = '제출이 완료되었습니다! (현재는 시뮬레이션 모드입니다. Google Apps Script URL을 설정해주세요.)';
            formMessage.classList.add('success');
            form.reset();
        } else {
            // Actual submission
            const urlEncodedData = new URLSearchParams(formData).toString();
            await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData
            });
            
            // no-cors mode returns an opaque response, so we assume success if no network error was thrown
            formMessage.textContent = '성공적으로 등록되었습니다. 안내 메일을 확인해주세요!';
            formMessage.classList.add('success');
            form.reset();
        }
    } catch (error) {
        console.error('Error!', error.message);
        formMessage.textContent = '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        formMessage.classList.add('error');
    } finally {
        // Reset UI State
        btnText.style.display = 'inline-block';
        loader.style.display = 'none';
        submitBtn.disabled = false;
    }
});
