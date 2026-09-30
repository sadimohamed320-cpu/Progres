function loginStudent(event){
  event.preventDefault();
  const id = document.getElementById("studentId").value;
  const password = document.getElementById("studentPassword").value;
  const error = document.getElementById("loginError");
  const validId = "202532486514";
  const validPassword = "F3t4sBxP";

  if(id === validId && password === validPassword){
    document.body.classList.remove("login-locked");
    document.getElementById("loginScreen").style.display = "none";
    error.classList.remove("show");
  }else{
    error.classList.add("show");
  }
  return false;
}

let currentNavIndex = 2;
let navTransitionDirection = "left";
let touchStartX = null;
let touchStartY = null;

function setActive(btn){
  document.querySelectorAll('.navbtn').forEach(x=>x.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function clearNavTransition(){
  const modal=document.getElementById("infoModal");
  modal.classList.remove("nav-slide-out-left","nav-slide-out-right");
  const page=document.getElementById("infoPage");
  if(page) page.classList.remove("nav-slide-in-left","nav-slide-in-right","nav-slide-out-left","nav-slide-out-right");
}

function animateNavPage(){
  const page=document.getElementById("infoPage").querySelector(".portal-page");
  if(!page) return;
  page.classList.remove("nav-slide-in-left","nav-slide-in-right","nav-slide-out-left","nav-slide-out-right");
  void page.offsetWidth;
  page.classList.add(navTransitionDirection === "left" ? "nav-slide-in-left" : "nav-slide-in-right");
}

function showHomeAnimated(){
  const modal=document.getElementById("infoModal");
  if(!modal.classList.contains("show")){
    showHome();
    return;
  }
  modal.classList.remove("nav-slide-out-left","nav-slide-out-right");
  void modal.offsetWidth;
  modal.classList.add(navTransitionDirection === "left" ? "nav-slide-out-left" : "nav-slide-out-right");
  setTimeout(()=>{
    modal.classList.remove("show","nav-slide-out-left","nav-slide-out-right");
  },280);
}

function navigateNav(index, btn){
  if(index === currentNavIndex){
    setActive(btn);
    return;
  }
  const oldIndex=currentNavIndex;
  navTransitionDirection = index > oldIndex ? "left" : "right";
  setActive(btn);

  // From Home to another tab: simply bring the selected page in from the correct side.
  if(oldIndex === 2 && index !== 2){
    currentNavIndex=index;
    if(index === 0) showAccount(); else showCard();
    setTimeout(animateNavPage, 0);
    return;
  }

  // From an inner page to Home: move the current page completely off-screen.
  if(index === 2){
    currentNavIndex=index;
    showHomeAnimated();
    return;
  }

  // Between Account and Card: first move the current page to the edge,
  // then bring the requested page from the opposite side.
  const oldPage=document.getElementById("infoPage").querySelector(".portal-page");
  if(oldPage){
    oldPage.classList.remove("nav-slide-in-left","nav-slide-in-right","nav-slide-out-left","nav-slide-out-right");
    void oldPage.offsetWidth;
    oldPage.classList.add(navTransitionDirection === "left" ? "nav-slide-out-left" : "nav-slide-out-right");
  }
  setTimeout(()=>{
    currentNavIndex=index;
    if(index === 0) showAccount(); else showCard();
    setTimeout(animateNavPage, 0);
  },280);
}

function setupNavSwipe(){
  const area=document.getElementById("infoModal");
  area.addEventListener("touchstart", e=>{
    if(!e.touches.length) return;
    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
  }, {passive:true});
  area.addEventListener("touchend", e=>{
    if(touchStartX===null || !e.changedTouches.length) return;
    const dx=e.changedTouches[0].clientX-touchStartX;
    const dy=e.changedTouches[0].clientY-touchStartY;
    touchStartX=null; touchStartY=null;
    if(Math.abs(dx)<70 || Math.abs(dx)<Math.abs(dy)*1.25) return;
    // RTL navigation: swipe right -> previous tab, swipe left -> next tab.
    const next = dx>0 ? Math.max(0,currentNavIndex-1) : Math.min(2,currentNavIndex+1);
    const buttons=document.querySelectorAll('.navbtn');
    if(next!==currentNavIndex && buttons[next]) navigateNav(next, buttons[next]);
  }, {passive:true});
}

function showHome(){
  document.getElementById("infoModal").classList.remove("show","nav-slide-out-left","nav-slide-out-right");
}

function showAccount(){
  document.getElementById("infoPage").innerHTML=pageHeader("حسابي")+`
    <div class="portal-body account-page">
      <div class="account-card">
        <div class="account-row"><span class="account-label">الاسم</span><span class="account-value">رمزي عماد الدين</span></div>
        <div class="account-row"><span class="account-label">اللقب</span><span class="account-value">عطيت الله</span></div>
        <div class="account-row"><span class="account-label">مكان الميلاد</span><span class="account-value">زرالدة-الجزائر</span></div>
        <div class="account-row"><span class="account-label">تاريخ الميلاد</span><span class="account-value">2007-02-19</span></div>
        <div class="account-row"><span class="account-label">الجذع</span><span class="account-value">علوم اقتصادية و التسيير الكمي</span></div>
        <div class="account-row"><span class="account-label">الشعبة</span><span class="account-value">الاقتصاد و التسيير العمومي للضرائب</span></div>
      </div>
      <button class="logout-btn" onclick="logoutStudent()">تسجيل الخروج</button>
    </div>`;
  document.getElementById("infoModal").classList.add("show");
  animatePageText("infoPage");
}

function logoutStudent(){
  document.getElementById("infoModal").classList.remove("show");
  document.getElementById("loginScreen").style.display="flex";
  document.body.classList.add("login-locked");
  document.getElementById("studentId").value="";
  document.getElementById("studentPassword").value="";
  document.getElementById("loginError").classList.remove("show");
}

function pageHeader(title){
  return `<header class="portal-header">
    <button class="portal-back" onclick="closeInfo();closeSchedule();" aria-label="رجوع">→</button>
    <h2>${title}</h2>
  </header>`;
}

function animatePageText(pageId){
  const page=document.getElementById(pageId);
  if(!page) return;
  const selectors='h2,h3,p,.group-card,.year-pill,.day-tab,.registration-name,.registration-sub,.registration-year,.registration-tag,.previous-title,.previous-card,.service-card h3,.service-card p,.empty-title,.primary-ref-btn,.reference-table th,.reference-table td';
  page.querySelectorAll(selectors).forEach((el,i)=>{
    el.classList.remove('page-text-animate');
    void el.offsetWidth;
    el.style.animationDelay=(Math.min(i,10)*25)+'ms';
    el.classList.add('page-text-animate');
  });
}
const weeklySchedule = {
  "السبت": [
    ["08:00 - 09:00", "مبادئ الاقتصاد"],
    ["09:00 - 10:00", "المحاسبة العامة"],
    ["10:00 - 11:00", "التسويق"],
    ["11:00 - 12:00", "التجارة الإلكترونية"],
    ["13:00 - 14:00", "الإحصاء"],
  ],
  "الأحد": [
    ["08:00 - 09:00", "الاقتصاد الجزئي"],
    ["09:00 - 10:00", "المناجمنت وإدارة الأعمال"],
    ["10:00 - 11:00", "القانون التجاري"],
    ["11:00 - 12:00", "المحاسبة العامة"],
    ["13:00 - 14:00", "الرياضيات المالية"],
  ],
  "الإثنين": [
    ["08:00 - 09:00", "الاقتصاد الكلي"],
    ["09:00 - 10:00", "مبادئ الاقتصاد"],
    ["10:00 - 11:00", "التسويق"],
    ["11:00 - 12:00", "الإحصاء"],
    ["13:00 - 14:00", "التجارة الإلكترونية"],
  ],
  "الثلاثاء": [
    ["08:00 - 09:00", "المحاسبة العامة"],
    ["09:00 - 10:00", "الاقتصاد الجزئي"],
    ["10:00 - 11:00", "القانون التجاري"],
    ["11:00 - 12:00", "المناجمنت وإدارة الأعمال"],
    ["13:00 - 14:00", "الرياضيات المالية"],
  ],
  "الأربعاء": [
    ["08:00 - 09:00", "الاقتصاد الكلي"],
    ["09:00 - 10:00", "التجارة الإلكترونية"],
    ["10:00 - 11:00", "التسويق"],
    ["11:00 - 12:00", "مبادئ الاقتصاد"],
    ["13:00 - 14:00", "الإحصاء"],
  ],
  "الخميس": [
    ["08:00 - 09:00", "الاقتصاد الجزئي"],
    ["09:00 - 10:00", "المحاسبة العامة"],
    ["10:00 - 11:00", "القانون التجاري"],
    ["11:00 - 12:00", "المناجمنت وإدارة الأعمال"],
    ["13:00 - 14:00", "الرياضيات المالية"],
  ]
};

function renderScheduleDay(day){
  const rows = weeklySchedule[day] || [];
  const body = document.getElementById("scheduleDayBody");
  const title = document.getElementById("scheduleDayTitle");
  const count = document.getElementById("scheduleDayCount");
  if(!body || !title || !count) return;
  title.textContent = `مواد يوم ${day}`;
  count.textContent = `${rows.length} حصص دراسية مكثفة`;
  body.innerHTML = rows.map(([time, subject], i) =>
    `<tr><td>${i+1}</td><td>${time}</td><td><b>${subject}</b></td></tr>`
  ).join("");
  animatePageText("schedulePage");
}

function showSchedule(){
  const days = Object.keys(weeklySchedule);
  document.getElementById("schedulePage").innerHTML=pageHeader("الجدول الزمني")+`
    <div class="portal-body schedule-intensive">
      <div class="day-tabs">${days.map((d,i)=>`<button class="day-tab ${i===0?'active':''}" onclick="activateDay(this,'${d}')">${d}</button>`).join("")}</div>
      <div class="schedule-summary">
        <h3 id="scheduleDayTitle">مواد يوم ${days[0]}</h3>
        <span id="scheduleDayCount">5 حصص دراسية مكثفة</span>
      </div>
      <table class="reference-table intensive-table">
        <thead><tr><th>#</th><th>الساعة</th><th>المادة</th></tr></thead>
        <tbody id="scheduleDayBody"></tbody>
      </table>
      <div class="subjects-note">المواد تشمل تخصصات التجارة والاقتصاد والإدارة والمحاسبة والتسويق.</div>
    </div>`;
  document.getElementById("scheduleModal").classList.add("show");
  renderScheduleDay(days[0]);
}
function activateDay(btn, day){
  document.querySelectorAll("#schedulePage .day-tab").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  renderScheduleDay(day);
}
function closeSchedule(event){
  if(!event || event.target.id==="scheduleModal") document.getElementById("scheduleModal").classList.remove("show");
}

function showMessage(title,message){
  let visual="";
  let extra="";
  if(title==="تبرئة الإلكترونية"){
    visual=`<div class="icon-circle">✎</div>`; message="عذرا ، انت غير معفي";
  }else if(title==="الجدول الزمني للامتحانات"){
    visual=`<div class="icon-circle">☒</div>`; message="البيانات غير متوفرة في الوقت الحالي!";
  }else if(title==="علامات الامتحانات"){
    visual=`<img class="empty-illustration" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCAHqAhwDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAQBAgMFBggH/8QAVhABAAECAgMHDQwHBQUJAAAAAAECAwQRBRIhBhMxQVFScQcUFjI2VWFykZOh0dIVFyIzNFNUgZKxs8FjdHWUorLhCCNic/A1QkVW0xgkJURGZYPD8f/EABkBAQEAAwEAAAAAAAAAAAAAAAABAgMEBf/EACURAQACAQIGAwEBAQAAAAAAAAABAhEDBBITMTJBUQUUIWEzIv/aAAwDAQACEQMRAD8A9OgKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH1gAAAAAAI927XTcmIqmIZLFc10zNU5zmi4yLk3fgJGG2WtvDmZMMwZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAClczFFUxwxCq27GdFXQEI2/3Od6Fd/uc70MOrTzY8hqU82PIipNm7XVVMTOcZZs+aJYt0TXOdFPByJG9W+ZT5AXKws3q3zKfIuppppj4MRHQoqAINbisVeov1003JiInY2TUYz5Vc6Qhki7XVbprmc6pnLOUyxst7OVAp+Io8ZsMP2n1oq+Jmf/AMXraZzjPwzCLNdWc7ZBMEOiqrXp+FPCmKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtudpV0ItWIriqYzq4eapOIqmMpqq8kgtVW68eHySa8f4vJKKz4ft56EhBi5q8GvE+CmUmi9GpGcV8HMkGVWGLfqeSv7Eq79HNr+zIMgx77HJX9mVYuRPFX5JXKYXtRjflVzpbeJzjj+tqcb8pudMAU/E0eM2GH7Selr6fiafGbDDdpPSir7fBPTP3ok8M9KZTGUT05oc8M9IK0fGU9KahUfGU9KaqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjV6QtUV1UzTVnTMwt90rXNr8gLa+2npUYqsVRNUzlVw8inXNHJV5EVmGHrmjkqOuaeSoGVMt9pT0Nd1zRyVM9OkbVNMRNNezoBMET3Stc2v0Hula5tfoBLET3Stc2v0Hula5tfoBM4oanG/Ka+mEv3StZdrX5EHEXIu3qq6c8p5VGS3TNVmMuKpPw+e9zlytfavU0UZTnws9rHW7dOU01Tt8CCbnPHCHPDPSu90rXNq8jBOJomZ2VAzUfGU9Ka1lOKopqicqtiTTpG1VVFMU17Zy4FRKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDuaO3y5VXvuWtOeWqt9y/038KcAg+5f6aPso2Jw/W1VNOtrZxnwZNu12k/jaPFAs6P323TXvsRnxaq/3L/TR9lIwfya30MwZQfcv9NH2T3L/TfwpwGUH3L/Tfw/1Pcv8ATfw/1TgMoPuX+m/h/qe5f6b+H+qcBlB9y/038J7l/pv4U4DKD7l/pf4UbE4fre5FGtrZxnwZNxxNZpL4+PF/MMq29Hb5bpr33LWiJy1V/uX+mj7KVhvk9vxYZAyg+5f6aPsq06M1aoq33PKc+1TQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABr9J/G0dDYGUcgMWE+TW8+RlAAW3btFqnWqnoiNsz0RwzPghZE3q5nOKbVOeUcdUxlw8kbc+XZl0QGUWU2piI1rlyqqIymZnh6cti8AAAAFWs0lEzeif8AD62yMoniBjw3ye34sMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALb12mzaquVzlTTG2VzDezrv2betq07blW3ttXLKOXhmJz8ERxgpYs1TVN+9nvlUZRTM7LdOz4MeTbPH5GcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFcp5FGuuZ6XuXLEa1OComaLlUbJvVRnE0xPFTHHMcPBnskF9zStNde94GxXja4rm3VVbmIt25jZOtXOzZOyYp1qoni2ShYyjTN7SmG63xGjcHVFq7Mxcw9eJmqnWozyqiu3FPDHDEt1RRRbopot0xRRTEZUxGURHQw4quuzdsXoy1Nbe64mrLKKuCYjLbOtqxxbJmeKMwg0WN0Nu/r1Y/RWIsxHxMYO5aqmf8zfa4j7E+rJVperCXK6dI4WvC26Y1uuKZ3yzlx51RGdGXHNURHJM7ctjlxExFUZTGcTxSBnsziYnZnnG0am1TOhcfh8Nb1Y0fi6qqLVGfxF2ImvKIy7SYirj+DMRERMT8HbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiaVxNWFwNdVvW365NNm1q060xcrqimmcuSJmJmeKM54mbC4a1gsNaw9mJi3apimnWqmqdnLM7ZnlmdsyxY2Y3/AxNM1Z35y/w/wB3XOfoSpmIiZmYjIBbes0YizXZu0xVbuRNNUTwTExwI1Ol9HV2Zv04/CVWqeG5F6maYy4c5zySLN61ibVN2zcou264zproqiqmqPBMcII2GxVVu7GDxM5XojO3XOzfqY448MccfXxpnGx4jDWsXb3u9RrU5xMZTlNMxwTExtifDwwh04HSFiKqMPpKK6JnOIxVnfKqY4qYmmac4jlqznlmQRt09FWJt6PwVmcsRex+HuUzzabVyLtc8uU00TT01xHG3TXYDQ1rB3uur1+9jsbNM0TisRq6+rM5zTTFMRTRTnEbKYjPViZzmM2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABhxt+rDYequinXuT8G3Tt+FVOyI6M5jOeKM8wazTmk68PVZjC29+rs37e/VRTrU2IrnUiqrLbs14ry5tMzMxGUpkaJw9zKrFxOLuROt/ffCppnPOMqe1jLKMpiM+POZnOb6NHW5wFzB3K67kXqaqblyqdtyas9afBwzs4I4I2RlFmisVdvWZw+KqzxmHyovfA1NeeKuIzn4NURnGUzltp4YkE3hRL2i8PcuXL1qmcNibmWtiLMRTXVMcGtOWVXBwVZwlgImDxV2q7XhcVTFOItxra1NMxRdongqp/OnblOXFMTMvY12k5ot6Q0TXNc0XK8RXaiYjt6Zs3KppmeT4EVdNMNkCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFi66K9I4LDTc1avh4jVyziumiIpmPLcon6k1CxNminSeCxWpXVc1bmGiYjZTFURXMz9dqI+sE3lz+tFxuBnEVU4ixc3nFW4mKLmrnrRzauWnjy4c+CYlKAa2rTdGEir3Ts3MHqzlN2YmqzMc7fIjKmnx9X7pnHZ3V6DxczTgdJYfSFUTlNGBq64qjwzFGeUeGco8rbgNZgMPicTi40lj7cWK4o1LGHzzmxTOU1TVMbJrnKM8s4jLKJnbM7IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUBQV8qioMGMs1X7E00VRTcpmK6JyifhROccPFPBPgmdscLOqDFhr9GJs03aM4irZMTw0zwTE8kxOcfUyI9y1ctXt+s/CpqmN8tc7w07eHg8nLw5rV2i9TrUTnEcOyYmOPKY4YkFwfWIACqCqiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD5B1VerjZ3PTd0LuauW8RpOJmi9ista3hp44jiqr9EeFWF7xWMy6Lqm9VrRu4HDVYWzveM0zcpzt4bPZa2bKrmXBHg4Z8HC+LYfqmbqsTaoxWK07jqOuK6qta3cmmimZqnKmKY4I5OLi6fnOJxN/GYi5icTeuXr1yqa67lyqaqqp45mZ2zPhdPom1Re0PbtXKYqoqpqiaZ44zlsrDytzr2t0l1nZxun7/aR8/UdnG6fv9pHz9TiKMfc0LiYwmMma8PV8Tenip5J6G6pmKqYmmYmJ2xPKyxDkte8fuW97ON0/f7SPn6lOzfdNP8Ax7SXn6vW0guIY82/tu+zfdN3+0l+8Ves7N903f7SX7xV62kDELzb+277N903f7SX7xV61s7s90k16/u7pLWyyz64qz+9pgxBzb+267NN03f/AEp+81+s7NN0vf8A0p+81+tpQxBzb+247Mt0nf8A0p+9V+s7Md0nf/Sv71X62nDEHNv7bfsw3R9/9K/vVfrOy/dH3/0r+93PW1AYg5t/bbdl26Lv/pb98uetTst3Rd/9L/vlz2mqDEHOv7bWd1e6Gf8Aj+l/3y57TpNw/VR0loDSMW9MYvFaQ0bfqiLk3a6rlyxPPpmZzy5aeSNm3ZPDHHmk1hlTcXrOcvWGFxNjG4a1icLet38Pdpiu3dt1RVTXTMZxVExwwyvgPU46ot3cniacBj6q7uiLtWcxtqqw1U5fDpjPtOOqmOmNucVfe8PftYqxbxGHu27tm7TFdFyiqJprpngmJjhieVqmuHuaOtGrXMLwGLcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALb123h7Vd69cpt26ImqquucqaYjhmZ4oXNTuk3MaO3WYD3P0rTfuYWaoqqt271duK8uDW1ZjOPBOxUnPh8O6q3V1uaUi7oTcreqtYOc6L+OjZXe8Fvm08O2ds+Dj+Lcb1d7wu4DL/AGRe/e7vtK+8LuA70Xv3u77S5hx30dS85l5QdboX/Zlj6/5pegveF3Ad6L373d9p8m3a6CwG5rdNjdE6MtTZweGmiLdE1zVNMTRTVO2dvDMs6y4t1ozSuZc3pDAWtI4aqzcyjPbTVzZ5XOaP0riNB4irA4yJm1TOXi+GPA6xq9O6IjSWHmu3EdcW4+DPOjmspc2naO23RsrV2i/bpuWqoroqjOJjjXOBw2k8do+KrVi/VajPbTNMTt6Jicmbsi0r9MnzdHqTiZzt58O4HD9kWlfplXm6PUdkWlfplXm6PUcR9ezuBw/ZFpX6ZV5uj1HZFpX6ZV5uj1HEfXs7gcP2RaV+mVebo9R2RaV+mVebo9RxH17O4HD9kWlfplXm6PUdkWlfplXm6PUcR9ezuBw3ZDpX6bV5uj1HZDpb6bV5uj2TiPrWdyOG7IdLfTavN0eydkOlvptXm6PZOI+vZ3I4bsh0r9Nq83R7L7Z1GNwOB3e7k7+lNL4/SEYijGV2I3ibdNOrFFExsmidudUnEtdre04hxjuepx1SLm5S9GjtJV13ND3Ks8+2qwkzw1RHMnjj6444ntveK3O98tM+dtf9M94vc73y01521/00m8S6tLa62nbMS+iWrtu/apvWrlFy3XTFdNdE60VRPBMTHDC9ptyu5ixuS0b7nYTG47E4emua7dOKrpq3rPhinKmMo8HhbhrepH9AEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUHnXqpd3ulfGt/h0vRbzp1Uu73SvjW/w6GVOrz/kOyHKANrx2qx+5zC4/ETfmqu3VVHwtTLbPKjdiGF+fvej1N8JiGcalvbQ9iGF+fv8Ao9R2IYX5+/6PU3wcMHNt7aHsQwvz9/0eo7EML8/f9Hqb4OGDm29tD2IYX5+/6PUdiGF+fv8Ao9TfBwwc23toexDC/P3/AEeo7EML8/f9Hqb4OGDm29tD2IYX5+/6PUtr3I4WMv7+9wxHF6nQMd3ZFPjQcMLGrb20vYhhfn7/AKPUdiGF+fv+j1N8GDm29tD2IYX5+/6PU9Ef2ftHW9GbiMRZt111xVj7ledXD2luPyfFX3XqI9yF79dr/koY2j8deyvadT9l9AAansAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoq86dVLu90r41v8ADoei3nTqpd3ulfGt/h0MqdXn/IdkOUAbXjgANbj9P4LRuKow1+a9erKZmmnOKOn+jYxMVRExwTta7H7n8FpHFU4m/FzXjKJimrKKun+jYxEU0xEZREbIgZ24cRw9VQy/oDBE0lpOxorD7/iNbKZ1YimM5mWTA42zpDDU4ixMzRVs2xlMTySx6S0Zh9KWIs4jWyic4mmcpiV+BwNnR2Gpw9iJiinbtnOZnlkZ/wDPB/UgAYDFiOCjx4+9lYsR2tH+ZT94sMoAg+69RHuQvfrtf8lD4U+69RHuQvfrtf8AJQxv0duw/wBH0ABpe2AAAAAAAAAAAAAAAAAAAAAAAAAAMFWJ25Uxs8K/EV6tGXHKKCVavRXOU7JZEGJ1ZieROic4zAAAAAAAAAAAAAAAAUVedOql3e6V8a3+HQ9FvOnVS7vdK+Nb/DoZU6vP+Q7IcoA2vHAAGHWuYjPeqtS3z47aroz4I8PGvu075TFExE01bKs+OORfw/1FiWGcJamc6puTP+ZV69hFiq3Eb1drjLhiuZqienPb6WYDMrLVya/g1U6tccMZ+mOWF/EsuU51U1xOVVM7fDHHH5/UvEAAGLEdrb/zKfvZWHE9rR49P3iwzACD7r1Ee5C9+u1/yUPhT7r1Ee5C9+u1/wAlDG/R27D/AFfQAGl7YAAAAAAAAAAAAAAAAAAADHevb3siM5Yuua8+IxNMxXE8uxiBIoxMTsqjV8LNExMZxOcIK6i5NE7DImC23ci5GccPIuBFxFWtcmM9kbGNWqc6pnllbx5IqsptHaU9CFlmnUxlTEckKgAAAAAAAAAAAAAAAoq86dVLu90r41v8Oh6LedOql3e6V8a3+HQyp1ef8h2Q5QBteOAAAAAAAAAAMWI4KPHp+9lY78ZxR48feEMjP1ji/ot+f/jn1MD1nHax0MbWw6tttudn9eULuGvWKYqu2bluJnKJqpyz8r7j1Ee5C9+u3P5KGDq5dy+C/Xqfw62fqI9yF79dr/koYzOaunQ0eVr8P8fQAGt6oAAAAAAAAAAAAAAAAAAAC27RvlExxocxlOU8KcwYi3/vx9YQjzGZGcTlP1KqTGexFXU1TROcSlxXFVGtHBkhUzwxPDCRh5ziqniUYFscMz4V3Ato7WOVBktU61ymExgw1O2a+TgZ1QAAAAAAAAAAAAAAABV506qXd7pXxrf4dD0U86dVLu90r41v8KhnTq8/5DshyoDa8cAAAAAzAADAAAsuRnFPjQvUqjg6QhXoei46p25HKP8Axi35uv2XnQ/1wpauXRobi2jnhfVeqxuw0Huh0BhcNozH04m9Ri6blVNNFUZU6lUZ7Y5Zh0HUR7kL367X/JQ+FPuvUR7kL365cn+ChjaMQ6dtqzqa3FZ9AAanrgAAAAAAAAAAAAAAAAAAABMROyQBEu25tz4FidNMVRMTGxHrw0xtpmJ6TAj1Zx8KOL7kjCxnMzxZLYw9yeGMmaxRvcTbzzmmdoZYMTbm3FVURsnbClFqqrKIielIv7aKY5aqY+rNk4AypRTFFMRCoAAAAAAAAAAAAAAAPIvvm7s/+ZNJedl66eHmdXFu7TGMOl98vdlP/qXSfnpafHab0npLFV4vGY/E4i/cy17ly5M1VZRl90IQycM2merN15ifpF37Uqdd4n6Rd+3LEKxwy9d4j6Re+3LWaT0pjrN+KbeMv0xq8EXJ8Kc0+mPlNPi/nKN2hWJss92dJfTsT5yUjA6Vx93FUU143EVROezfJ5GrStG/LKPr+4dmpSvDP46Hri/9Iv8AnavWp1xf+kYjztXrWCvNZOucRH/mL/navWdc4j6Rf85V62MDEMvXWI+kXvOSdd4n6Re+3LEBiGWcZiYy/wC8Xftyr15ifn7v2pR6uGnp/JcGIZuvcT8/d+1KvX2K+fufaYAyYhn6/wAV8/c8rqup9uu09gt0ehtG4fSuKtYO/pGxF2xTX8GuKrlMTnHhjY45utxHdpoD9pYb8WlJZ6f5aMPY4DU9kAFAAAAAAAAAAAAAAAAAAAAAAFlfwblNWWyfgz+X+vCvW3YmbdWXDG2OkFt3bctU/wCKZ9EsjHPwr1HizP3LrlymiM5BcI9WJq4oiOlTrm54PIZMJIj04mc/hUxl4GemqK4zjgBUAAAAAAAAAAAB4ee4Xh5nVwbzwAM3EAANPpj5TT4v5y3CBj8BdxV6K6KqIiIy25o26Foi3606Vo35ZR9f3MvuPiOfa8s+pmwmjbuHxFNyqq3MRw5TI676tZicS2QCvOABQARbV21HT+S5bV21HTP3LhfAAA3W4ju00B+0sN+LS0rcbjapp3X6DqjhjSGHmPOUpLKndD2SNV1/iOf6ISt/uc70Q1PahLEXf7nO9EG/3Od6IMmEoRd/uc70Qb/c53ogyYShE64uZx8L0Qrv9zneiDJhKEXf7nO9EG/3Od6IMmEoRqL1yqumJq2TPIkgAAAAAAAAAAAAAAKqAMNmZ32aZ/3aYj0z6oYL9edczPRCRbj+/uzlsyiIRqqZmqa9uVW2OgFsRM8M5eBWGWzZm5Oc7IhIi1REbKYTC5QknDROrVyMm90c2PIuVFVAAAAAABbvlHPp8oLhTfKOfT5YN8o59PlgFRbvlHPp8sKb/Z+dt/agF7w89vRet1TsuUT0VPELOrh3ngAZuEAAAAAEABQAAARbV21HTP3LltXbUdM/cuF8AADb7j+63Qn6/h/xKWobfcf3W6E/aGH/ABKUllTuh6tT0CE9pe3AAAACnHCqnHCoAALrfxlPTCYh2/jKemExUAAAAAAAAAAAAAAAAYq8516Y4aqoj0QyzEcGUZMcRE355Y2+iGQAAAAAAAAAAFKu1lCTau1lCCABFEGeGelOQZ4Z6QZMN8ZPQ8bPZOG7eeh42Z0cG98ADY4QAAAAAAAAAAARbX21HjflK5bX21vxvylcL4AAG53Fxnux0FH/ALjhvxKWmbncX3Y6C/aOG/FpSWVO6HrjUp5sLgaXtwAAAApxwqpxwqAAC638ZT0wmIdv4ynphMVAAAAAAAAAAAAAWXapotzMcLB1xc5QShF64ucp1xc5YMmGeimN9uVdEej+q9F3+uOM64ucpkwlCL1xc5V9q9XVXETOyQZwAAAAAAAUq7WUJNq7WUJCAAUW6lPNhcApFMRwREPFr2m8WQ2UcG98ADNwgAAAAAAAAAAAi2vtrfjflK5bX21HT+S4XwAANzuL7sdBftHDfi0tM3O4vux0F+0cN+LSksqd0PXQDS9uAAAAFOOFVOOFQAAXW/jKemExDt/GU9MJioAAAAAAAAAAAAsvxnamIiZlEmJjZlKci4iMrshDHlPIas8hlOQimrPIZTyExMcJGczkBlLJZpmLlM5Tkxym0bKI6FhFQAAAAAAAUq7WUJNq7WUJCAAUAAeLIe03iyGyjg3vgAZuEAAAAAAAAAAAEW1dtR0z9y5bV21HTP3LhQABudxfdjoL9o4b8Wlpm53F92Ogv2jhvxaUllTuh66AaXtwAAAApxwqpxwqAAC638ZT0wmIdv4ynphMVAAAAAAAAAAAABHxMfDjoSEfFdtHQEMOe1XZwqKIqsTy8ZOzZEgBwp0bIhCp7aOlNWEAAAAAAAAUq7WUJNq7WUJCAAUAAeLIe03ixso4N74AGbhAAGG9jLGHqim5XqzMZ5ZSzNPpj5TT4v5yjZpUi1sSne6eE+d/hn1L7eOw96uKLdzWqniyn1NAk6N+WW/r+4dFtvWIy3oCuIAFABFtXbUdM/cuW1dtR0z9y4WejrNwXU50j1QJx0YDF4TDdZ73r9cTVGtr62WWUTzZdfP9m/dFH/FtFeW57Laf2Z+33R9GF/8AtfccmubS79Hb1tTil4o0nga9F6SxeAu1U13MLersVVU8EzTVMTMeDY2G4vux0F+0cN+LSt3X91um/wBfxH4lSu42dXdfoOeTSGH/ABKWc9HJERF8Q9diP11/g9KQ0vZgAAABTjhVTjhUAS6MLbqopqnPOYiWHE2qbVVMU57Y4wWW/jKemExDtfGU9MJioAAAAAAAAAAAApVVTRGdUxEeFGxN61Vq5XKJ4eOEi5bpvUTRXtiWpxNneb1VMZxHF0BCRvlHOp8pvlHOp8qEZf6yRU3fKOdT5TfKOdT5ULL/AFkZf6yBOouW9aM66Y28qbTdt1zlRXTV0Tm0jZ4HDU26IuT29UehYEoAQAAAAABSrtZQk2rtZ6EIIAEUQauGelOQau2npBlw3bz0PGr2Vhu3noeNWdHBvfAA2OAAAafTHymnxfzluGn0x8pp8X85Rv2/cgJWjfllH1/cipWjfltv6/uIdup2y3oCvLAAABVtXbU9P5LlJ4aelUJdTuG6oulup/ONnReHwN7rze9865oqqy1NbLLVqp50ur/7Ru6zvfoPzN3/AKj5WJiGddW0RiJSNJY65pTSOKx96mim7ir1d6uKImKYqqqmZyz4tqfuP7rdCfr+H/Epaht9x/ddoTh/2hh/xKSUpObQ9Wp6AntL24AAAAU44VU44VBOt3rcW6YmuNkQwYqumuqmaZzyYAF1r4yjpj70xDt/GU9MJioAAAAAAAAAAAAE0xPDET0wAKatPNp8hq082nyKgKatPNp8hq082nyKgKalPNjyKgAAAAAAAABO3Ys3m3zYXgLN5t82DebfNheAs3m3zYWdZ2Pm4ZgGKnC2aJzpoy6JlyHvN7he8Frz1z2naCsbVi3VxfvN7hO8Frz1z2j3m9wneC15657TtAynLr6cX7ze4TvBa89c9o95vcJ3gteeue07QMnLr6cX7ze4TvBa89c9pju9RLqf3qta5uds1TwZzeu+07gMkUrHSHCe8Z1O/wDlqx5677S631EOp9aqiqjc5YiqOPfrntO5DK8MenF+83uF7wWvPXPaPeb3Cd4LXnrntO0BjyqenF+83uE7wWvPXPaPeb3Cd4LXnrntO0DK8uvpxfvN7hO8Frz1z2j3m9wveC15657TtAycuvpxPvMbhu8dHnrntHvM7hu8dHnrntO2A5dfTifeY3Dd46PPXPaPeY3Dd46PPXPadsBy6+nFe8zuG7x0eeue0yYTqRbi8Di7OLw+h6bd+xcpu264u1/BqpnOJ4eKYdiBy6+kb3OsclXlZOtqOWplEZsXW1HLUdbUctTKBli62o5ajrajlqZQMsXW1HLJ1tRy1MoGWLrajlqOtqOWplAY4w9EVRMTOxkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==" alt="">`; message="البيانات غير متوفرة في الوقت الحالي!";
  }else if(title==="كشف النقاط"){
    extra=`<div class="year-row"><div class="year-pill">2025/2026</div><div class="year-pill">2025/2026</div></div>`;
    visual=`<img class="empty-illustration" src="data:image/jpeg;base64,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" alt="">`;
  }else if(title==="النسبة المئوية للمقاييس"){
    visual=`<div class="icon-circle">%</div>`;
  }else{
    visual=`<div class="icon-circle">▦</div>`;
  }
  document.getElementById("infoPage").innerHTML=pageHeader(title)+`
    <div class="portal-body">${extra}
      <div class="empty-state" style="${extra?'min-height:calc(100vh - 340px)':''}">
        ${visual}<h3 class="empty-title">${message}</h3>
      </div>
    </div>`;
  document.getElementById("infoModal").classList.add("show");
  animatePageText("infoPage");
}
function showCard(){
  document.getElementById("infoPage").innerHTML=pageHeader("بطاقتي")+`
    <div class="portal-body">
      <div class="empty-state" style="min-height:calc(100vh - 150px);padding:80px 25px 40px;justify-content:flex-start">
        <h3 class="empty-title" style="color:#e53935;font-family:"Tajawal",sans-serif;font-size:30px;line-height:1.8;font-weight:800;max-width:620px;margin-top:90px">
          يرجى دفع حقوق التسجيل لاكتساب بقايا مميزات التطبيق كبطاقة الطالب، خدمات النقل و الإطعام
        </h3>
      </div>
    </div>`;
  document.getElementById("infoModal").classList.add("show");
  animatePageText("infoPage");
}
function showGroup(){
  document.getElementById("infoPage").innerHTML=pageHeader("المجموعة و الفوج")+`
    <div class="portal-body">
      <div class="group-card" style="margin:40px auto 15px;max-width:560px;text-align:center">المجموعة: 11</div>
      <div class="group-card" style="margin:15px auto;max-width:560px;text-align:center">الفوج: 42</div>
    </div>`;
  document.getElementById("infoModal").classList.add("show");
  animatePageText("infoPage");
}
function showRegistration(){
  document.getElementById("infoPage").innerHTML=pageHeader("تسجيلي")+`
    <div class="portal-body">
      <div class="registration-card" onclick="showRegistrationDetails()" style="cursor:pointer" role="button" tabindex="0" aria-label="تفاصيل تخصص 2026/2027">
        <div class="registration-top"><div><div class="registration-name">الليسانس</div><div class="registration-sub">الليسانس</div></div><div style="display:flex;align-items:center;gap:14px"><span class="badge">L2</span><div class="registration-year">▣ 2026/2027</div></div></div>
        <div class="registration-line"></div>
        <div style="font-size:22px">🏛️ جامعة الجزائر 3</div>
        <div class="registration-tags"><span class="registration-tag">الاقتصاد و التسيير العمومي للضرائب</span></div>
      </div>
      <div class="previous-title">التسجيلات السابقة　◷</div>
      <div class="previous-card">
        <div class="line"><div><b style="font-size:27px">الليسانس</b><div class="muted">الليسانس · 2025/2026</div></div><span class="badge">L1</span></div>
        <div style="margin-top:20px;color:#8d96a4;font-size:20px">المؤسسة الجامعية</div>
        <div style="font-size:25px;margin-top:4px">جامعة الجزائر 3</div>
        <span class="tag">الرياضيات التطبيقية + العلوم الاقتصادية</span>
      </div>
    </div>`;
  document.getElementById("infoModal").classList.add("show");
  animatePageText("infoPage");
}

function showRegistrationDetails(){
  document.getElementById("infoPage").innerHTML=pageHeader("تفاصيل الشعبة")+`
    <div class="portal-body" style="padding:32px 22px 120px">
      <div class="account-card" style="width:min(100%,620px);margin:0 auto">
        <div class="account-row"><span class="account-label">العام الدراسي</span><span class="account-value">2026/2027</span></div>
        <div class="account-row"><span class="account-label">المرحلة الدراسية</span><span class="account-value" style="display:flex;align-items:center;gap:10px;justify-content:flex-end">الليسانس 2 <span class="badge">L2</span></span></div>
        <div class="account-row"><span class="account-label">مسؤول الفرع</span><span class="account-value">هواري عبد الوهاب</span></div>
        <div class="account-row"><span class="account-label">الاستاذ المشكل</span><span class="account-value">ضيف الله سيد علي</span></div>
      </div>
    </div>`;
  document.getElementById("infoModal").classList.add("show");
  animatePageText("infoPage");
}
function showUniversityServices(){
  document.getElementById("infoPage").innerHTML=pageHeader("خدمات جامعية")+`
    <div class="portal-body"><div class="service-grid">
      <div class="service-card food"><div class="service-icon">🍴</div><div><h3>الإطعام</h3><p>قائمة الإطعام، الحجز</p></div></div>
      <div class="service-card transport"><div class="service-icon">🚌</div><div><h3>مخطط النقل</h3><p>الحافلات، المواعيد، المسارات...</p></div></div>
    </div></div>`;
  document.getElementById("infoModal").classList.add("show");
  animatePageText("infoPage");
}

function closeInfo(event){
  if(!event || event.target.id==="infoModal"){
    document.getElementById("infoModal").classList.remove("show");
  }
}

function toggleDarkMode(){
  document.body.classList.toggle("dark-mode");
  const enabled=document.body.classList.contains("dark-mode");
  try{localStorage.setItem("studentPortalDarkMode", enabled ? "1" : "0");}catch(e){}
}
(function(){
  try{
    if(localStorage.getItem("studentPortalDarkMode")==="1") document.body.classList.add("dark-mode");
  }catch(e){}
})();

setupNavSwipe();