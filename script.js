const $=s=>document.querySelector(s);
$('#menuBtn').addEventListener('click',()=>$('#nav').classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));
$('#scanBtn').addEventListener('click',()=>{
 const t=$('#sample').value.trim(), out=$('#scanResult');
 if(!t){out.className='result warn';out.textContent='اكتب نص الرسالة أو الرابط أولًا.';return;}
 const checks=[
  [/كلمة المرور|رمز التحقق|رمز الدخول|otp|password|verification code/i,'طلب كلمة مرور أو رمز تحقق'],
  [/فورًا|حالًا|عاجل|خلال\\s*\\d+|دقائق|سيتم إغلاق|آخر فرصة/i,'لغة استعجال أو تهديد'],
  [/ربحت|جائزة|مبروك|هدية|تحويل مالي|رسوم شحن/i,'وعد بجائزة أو طلب مالي'],
  [/bit\\.ly|tinyurl|t\\.co|cutt\\.ly|shorturl/i,'رابط مختصر يحتاج إلى تحقق'],
  [/https?:\\/\\/|www\\./i,'يحتوي النص على عنوان ويب؛ تحقق من النطاق يدويًا']
 ];
 const hits=checks.filter(([r])=>r.test(t)).map(x=>x[1]);
 out.className='result '+(hits.length?'warn':'safe');
 out.innerHTML=hits.length?'<b>مؤشرات تستحق الانتباه:</b><ul>'+hits.map(x=>'<li>'+x+'</li>').join('')+'</ul><b>التوصية:</b> لا تضغط الرابط ولا تشارك بياناتك. تحقق من الجهة عبر تطبيقها أو موقعها الرسمي.':'لم نعثر على مؤشرات التحذير المحددة في هذا الفحص. هذا لا يعني أن الرسالة آمنة؛ تحقق من المرسل والرابط من مصدر مستقل.';
});
$('#caseChoices').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 document.querySelectorAll('#caseChoices button').forEach(x=>x.disabled=true);
 const f=$('#caseFeedback');f.className='result '+(b.dataset.correct==='true'?'safe':'warn');
 f.textContent=b.dataset.correct==='true'?'أحسنت! هذا هو التصرف الأكثر أمانًا. لا تدخل بياناتك عبر رابط الرسالة، وتحقق من المصدر الرسمي.':'هذا الاختيار قد يعرّض بياناتك للخطر. تذكّر: لا تشارك كلمة المرور أو رمز التحقق، وتحقق من الجهة من قناة رسمية.';
});
const questions=[
 {q:'طلب منك متصل رمز التحقق الذي وصلك. ماذا تفعل؟',a:['أشاركه معه','أرفض وأتواصل مع الجهة عبر رقمها الرسمي','أرسله إذا كان المتصل يعرف اسمي'],c:1,e:'رمز التحقق سري ولا يُشارك مع أي شخص.'},
 {q:'وصل رابط يهدد بإغلاق حسابك خلال دقائق. ما الأفضل؟',a:['أضغط بسرعة','أعيد إرسال الرابط','أفتح التطبيق الرسمي بنفسي للتحقق'],c:2,e:'الاستعجال والتهديد من علامات التصيد الشائعة.'},
 {q:'كيف تتعامل مع فيديو مثير للجدل لشخص مشهور؟',a:['أتحقق من مصادر موثوقة قبل نشره','أصدقه فورًا','أعيد نشره دون مصدر'],c:0,e:'قد تكون المقاطع معدلة أو خارج سياقها.'},
 {q:'ما أفضل طريقة لحماية الحساب؟',a:['كلمة مرور واحدة لكل المواقع','كلمة مرور فريدة مع المصادقة الثنائية','إرسال كلمة المرور لصديق'],c:1,e:'استخدم كلمات مرور فريدة ومصادقة ثنائية.'},
 {q:'اكتشفت معاملة مالية لا تعرفها. ماذا تفعل؟',a:['أتجاهلها','أنشر بيانات البطاقة لطلب المساعدة','أتصل بالبنك من رقمه الرسمي فورًا'],c:2,e:'أبلغ البنك فورًا عبر قناة رسمية واطلب تأمين وسيلة الدفع.'}
];
let qi=0,score=0,answered=false;
function renderQ(){const q=questions[qi];$('#qCount').textContent=`السؤال ${qi+1} من ${questions.length} · النتيجة ${score}`;$('#question').textContent=q.q;$('#answers').innerHTML='';$('#quizFeedback').textContent='';$('#quizFeedback').className='result';$('#nextQ').disabled=true;$('#nextQ').textContent=qi===questions.length-1?'عرض النتيجة':'السؤال التالي';$('#progressBar').style.width=((qi+1)/questions.length*100)+'%';answered=false;q.a.forEach((v,i)=>{const b=document.createElement('button');b.textContent=v;b.addEventListener('click',()=>choose(i));$('#answers').appendChild(b);});}
function choose(i){if(answered)return;answered=true;const q=questions[qi];[...$('#answers').children].forEach((b,j)=>{b.disabled=true;if(j===q.c)b.classList.add('correct');if(j===i&&i!==q.c)b.classList.add('wrong');});if(i===q.c)score++;$('#quizFeedback').className='result '+(i===q.c?'safe':'warn');$('#quizFeedback').textContent=(i===q.c?'إجابة صحيحة! ':'ليست الإجابة الصحيحة. ')+q.e;$('#nextQ').disabled=false;}
$('#nextQ').addEventListener('click',()=>{if(!answered)return;if(qi<questions.length-1){qi++;renderQ();}else{$('#qCount').textContent='اكتمل الاختبار';$('#question').textContent=`نتيجتك: ${score} من ${questions.length}`;$('#answers').innerHTML='<p>استمر في التعلم والممارسة؛ الوعي الرقمي مهارة تتطور باستمرار.</p>';$('#quizFeedback').textContent='يمكنك إعادة الاختبار لمراجعة المعلومات.';$('#nextQ').textContent='إعادة الاختبار';$('#nextQ').disabled=false;$('#nextQ').onclick=()=>{qi=0;score=0;$('#nextQ').onclick=null;renderQ();};}});
renderQ();
