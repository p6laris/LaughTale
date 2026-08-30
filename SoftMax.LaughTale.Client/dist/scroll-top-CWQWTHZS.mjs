import{b as a}from"./chunk-P6B5FGGY.mjs";import{e as n}from"./chunk-3YU53HBK.mjs";var c=`
[data-theme="dark"] .laughtale-scroll-top-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function d(r,t){n("scroll-top",c);let s=t.threshold||200,o=!1;function e(){r.innerHTML=`
            <button type="button" 
                    class="laughtale-scroll-top-btn" 
                    style="display: ${o?"flex":"none"}; position: fixed; bottom: 2rem; right: 2rem; z-index: 999; width: 2.75rem; height: 2.75rem; border-radius: 50%; border: none; background: var(--p-primary-600); color: #ffffff; box-shadow: var(--p-shadow-lg); cursor: pointer; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); animation: fadeIn 0.2s ease;" 
                    title="Scroll to Top">
                ${a.arrowUp}
            </button>
        `,r.querySelector(".laughtale-scroll-top-btn")?.addEventListener("click",()=>{window.scrollTo({top:0,behavior:t.behavior||"smooth"})})}let i=()=>{let l=window.scrollY>s;l!==o&&(o=l,e())};window.addEventListener("scroll",i,{passive:!0}),e()}export{d as default};
