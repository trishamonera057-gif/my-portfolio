/* script.js — Dashboard version
   - Renders projects & labs (kept from original)
   - Smooth scrolling for sidebar links
   - Active link highlighting while scrolling (IntersectionObserver)
   - Mobile sidebar toggle
   - Modal (project preview) + contact small feedback
*/

/* --- Projects data (kept from your uploaded file) --- */
const PROJECTS = [
  
   
  {
    title: "Portfolio Website",
    desc: "My personal responsive portfolio built using vanilla JS and CSS grid.",
    imgs: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSblfREDbCtaqLA15R4-ya8aywHr0q0fo6YQw&s"]
  }
];

/* Render projects grid */
const projectsGrid = document.getElementById('projectsGrid');
if (projectsGrid) {
  projectsGrid.innerHTML = '';
  PROJECTS.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'card project-card';
    card.innerHTML = `
      <div class="project-thumb" style="background-image: url('${p.imgs[0]}');"></div>
      <div>
        <h4>${p.title}</h4>
        <div class="muted">${p.desc}</div>
      </div>
      <div style="margin-top:8px;">
        <button class="btn primary open-project" data-index="${idx}" type="button">View</button>
      </div>
    `;
    projectsGrid.appendChild(card);
  });
}

/* --- Labs data (Lab 1 - Lab 5) --- */
const LABS = [
  { title:'Lab Activity 1', desc:'HTML Basics Web introduction', link:'Laboratory Activities/lab1.html', thumb:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukfRFWXfiwQvyCq2Gt2EFDCdBMOsckZP4BA&s' },
  { title:'Lab Activity 2', desc:'CSS Styling and Layout', link:'Laboratory Activities/lab2.html', thumb:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5l8aQJiPJmMagK5bx_FwCmqjUsdUEVDLnVKm7DXQ-0PIv3-lCe_dAlcYwPtwuDOJz2wU&usqp=CAU' },
  { title:'Lab Activity 3', desc:'JavaScript DOM Manipulation', link:'Laboratory Activities/lab3.html', thumb:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAELCAMAAAC77XfeAAAAA1BMVEV33XcMMxzCAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADeDcYqAAE00FRDAAAAAElFTkSuQmCC' },
  { title:'Lab Activity 4', desc:'card hover', link:'Laboratory Activities/lab4.html', thumb:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7qa4ZET6H1mVzi8sFftJhvmHWfqwaPlc75A&s' },
  { title:'Lab Activity 5', desc:'toggle button', link:'Laboratory Activities/lab5.html', thumb:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5dtDehAqhYEwx42QjRi9LDAVgMtsY3ZoHxA&s' },
 
];

const labsGrid = document.getElementById('labsGrid');
if (labsGrid) {
  labsGrid.innerHTML = '';
  LABS.forEach((l, i) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="project-thumb" style="background-image: url('${l.thumb}');"></div>
      <h4>${l.title}</h4>
      <div class="muted">${l.desc}</div>
      <div style="margin-top:8px;">
        <a class="btn ghost" href="${l.link}" target="_blank" rel="noopener">Open Lab</a>
      </div>
    `;
    labsGrid.appendChild(el);
  });
}

/* -------------------------
   Sidebar & smooth scrolling
   ------------------------- */
const sidebar = document.getElementById('sidebar');
const sidebarNav = document.getElementById('sidebarNav');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const mainContent = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');

function closeMobileNav(){
  if (sidebarNav && sidebarNav.classList.contains('open')) sidebarNav.classList.remove('open');
}

/* Mobile toggle */
if (sidebarToggle){
  sidebarToggle.addEventListener('click', () => {
    sidebarNav.classList.toggle('open');
  });
}

/* Smooth scroll when clicking nav links */
navLinks.forEach(link=>{
  link.addEventListener('click', (e)=>{
    e.preventDefault();
    const href = link.getAttribute('href');
    if(!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if(target){
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
    // close mobile nav after click
    closeMobileNav();
  });
});

/* Active link highlight using IntersectionObserver */
const sections = Array.from(document.querySelectorAll('.panel'));
const sectionObserverOptions = {
  root: null,
  rootMargin: '0px 0px -40% 0px', // trigger earlier
  threshold: 0
};
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id || 'top';
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
      // Also ensure there's always a highlighted item (for header top)
      if(id === 'top'){
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#top'));
      }
    }
  });
}, sectionObserverOptions);

sections.forEach(sec => {
  sectionObserver.observe(sec);
});

/* -------------------------
   Modal behavior (open project previews)
   ------------------------- */
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');

document.addEventListener('click', (e) => {
  if (e.target.matches('.open-project') || e.target.closest('.open-project')) {
    const btn = e.target.closest('.open-project');
    const idx = Number(btn.dataset.index || 0);
    const project = PROJECTS[idx] || {title:'Project', desc:'', imgs:[]};
    openModal({
      title: project.title,
      desc: project.desc,
      img: project.imgs && project.imgs[0] ? project.imgs[0] : ''
    });
  }
});

function openModal(data){
  if(!modal) return;
  modal.setAttribute('aria-hidden','false');
  modalBody.innerHTML = `
    <div style="height:260px;border-radius:10px;background-image:url('${data.img}');background-size:cover;background-position:center;margin-bottom:12px;"></div>
    <h3>${data.title}</h3>
    <p class="muted">${data.desc}</p>
  `;
  // lock scroll
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  if(!modal) return;
  modal.setAttribute('aria-hidden','true');
  modalBody.innerHTML = '';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
window.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

/* -------------------------
   Contact form feedback
   ------------------------- */
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
if (contactForm){
  contactForm.addEventListener('submit', (e) => {
    // allow Formspree to handle the submission; show small feedback
    formMsg.textContent = 'Sending...';
    setTimeout(()=> formMsg.textContent = 'Thank you — your message was sent (Formspree).', 1200);
  });
}

/* -------------------------
   Small UX: keyboard navigation for sidebar (accessibility)
   ------------------------- */
document.addEventListener('keydown', (e) => {
  if(e.key === 'Tab') {
    // keep default, but in mobile, if sidebar is open and escape is pressed close it
  }
});

/* -------------------------
   Ensure top link active on load
   ------------------------- */
window.addEventListener('load', () => {
  // if page initially loaded scrolled to a section, sync active link
  const currentHash = location.hash || '#top';
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === currentHash));
  // small delay to let IntersectionObserver pick up
  setTimeout(()=> {
    const evt = new Event('scroll');
    window.dispatchEvent(evt);
  }, 300);
});

