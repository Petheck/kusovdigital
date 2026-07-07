(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav shrink
  var nav = document.getElementById('nav');
  var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 40); };
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // hero video: pause for reduced motion (keeps poster = after frame)
  var hv = document.getElementById('heroVid');
  if(reduce && hv){ hv.removeAttribute('autoplay'); try{hv.pause();}catch(e){} }

  // reveal on scroll
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rise').forEach(function(el){ io.observe(el); });

  // play showcase video only in view
  document.querySelectorAll('video[data-inview]').forEach(function(v){
    if(reduce){ v.removeAttribute('autoplay'); return; }
    var vo = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ v.play().catch(function(){}); } else { v.pause(); } });
    }, {threshold:.25});
    vo.observe(v);
  });

  // before/after sliders
  document.querySelectorAll('[data-ba]').forEach(function(ba){
    var after = ba.querySelector('.ba__after');
    var handle = ba.querySelector('.ba__handle');
    var tagL = ba.querySelector('.ba__tag--l');
    var tagR = ba.querySelector('.ba__tag--r');
    var pos = 55, dragging = false, nudged = false;

    function apply(p){
      pos = Math.max(2, Math.min(98, p));
      after.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
      handle.style.left = pos + '%';
      handle.setAttribute('aria-valuenow', Math.round(pos));
      tagL.style.opacity = pos < 16 ? .25 : 1;
      tagR.style.opacity = pos > 84 ? .25 : 1;
    }
    function fromEvent(x){
      var r = ba.getBoundingClientRect();
      apply(((x - r.left) / r.width) * 100);
    }
    apply(55);

    ba.addEventListener('pointerdown', function(e){ dragging = true; ba.setPointerCapture(e.pointerId); fromEvent(e.clientX); });
    ba.addEventListener('pointermove', function(e){ if(dragging) fromEvent(e.clientX); });
    ba.addEventListener('pointerup',   function(){ dragging = false; });
    ba.addEventListener('pointercancel',function(){ dragging = false; });

    handle.addEventListener('keydown', function(e){
      var step = e.shiftKey ? 10 : 3;
      if(e.key === 'ArrowLeft'){ apply(pos - step); e.preventDefault(); }
      if(e.key === 'ArrowRight'){ apply(pos + step); e.preventDefault(); }
    });

    // one-time nudge when scrolled into view
    if(!reduce){
      var no = new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting && !nudged){
            nudged = true;
            var seq = [55,42,60,50], i = 0;
            var t = setInterval(function(){ apply(seq[i++]); if(i>=seq.length) clearInterval(t); }, 260);
            no.unobserve(ba);
          }
        });
      }, {threshold:.4});
      no.observe(ba);
    }
  });

  // mobile hamburger menu
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');
  if(burger && navLinks){
    var closeMenu = function(){
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    };
    var openMenu = function(){
      navLinks.classList.add('open');
      burger.setAttribute('aria-expanded','true');
    };
    burger.addEventListener('click', function(e){
      e.stopPropagation();
      if(navLinks.classList.contains('open')) closeMenu(); else openMenu();
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function(e){
      if(navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== burger){
        closeMenu();
      }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 760) closeMenu();
    });
  }
})();
