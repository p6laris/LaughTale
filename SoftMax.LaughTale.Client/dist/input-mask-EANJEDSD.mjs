import{e as I}from"./chunk-3YU53HBK.mjs";var F=`
/* ==================== AURA INPUTMASK ==================== */
.laughtale-input-mask,
.p-inputmask {
    display: inline-flex;
    align-items: center;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-inputmask.p-inputmask-fluid {
    width: 100%;
}

.p-inputmask:hover:not(:disabled):not([readonly]) {
    border-color: var(--p-surface-400);
}

.p-inputmask:focus {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-inputmask.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-inputmask.variant-filled:hover:not(:disabled):not([readonly]) {
    background-color: var(--p-surface-200);
}
.p-inputmask.variant-filled:focus {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-inputmask.size-small,
.p-inputmask.p-inputmask-sm {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-inputmask.size-large,
.p-inputmask.p-inputmask-lg {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-inputmask.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputmask.is-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-inputmask:disabled,
.p-inputmask.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}

/* Dark mode overrides */
.dark .p-inputmask {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputmask:hover:not(:disabled):not([readonly]) {
    border-color: var(--p-surface-500);
}
.dark .p-inputmask.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-inputmask.variant-filled:hover:not(:disabled):not([readonly]) {
    background-color: var(--p-surface-700);
}
.dark .p-inputmask.variant-filled:focus {
    background-color: var(--p-surface-900);
}
.dark .p-inputmask:disabled,
.dark .p-inputmask.is-disabled {
    background-color: var(--p-surface-800);
}
`;function V(d,a){I("laughtale-input-mask",F);let g=a.mask||"(999) 999-9999",f=a.slotChar||"_",h=a.autoClear!==!1&&String(a.autoClear)!=="false",E=a.unmask===!0||String(a.unmask)==="true",z=a.fluid===!0||String(a.fluid)==="true",T=a.invalid===!0||String(a.invalid)==="true",b=a.disabled===!0||String(a.disabled)==="true",M=a.readonly===!0||String(a.readonly)==="true",$=a.variant==="filled",S=a.size||"normal",l=[],y=!1,k=0;for(let t=0;t<g.length;t++){let e=g[t];if(e==="?"){y=!0;continue}let o,n=!1;e==="9"?(o=/[0-9]/,n=!0):e==="a"?(o=/[A-Za-z]/,n=!0):e==="*"&&(o=/[A-Za-z0-9]/,n=!0);let u=n?f.length>k?f[k]:f[0]||"_":e;n&&k++,l.push({char:e,isSlot:n,isOptional:y,regex:o,slotChar:u})}function p(t){let e="",o=0,n=0,u=0;for(let i=0;i<l.length;i++){let s=l[i];if(s.isSlot){s.isOptional||u++;let v="";for(;o<t.length;){let w=t[o++];if(s.regex?.test(w)){v=w;break}}v?(e+=v,n++):e+=s.slotChar}else e+=s.char,o<t.length&&t[o]===s.char&&o++}let c="";for(let i=0;i<l.length;i++)l[i].isSlot&&i<e.length&&e[i]!==l[i].slotChar&&(c+=e[i]);return{masked:e,raw:c,isComplete:n>=u}}let L=p(a.value||""),R=a.value?L.masked:"",A=["laughtale-input-mask","p-inputmask","p-inputtext",z?"p-inputmask-fluid":"",$?"variant-filled":"",S!=="normal"?`size-${S}`:"",T?"is-invalid":"",b?"is-disabled":""].filter(Boolean).join(" ");d.innerHTML=`
        <input 
            type="text"
            class="${A}"
            value="${R}"
            placeholder="${a.placeholder||l.map(t=>t.isSlot?t.slotChar:t.char).join("")}"
            ${b?"disabled":""}
            ${M?"readonly":""}
            ${a.inputId?`id="${a.inputId}"`:""}
        />
        <input type="hidden" name="${a.name||a.targetInputName||"mask_value"}" value="" />
    `;let r=d.querySelector('input[type="text"]'),x=d.querySelector('input[type="hidden"]');function m(){let t=p(r.value),e=E?t.raw:t.masked;x&&(x.value=e),d.dispatchEvent(new CustomEvent("input-mask:change",{bubbles:!0,detail:{value:e,rawValue:t.raw,maskedValue:t.masked}})),d.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{value:e,rawValue:t.raw}}))}function C(t){for(let e=0;e<l.length;e++)if(l[e].isSlot&&t[e]===l[e].slotChar)return e;return t.length}r.addEventListener("focus",()=>{if(!r.value){r.value=l.map(e=>e.isSlot?e.slotChar:e.char).join("");let t=C(r.value);setTimeout(()=>r.setSelectionRange(t,t),10)}}),r.addEventListener("blur",()=>{let t=p(r.value);(!t.isComplete&&h&&t.raw.length===0||!t.isComplete&&h)&&(r.value=""),m()}),r.addEventListener("input",t=>{let e=t.inputType,o=r.value,n="";for(let i=0;i<o.length;i++){let s=o[i];(i<l.length&&l[i].isSlot&&s!==l[i].slotChar||i>=l.length&&/[A-Za-z0-9]/.test(s))&&(n+=s)}let u=p(n);r.value=u.masked;let c=C(r.value);r.setSelectionRange(c,c),m()}),r.addEventListener("keydown",t=>{if(t.key==="Backspace"){let e=r.selectionStart||0,o=r.selectionEnd||0;if(e===o&&e>0){t.preventDefault();let n=e-1;for(;n>=0&&!l[n].isSlot;)n--;if(n>=0){let u=r.value.split("");u[n]=l[n].slotChar,r.value=u.join(""),r.setSelectionRange(n,n),m()}}}}),m()}export{V as default};
