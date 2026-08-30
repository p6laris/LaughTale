import{e as h}from"./chunk-3YU53HBK.mjs";var S=`
.laughtale-input-otp,
.p-inputotp {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-inputotp.p-inputotp-grouped {
    gap: 0;
}

/* Individual Digit Cell */
.p-inputotp-input {
    width: 2.75rem;
    height: 3.25rem;
    font-family: inherit;
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    color: var(--p-text-color);
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    outline: none;
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
    padding: 0;
}

.p-inputotp-input:hover:not(:disabled) {
    border-color: var(--p-surface-400);
}

.p-inputotp-input:focus {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
    z-index: 2;
    position: relative;
}

.p-inputotp-input:disabled {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    cursor: not-allowed;
    opacity: 0.75;
}

/* Variant: Filled */
.p-inputotp.variant-filled .p-inputotp-input {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputotp.variant-filled .p-inputotp-input:focus {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-inputotp.size-small .p-inputotp-input {
    width: 2rem;
    height: 2.5rem;
    font-size: 1rem;
    font-weight: 600;
}
.p-inputotp.size-large .p-inputotp-input {
    width: 3.25rem;
    height: 3.75rem;
    font-size: 1.5rem;
    font-weight: 700;
}

/* Invalid State */
.p-inputotp.is-invalid .p-inputotp-input {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputotp.is-invalid .p-inputotp-input:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Grouped Layout with Joined Borders */
.p-inputotp-group {
    display: inline-flex;
    align-items: center;
}
.p-inputotp-group .p-inputotp-input:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.p-inputotp-group .p-inputotp-input:not(:first-child):not(:last-child) {
    border-radius: 0;
    margin-left: -1px;
}
.p-inputotp-group .p-inputotp-input:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
}

/* Separator between Groups */
.p-inputotp-separator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--p-text-muted);
    user-select: none;
}

/* ==================== DARK MODE ==================== */
.dark .p-inputotp-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputotp-input:hover:not(:disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputotp.variant-filled .p-inputotp-input {
    background: var(--p-surface-800);
}
.dark .p-inputotp.variant-filled .p-inputotp-input:focus {
    background: var(--p-surface-900);
}
.dark .p-inputotp-input:disabled {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-500);
}
.dark .p-inputotp-separator {
    color: var(--p-surface-400);
}
`;function x(u,a){h("laughtale-inputotp",S);let l=Number(a.length)||4,y=a.mask===!0||String(a.mask)==="true",f=a.integerOnly!==!1&&String(a.integerOnly)!=="false",v=a.grouped===!0||String(a.grouped)==="true",k=a.variant==="filled",m=a.disabled===!0||String(a.disabled)==="true",b=a.readonlyMode===!0||String(a.readonlyMode)==="true",$=a.invalid===!0||String(a.invalid)==="true",w=a.separator||"-",I=a.value||"",s=Array.from({length:l},(t,n)=>I[n]||"");function D(){u.className="laughtale-input-otp p-inputotp",k&&u.classList.add("variant-filled"),a.size&&u.classList.add(`size-${a.size}`),$&&u.classList.add("is-invalid"),m&&u.classList.add("is-disabled"),v&&u.classList.add("p-inputotp-grouped");let t=y?"password":"text",n=f?"numeric":"text",e=f?'pattern="[0-9]*"':"",r=m?"disabled":"",d=b?"readonly":"",i="";if(v&&l%2===0){let o=l/2;i+='<div class="p-inputotp-group">';for(let p=0;p<o;p++)i+=`
                    <input type="${t}"
                           class="p-inputotp-input"
                           data-index="${p}"
                           maxlength="1"
                           inputmode="${n}"
                           ${e}
                           ${r}
                           ${d}
                           value="${s[p]||""}"
                           autocomplete="off"
                           aria-label="Character ${p+1}" />
                `;i+="</div>",i+=`<span class="p-inputotp-separator">${w}</span>`,i+='<div class="p-inputotp-group">';for(let p=o;p<l;p++)i+=`
                    <input type="${t}"
                           class="p-inputotp-input"
                           data-index="${p}"
                           maxlength="1"
                           inputmode="${n}"
                           ${e}
                           ${r}
                           ${d}
                           value="${s[p]||""}"
                           autocomplete="off"
                           aria-label="Character ${p+1}" />
                `;i+="</div>"}else for(let o=0;o<l;o++)i+=`
                    <input type="${t}"
                           class="p-inputotp-input"
                           data-index="${o}"
                           maxlength="1"
                           inputmode="${n}"
                           ${e}
                           ${r}
                           ${d}
                           value="${s[o]||""}"
                           autocomplete="off"
                           aria-label="Character ${o+1}" />
                `;u.innerHTML=i,E()}function E(){let t=Array.from(u.querySelectorAll(".p-inputotp-input"));t.forEach((n,e)=>{n.addEventListener("focus",()=>{n.select()}),n.addEventListener("input",r=>{let d=r.target,i=d.value;if(f&&(i=i.replace(/\D/g,"")),i.length>0){let o=i[i.length-1];s[e]=o,d.value=o,e<l-1&&(t[e+1].focus(),t[e+1].select())}else s[e]="",d.value="";c()}),n.addEventListener("keydown",r=>{m||b||(r.key==="Backspace"?(n.value?(s[e]="",n.value="",c()):e>0&&(t[e-1].focus(),t[e-1].value="",s[e-1]="",c()),r.preventDefault()):r.key==="Delete"?(s[e]="",n.value="",c(),r.preventDefault()):r.key==="ArrowLeft"&&e>0?(t[e-1].focus(),t[e-1].select(),r.preventDefault()):r.key==="ArrowRight"&&e<l-1?(t[e+1].focus(),t[e+1].select(),r.preventDefault()):r.key==="Home"?(t[0].focus(),t[0].select(),r.preventDefault()):r.key==="End"&&(t[l-1].focus(),t[l-1].select(),r.preventDefault()))}),n.addEventListener("paste",r=>{r.preventDefault();let d=(r.clipboardData||window.clipboardData)?.getData("text")||"",i=f?d.replace(/\D/g,""):d.trim();if(i=i.slice(0,l-e),!i)return;i.split("").forEach((p,L)=>{let g=e+L;g<l&&(s[g]=p,t[g]&&(t[g].value=p))}),c();let o=Math.min(e+i.length,l-1);t[o]&&(t[o].focus(),t[o].select())})})}function c(){let t=s.join("");if(a.targetInputName){let n=u.querySelector(`input[name="${a.targetInputName}"]`);n||(n=document.createElement("input"),n.type="hidden",n.name=a.targetInputName,u.appendChild(n)),n.value=t}u.dispatchEvent(new CustomEvent("otp:change",{bubbles:!0,detail:{value:t,isComplete:t.length===l&&!s.includes("")}}))}D(),c(),(a.autofocus===!0||String(a.autofocus)==="true")&&u.querySelector(".p-inputotp-input")?.focus()}export{x as default};
