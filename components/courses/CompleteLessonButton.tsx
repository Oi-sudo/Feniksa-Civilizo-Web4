'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteLessonButton({lessonId,eo=false,en=false}:{lessonId:string;eo?:boolean;en?:boolean}){
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const router=useRouter();

  async function complete(){
    setBusy(true);setMessage('');
    const r=await fetch('/api/learning/complete-lesson',{
      method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({lessonId})
    });
    const data=await r.json();
    setBusy(false);
    if(!r.ok){setMessage(data.error||(eo?'Konservo malsukcesis':en?'Save failed':'保存失败'));return;}
    setMessage(data.courseCompleted
      ?(eo?`Leciono finita; kurskompletiga registro kreita: EST +${data.estValue}.`:en?`Lesson completed; course-completion record created: EST +${data.estValue}.`:`本课已完成，课程完成记录已生成：EST +${data.estValue}。`)
      :(eo?'La lernoregistro por ĉi tiu leciono estas konservita.':en?'The learning record for this lesson has been saved.':'本课学习记录已保存。'));
    router.refresh();
  }

  return <div className="learning-action">
    <button className="button button-primary" disabled={busy} onClick={complete}>{busy?(eo?'Konservante…':en?'Saving…':'正在保存…'):(eo?'Fini la lecionon':en?'Complete lesson':'完成本课 · Fini la lecionon')}</button>
    {message&&<p className="form-message">{message}</p>}
  </div>;
}
