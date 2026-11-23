(function () {
    const loader = document.getElementById("loader");
    if (!loader) return;

    const countEl = document.getElementById("loader-count");
    const fill = document.getElementById("loader-fill");
    const status = document.getElementById("loader-status");

    const MIN_MS = 1800;
    const start = performance.now();
    let pageLoaded = document.readyState === "complete";
    window.addEventListener("load", () => { pageLoaded = true; });

    let shown = 0;
    function tick(now) {
        const t = Math.min((now - start) / MIN_MS, 1);
        let target = Math.round((1 - Math.pow(1 - t, 3)) * 100);
        if (!pageLoaded) target = Math.min(target, 90); // wait at 90% until the page is really ready
        shown = Math.max(shown, target);

        countEl.textContent = String(shown).padStart(3, "0");
        fill.style.transform = `scaleX(${shown / 100})`;

        if (shown < 100) { requestAnimationFrame(tick); return; }

        status.textContent = "Ready";
        setTimeout(() => {
            loader.classList.add("done");
            setTimeout(() => loader.remove(), 900);
        }, 350);
    }
    requestAnimationFrame(tick);
})();

const words=[
    "Aspiring Web Developer",
    "Cloudflare Explorer",
    "Frontend Learner",
    "Tech Enthusiast"
];

let wordIndex=0;
let charIndex=0;
let deleting=false;

const typing=document.getElementById("typing");

if (typing) {
    function type(){

        const current=words[wordIndex];

        if(!deleting){

            typing.textContent=current.substring(0,charIndex++);

            if(charIndex>current.length){

                deleting=true;

                setTimeout(type,1400);

                return;

            }

        }else{

            typing.textContent=current.substring(0,charIndex--);

            if(charIndex<0){

                deleting=false;

                wordIndex=(wordIndex+1)%words.length;

            }

        }

        setTimeout(type,deleting?45:90);

    }

    type();
}
