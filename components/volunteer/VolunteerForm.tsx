'use client';
import { FormEvent,useState } from 'react';

type Props={locale:'zh'|'eo'|'en'};

const interestOptions=[
  ['esperanto_teaching','世界语教学','Esperanta instruado','Esperanto teaching'],
  ['translation','翻译','Tradukado','Translation'],
  ['proofreading','中—世—英校对','Ĉina–Esperanta–angla reviziado','Chinese–Esperanto–English proofreading'],
  ['buddhist_controlled_language','佛经受控语言整理','Kontrolita lingvo por budhaj tekstoj','Controlled language for Buddhist texts'],
  ['museum_documentation','数字博物馆资料整理','Cifereca muzea dokumentado','Digital museum documentation'],
  ['media_subtitles','视频、音频与字幕','Video, sono kaj subtitoloj','Video, audio and subtitles'],
  ['website_testing','网站测试与无障碍协助','Reteja testado kaj alireblo','Website testing and accessibility'],
  ['3d_design','3D桃花源设计','3D Persikflora Land-dezajno','3D Peach Blossom Land design'],
  ['dad_archiving','DAD治理与公共档案','DAD-regado kaj publika arkivado','DAD governance and public archiving'],
  ['elder_learning_support','长者数字学习支持','Cifereca lernhelpo por maljunuloj','Digital learning support for elders']
] as const;

const languageOptions=[
  ['zh','中文','Ĉina','Chinese'],['eo','世界语','Esperanto','Esperanto'],['en','英语','Angla','English'],
  ['fr','法语','Franca','French'],['nl','荷兰语','Nederlanda','Dutch'],['de','德语','Germana','German'],['other','其他','Alia','Other']
] as const;

function pick(locale:Props['locale'],zh:string,eo:string,en:string){return locale==='eo'?eo:locale==='en'?en:zh;}

export default function VolunteerForm({locale}:Props){
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setMessage('');
    const f=new FormData(e.currentTarget);
    const interests=f.getAll('interests').map(String);
    const languages=f.getAll('languages').map(String);
    const r=await fetch('/api/volunteer/profile',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
      interests,languages,availability:f.get('availability'),note:f.get('note'),consentPublicContact:f.get('consentPublicContact')==='on'
    })});
    const data=await r.json(); setBusy(false);
    if(!r.ok){setMessage(data.error||pick(locale,'保存失败。','Konservo malsukcesis.','Save failed.'));return;}
    setMessage(pick(locale,'参与登记已保存。以后可以再次回来修改。','La partoprena registro estas konservita. Vi povas reveni kaj ĝisdatigi ĝin.','Your participation profile has been saved. You can return and update it later.'));
  }
  return <form className="auth-form" onSubmit={submit}>
    <fieldset><legend>{pick(locale,'我愿意参与','Mi volas partopreni','I would like to help with')}</legend>
      {interestOptions.map(([value,zh,eo,en])=><label key={value}><input type="checkbox" name="interests" value={value}/> {pick(locale,zh,eo,en)}</label>)}
    </fieldset>
    <fieldset><legend>{pick(locale,'我可以使用的语言','Lingvoj, kiujn mi povas uzi','Languages I can use')}</legend>
      {languageOptions.map(([value,zh,eo,en])=><label key={value}><input type="checkbox" name="languages" value={value}/> {pick(locale,zh,eo,en)}</label>)}
    </fieldset>
    <label>{pick(locale,'可参与时间（例如：每周约2小时）','Disponebla tempo (ekz. ĉirkaŭ 2 horoj semajne)','Availability (for example, about 2 hours per week)')}
      <input name="availability" maxLength={120}/>
    </label>
    <label>{pick(locale,'想补充说明的经验、兴趣或愿望','Aldona sperto, intereso aŭ deziro','Anything else about your experience, interests or wishes')}
      <textarea name="note" rows={5} maxLength={2000}/>
    </label>
    <label><input type="checkbox" name="consentPublicContact"/> {pick(locale,'我同意未来在我再次确认后，公开我的志愿者联系卡片。','Mi konsentas, ke estonte mia volontula kontaktkarto povos esti publikigita nur post mia plia konfirmo.','I agree that a volunteer contact card may be made public in the future only after I confirm again.')}</label>
    <button className="button button-primary" disabled={busy}>{busy?pick(locale,'正在保存…','Konservante…','Saving…'):pick(locale,'保存参与登记','Konservi partoprenon','Save participation profile')}</button>
    {message&&<p className="form-message">{message}</p>}
    <p className="muted">{pick(locale,'登记志愿方向不自动授予治理权、资金权限或任何投资权益。','Volontula registrado ne aŭtomate donas regrajton, financan rajton aŭ investan profiton.','Volunteer registration does not automatically grant governance authority, financial permissions or investment rights.')}</p>
  </form>;
}
