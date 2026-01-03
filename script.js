/* script.js */

/* --- 1. محرك القلوب (خلفية) --- */
const initHearts = () => {
    const canvas = document.getElementById('bgCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let hearts = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    class Heart {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.size = Math.random() * 8 + 4; 
            this.speed = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() { this.y -= this.speed; if(this.y < -20) this.reset(); }
        draw() {
            ctx.fillStyle = `rgba(255, 10, 84, ${this.opacity})`;
            ctx.beginPath();
            let topCurveHeight = this.size * 0.3;
            ctx.moveTo(this.x, this.y + topCurveHeight);
            ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
            ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size);
            ctx.bezierCurveTo(this.x, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
            ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
            ctx.fill();
        }
    }
    for(let i=0; i<70; i++) hearts.push(new Heart());
    const animate = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        hearts.forEach(h=>{h.update(); h.draw()});
        requestAnimationFrame(animate);
    }
    animate();
};
initHearts();

/* --- 2. التحكم في صفحة الدخول --- */
const errorMessages = [
    "هل نسيتِ تاريخنا المميز؟ 💔",
    "قلبي يؤلمني.. التاريخ خطأ",
    "حاولي تذكر أجمل أيامنا..",
    "لستِ أنتِ من ينسى.. جربي ثانية",
    "هذا ليس يومنا.."
];

function checkPass() {
    const input = document.getElementById('passInput');
    const errorDiv = document.getElementById('errorMsg');
    
    if(input && input.value === "23/12") {
        window.location.href = "home.html";
    } else if (input) {
        const randomMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        errorDiv.innerText = randomMsg;
        const box = document.querySelector('.login-card');
        box.classList.remove('shake');
        void box.offsetWidth; 
        box.classList.add('shake');
        input.value = "";
    }
}

/* --- 3. السلايدر اليدوي (Logic for Manual Slider) --- */
let currentIndex = 0;

function moveSlide(direction) {
    const track = document.getElementById('sliderTrack');
    const cards = document.querySelectorAll('.memory-card');
    const cardsPerView = window.innerWidth >= 768 ? 3 : 1; 
    const maxIndex = cards.length - cardsPerView;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = maxIndex; 
    } else if (currentIndex > maxIndex) {
        currentIndex = 0; 
    }

    const percentage = currentIndex * (100 / cardsPerView);
    track.style.transform = `translateX(${percentage}%)`;
}

/* --- 4. منطق الصفحة الرئيسية (تم التعديل حسب طلبك) --- */
if(document.getElementById('siteMusic')) {
    const siteAudio = document.getElementById('siteMusic');
    const favAudio = document.getElementById('favMusic');
    const toast = document.getElementById('toast');

    // دالة لبدء موسيقى الخلفية عند التفاعل (كليك أو سكرول أو حركة ماوس)
    function startSiteMusic() {
        if(siteAudio.paused && favAudio.paused) {
            siteAudio.volume = 0.5;
            siteAudio.play().catch(()=>{});
            // نحذف المستمعين عشان الأداء بمجرد التشغيل
            ['click', 'scroll', 'mousemove'].forEach(evt => 
                document.body.removeEventListener(evt, startSiteMusic)
            );
        }
    }

    // إضافة مستمعين للأحداث (كليك + سكرول + ماوس)
    ['click', 'scroll', 'mousemove'].forEach(evt => 
        document.body.addEventListener(evt, startSiteMusic)
    );

    // مراقب النصوص
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });
    
    const poem = document.querySelector('.poem-text');
    if(poem) observer.observe(poem);

/* --- منطق المشغل الصوتي المطور (تشغيل/إيقاف + عودة الخلفية) --- */
window.playFavorite = function() {
    const siteAudio = document.getElementById('siteMusic');
    const favAudio = document.getElementById('favMusic');
    const playBtn = document.querySelector('.play-fav-btn');
    const toast = document.getElementById('toast');

    if (favAudio.paused) {
        // تشغيل الأغنية المفضلة وإيقاف موسيقى الموقع
        siteAudio.pause();
        favAudio.currentTime = 0;
        favAudio.play();
        
        playBtn.innerText = "⏸️ إيقاف الأغنية المفضلة"; 
        
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 10000);
    } else {
        // إيقاف الأغنية المفضلة وإرجاع موسيقى الموقع فوراً
        favAudio.pause();
        siteAudio.play(); 
        playBtn.innerText = "🎵 تشغيل أغنيتكِ المفضلة";
    }
};

/* --- محرك الألعاب النارية: إصلاح نقطة الانفجار --- */
let fwChars, fwParticles, fwCanvas, fwCtx, fwW, fwH, fwCurrent;
let fwDuration = 5000; 
let fwStr = ['LOVE', 'YOU', 'RETAG'];
let fwTriggered = false;
let fwStartTime = null;

const fwColors = { 'LOVE': '#ff0a54', 'YOU': '#ffd700', 'RETAG': '#ff477e' };

function initFireworks() {
    fwCanvas = document.createElement('canvas');
    Object.assign(fwCanvas.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: '1000'
    });
    document.body.appendChild(fwCanvas);
    fwCtx = fwCanvas.getContext('2d');
    resizeFw();
}

function resizeFw() {
    fwW = fwCanvas.width = window.innerWidth;
    fwH = fwCanvas.height = window.innerHeight;
    fwParticles = fwW < 500 ? 500 : 1000; 
}

function makeChar(c) {
    let tmp = document.createElement('canvas');
    let size = tmp.width = tmp.height = fwW < 500 ? 150 : 300;
    let tmpCtx = tmp.getContext('2d');
    tmpCtx.font = 'bold ' + (fwW < 500 ? 80 : 150) + 'px Arial';
    tmpCtx.fillStyle = 'white';
    tmpCtx.textBaseline = "middle";
    tmpCtx.textAlign = "center";
    tmpCtx.fillText(c, size / 2, size / 2);
    
    let char2 = tmpCtx.getImageData(0, 0, size, size);
    let char2particles = [];
    let validPixels = [];

    for (let y = 0; y < size; y += 2) { 
        for (let x = 0; x < size; x += 2) {
            let offset = (y * size * 4) + (x * 4);
            if (char2.data[offset] > 128) { 
                validPixels.push([x - size / 2, y - size / 2]);
            }
        }
    }

    for (let i = 0; i < fwParticles; i++) {
        let p = validPixels[Math.floor(Math.random() * validPixels.length)];
        let jitter = 2;
        char2particles.push([
            p[0] + (Math.random() - 0.5) * jitter, 
            p[1] + (Math.random() - 0.5) * jitter
        ]);
    }
    return char2particles;
}

function renderFw(t) {
    if (!fwStartTime) fwStartTime = t;
    let elapsed = t - fwStartTime;
    let actual = Math.floor(elapsed / fwDuration);

    if (actual >= fwStr.length) {
        fwCtx.clearRect(0, 0, fwW, fwH);
        if (fwCanvas.parentNode) document.body.removeChild(fwCanvas);
        return;
    }

    fwCtx.clearRect(0, 0, fwW, fwH);
    fwCtx.globalCompositeOperation = 'lighter'; 
    
    let word = fwStr[actual];
    if (fwCurrent !== actual) {
        fwCurrent = actual;
        fwChars = [...word].map(makeChar);
    }

    let progress = (elapsed % fwDuration) / fwDuration;

    fwChars.forEach((pts, i) => {
        let letterSpacing = fwW < 500 ? 70 : 140; 
        let dx = (fwW / 2) + (i - (fwChars.length - 1) / 2) * letterSpacing;
        
        // توحيد الارتفاع المستهدف (Target Height) ليكون ثابتاً للمرحلتين
        let targetY = fwH * 0.4; 

        let tMod = (progress - i * 0.05);
        if (tMod < 0) return;

        if (tMod < 0.3) {
            // الصاروخ: يتحرك من أسفل الشاشة (fwH) إلى النقطة المستهدفة (targetY)
            let rocketT = tMod / 0.3;
            fwCtx.fillStyle = '#ffeba7';
            let r = 2 - 2 * rocketT;
            let currentY = fwH - (fwH - targetY) * rocketT;
            fwCtx.fillRect(dx, currentY, r * 2, r * 5);
        } else {
            // الانفجار: يبدأ من نفس النقطة المستهدفة (targetY) تماماً
            let exT = Math.min(1, (tMod - 0.3) * 1.5);
            let ease = 1 - Math.pow(1 - exT, 3);
            let drift = Math.max(0, exT - 0.7);
            let gravity = drift * drift * 1500;
            
            let color = fwColors[word];
            let opacity = progress > 0.8 ? (1 - progress) * 5 : 1;
            fwCtx.fillStyle = color;
            fwCtx.globalAlpha = Math.max(0, opacity);

            pts.forEach((xy) => {
                let px = dx + (xy[0] * ease * 1.6);
                // dy هنا هو targetY لضمان عدم وجود قفزة
                let py = targetY + (xy[1] * ease * 1.6) + gravity;
                let r = (3.5 - exT * 3.5);
                if (r > 0.1) {
                    fwCtx.fillRect(px, py, r, r);
                }
            });
            fwCtx.globalAlpha = 1;
        }
    });

    requestAnimationFrame(renderFw);
}

window.addEventListener('scroll', () => {
    let scrollPos = window.innerHeight + window.scrollY;
    let pageBottom = document.documentElement.scrollHeight;
    if (!fwTriggered && scrollPos >= pageBottom - 5) {
        fwTriggered = true;
        initFireworks();
        requestAnimationFrame(renderFw);
    }
});
}
