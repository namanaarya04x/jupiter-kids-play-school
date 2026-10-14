(function(){
  /* Always open at the very top. Menu links scroll smoothly but never leave a #section in the address bar,
     so reloading or reopening the page cannot jump to "Our Classes" (or any other section). */
  var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
  function clearHash(){
    if(!location.hash)return;
    try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
  }
  function top(){clearHash();window.scrollTo({top:0,left:0,behavior:'instant'})}
  top();
  window.addEventListener('load',top);
  window.addEventListener('pageshow',top);
  document.addEventListener('click',function(ev){
    var a=ev.target.closest&&ev.target.closest('a[href^="#"]');
    if(!a)return;
    var id=a.getAttribute('href').slice(1);
    ev.preventDefault();
    var el=id&&id!=='home'?document.getElementById(id):null;
    var behavior=reduceMotion?'auto':'smooth';
    if(el)el.scrollIntoView({behavior:behavior,block:'start'});
    else window.scrollTo({top:0,behavior:behavior});
    clearHash();
  });
})();


(function(){
  /* OPTIONAL: paste a Formspree (or similar) endpoint here, e.g. 'https://formspree.io/f/xxxxxxxx'.
     When set, every enquiry is emailed to the school automatically, with no extra tap by the parent.
     Leave it empty to use the "Open in Gmail / Other email app / Copy details" buttons only. */
  var FORM_ENDPOINT='';

  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* Mobile menu */
  var burger=$('#burger'),nav=$('#nav');
  burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  $$('#nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')})});

  /* English / Hindi toggle */
  var lang=$('#lang'),hindi=false;
  $$('[data-hi]').forEach(function(el){el.setAttribute('data-en',el.textContent)});
  function setLang(h){
    hindi=h;
    $$('[data-hi]').forEach(function(el){el.textContent=h?el.getAttribute('data-hi'):el.getAttribute('data-en')});
    lang.textContent=h?'EN':'हिं';lang.setAttribute('aria-pressed',h);
    lang.setAttribute('aria-label',h?'Switch language to English':'Switch language to Hindi');
    document.documentElement.lang=h?'hi':'en';
  }
  lang.addEventListener('click',function(){setLang(!hindi)});

  /* Count-up stats (final values already in the markup) */
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;io.unobserve(e.target);
      var el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'',t0=null;
      function step(t){t0=t0||t;var p=Math.min((t-t0)/1100,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step);
    })},{threshold:.6});
    $$('[data-count]').forEach(function(el){io.observe(el)});
  }

  /* Active nav link + back to top */
  var links=$$('#nav a'),secs=links.map(function(a){return $(a.getAttribute('href'))});
  var up=$('#up');
  function onScroll(){
    var y=window.scrollY;up.classList.toggle('show',y>600);
    var cur=0;secs.forEach(function(s,i){if(s&&s.offsetTop-120<=y)cur=i});
    links.forEach(function(a,i){a.classList.toggle('on',i===cur&&y>80)});
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  up.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

  $('#copy-enq').addEventListener('click',function(){
    var t=$('#done-text').textContent,b=$('#copy-enq'),old=b.textContent;
    function ok(){b.textContent=hindi?'कॉपी हो गया':'Copied';setTimeout(function(){b.textContent=old},1800)}
    function sel(){var r=document.createRange();r.selectNodeContents($('#done-text'));var x=window.getSelection();x.removeAllRanges();x.addRange(r);b.textContent=hindi?'ऊपर का टेक्स्ट चुना गया है':'Text selected above';setTimeout(function(){b.textContent=old},2200)}
    try{navigator.clipboard.writeText(t).then(ok,sel)}catch(e){sel()}
  });

  /* Enquiry form: validate, then prepare the email */
  var form=$('#enq');
  function err(id,msg){$('#e-'+id).textContent=msg||''}
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var name=$('#pname').value.trim(),ph=$('#phone').value.replace(/[\s\-+]/g,''),em=$('#email').value.trim(),ok=true;
    err('pname');err('phone');err('email');
    if(name.length<2){err('pname',hindi?'कृपया अपना नाम लिखें।':'Please enter your name.');ok=false}
    if(ph.indexOf('91')===0&&ph.length===12)ph=ph.slice(2);
    if(!/^[6-9]\d{9}$/.test(ph)){err('phone',hindi?'10 अंकों का सही मोबाइल नंबर लिखें।':'Enter a valid 10-digit mobile number.');ok=false}
    if(em&&!/^\S+@\S+\.\S+$/.test(em)){err('email',hindi?'ईमेल सही नहीं है।':'That email address looks incomplete.');ok=false}
    if(!ok)return;
    var child=$('#cname').value.trim(),msg=$('#msg').value.trim();
    var text='Admission enquiry - Jupiter Kids Play School\n\nParent: '+name+'\nMobile: '+ph+'\nClass: '+$('#cls').value+(child?'\nChild: '+child:'')+(em?'\nEmail: '+em:'')+(msg?'\nMessage: '+msg:'');
    var subj='Admission enquiry: '+name+' ('+$('#cls').value+')';
    $('#gmail-send').href='https://mail.google.com/mail/?view=cm&fs=1&to=jupiterkidsplayschool@gmail.com&su='+encodeURIComponent(subj)+'&body='+encodeURIComponent(text);
    $('#mail-send').href='mailto:jupiterkidsplayschool@gmail.com?subject='+encodeURIComponent('Admission enquiry: '+name+' ('+$('#cls').value+')')+'&body='+encodeURIComponent(text);
    $('#done-text').textContent=text;
    var dm=$('#done-msg');
    dm.textContent=hindi?'आपका संदेश तैयार है। नीचे Gmail खोलें और वहाँ Send दबाएँ।':'Your message is ready. Open it in Gmail below, then press Send there.';
    $('#done').hidden=false;
    if(FORM_ENDPOINT){
      fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({parent:name,mobile:ph,class:$('#cls').value,child:child,email:em,message:msg,_subject:subj})})
        .then(function(r){if(r.ok)dm.textContent=hindi?'आपकी पूछताछ स्कूल को भेज दी गई है। धन्यवाद!':'Your enquiry has been sent to the school. Thank you!'})
        .catch(function(){});
    }
$('#done').scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'});
  });
})();
