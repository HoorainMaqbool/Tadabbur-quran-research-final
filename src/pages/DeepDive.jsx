import {useState} from 'react';
import FeatureIntro from '../components/FeatureIntro';
import {Loading,ErrorBox,BackendResponse} from '../components/Feedback';
import AyahCard from '../components/AyahCard';
import Icons from '../components/Icons';
import {callFeature} from '../lib/api';

function firstObject(data){return Array.isArray(data)?(data[0]||{}):((data&&typeof data==='object')?data:{});}

export default function DeepDive(){
  const [ref,setRef]=useState('2:153');const [lang,setLang]=useState('en');const [response,setResponse]=useState(null);const [loading,setLoading]=useState(false);const [err,setErr]=useState(null);
  async function go(e){e.preventDefault();if(!/^\d{1,3}:\d{1,3}$/.test(ref.trim())){setErr(new Error('Enter a valid ayah reference such as 2:153.'));return}setLoading(true);setErr(null);setResponse(null);try{setResponse(await callFeature('ayah_deep_dive',{requested_feature:'ayah_deep_dive',question:`Study ayah ${ref.trim()}`,ayah_reference:ref.trim(),language:lang}))}catch(x){setErr(x)}finally{setLoading(false)}}
  const data=firstObject(response?.data);
  return <section className="page"><FeatureIntro number="03" label="One ayah" title="Ayah Deep Dive" text="Study one specifically identified ayah through the dedicated n8n workflow."/>
    <form className="soft-form narrow" onSubmit={go}><div className="reference-box"><span>AYAH REFERENCE</span><input value={ref} onChange={e=>setRef(e.target.value)} inputMode="numeric"/><small>Example · 2:153</small></div><div className="form-row"><select value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="ur">Urdu</option><option value="roman_ur">Roman Urdu</option></select><button className="btn green" disabled={loading}>{loading?'Opening…':'Open Deep Dive'} <Icons name="arrow" size={16}/></button></div></form>
    {loading&&<Loading>Looking up the exact ayah…</Loading>}
    {err&&<><ErrorBox message={err.message}/><BackendResponse error={err}/></>}
    {response&&!loading&&!err&&<><BackendResponse response={response}/>{data&&(data.target_ayah||data.summary||data.arabic||data.translation||data.ai_explanation||data.key_themes||data.detailed_explanation||Array.isArray(data.reflection_questions))&&<div className="answer-area"><div className="lead-answer"><span className="eyebrow">Structured view</span><h2>{data.target_ayah||ref}</h2>{data.summary&&<p>{data.summary}</p>}</div><AyahCard ayah={{ayah_reference:data.target_ayah||ref,arabic:data.arabic||data.arabic_text,translation:data.translation||data.translation_text,ai_explanation:data.ai_explanation||data.explanation}}/>{data.key_themes&&<div className="info-block"><span className="eyebrow">Key themes</span><p>{Array.isArray(data.key_themes)?data.key_themes.join(' · '):data.key_themes}</p></div>}{data.detailed_explanation&&<div className="ai-note large"><span>AI-generated detailed explanation</span><p>{data.detailed_explanation}</p></div>}{Array.isArray(data.reflection_questions)&&<div className="info-block"><span className="eyebrow">Reflection</span><ol>{data.reflection_questions.map((x,i)=><li key={i}>{x}</li>)}</ol></div>}</div>}</>}
  </section>
}
