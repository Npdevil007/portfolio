window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.remove();

            const welcome = document.getElementById("welcome");

            if(welcome){
                welcome.classList.add("show");
            }

        },800);

    },2500);

});

document.addEventListener("click",(e)=>{

    if(e.target.id==="enterSite"){

        document.getElementById("welcome").style.display="none";

    }

});

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