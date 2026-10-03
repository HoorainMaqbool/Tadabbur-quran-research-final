import {useState} from 'react';
import FeatureIntro from '../components/FeatureIntro';
import {Loading,ErrorBox,BackendResponse} from '../components/Feedback';
import {callFeature,saveSession} from '../lib/api';
import Icons from '../components/Icons';
export default function LearningPlan(){
  const [f,setF]=useState({surah:'Al-Baqarah',start_ayah:'153',end_ayah:'155',minutes_per_day:'20',language:'en'});const [response,setResponse]=useState(null);const [loading,setLoading]=useState(false);const [err,setErr]=useState(null);
  function set(k,v){setF(x=>({...x,[k]:v}))}
  async function go(e){e.preventDefault();setLoading(true);setErr(null);setResponse(null);try{const r=await callFeature('learning_plan',{requested_feature:'learning_plan',...f});setResponse(r);saveSession('tadabbur_learning_plan',r.data)}catch(x){setErr(x)}finally{setLoading(false)}}
  const data=response?.data;const plan=data?.plan;
  const sessions=Array.isArray(plan?.sessions)?plan.sessions:[];
  return <section className="page"><FeatureIntro number="04" label="Structured study" title="Learning Plan" text="Build a study sequence from a selected Surah and ayah range. The current project keeps learning progress session-based."/>
    <form className="soft-form grid-form" onSubmit={go}><label>Surah<input value={f.surah} onChange={e=>set('surah',e.target.value)}/></label><label>Start ayah<input value={f.start_ayah} onChange={e=>set('start_ayah',e.target.value)} inputMode="numeric"/></label><label>End ayah<input value={f.end_ayah} onChange={e=>set('end_ayah',e.target.value)} inputMode="numeric"/></label><label>Minutes per day<input value={f.minutes_per_day} onChange={e=>set('minutes_per_day',e.target.value)} inputMode="numeric"/></label><label>Language<select value={f.language} onChange={e=>set('language',e.target.value)}><option value="en">English</option><option value="ur">Urdu</option><option value="roman_ur">Roman Urdu</option></select></label><div className="form-end"><button className="btn green" disabled={loading}>{loading?'Building plan…':'Create plan'} <Icons name="arrow" size={16}/></button></div></form>
    {loading&&<Loading>Organizing the selected ayah range…</Loading>}{err&&<><ErrorBox message={err.message}/><BackendResponse error={err}/></>}
    {response&&!loading&&!err&&<>{data&&typeof data==='object'&&plan&&<div className="plan-area"><div className="plan-summary"><span className="eyebrow">Current study plan</span><h2>{plan.title||'Study plan'}</h2><p>{plan.surah?.name||f.surah} · {plan.ayah_range?.start||f.start_ayah}–{plan.ayah_range?.end||f.end_ayah} · {plan.total_sessions||0} session(s)</p></div>{sessions.map((s,i)=><article className="session" key={i}><div className="session-index">{String(i+1).padStart(2,'0')}</div><div><span>Session {i+1}</span><h3>{s.ayah_range||s.title||'Study session'}</h3>{s.focus&&<p>{s.focus}</p>}{Array.isArray(s.study_steps)&&<ul>{s.study_steps.map((x,j)=><li key={j}>{x}</li>)}</ul>}{s.reflection_question&&<div className="reflection"><span>Reflection</span><p>{s.reflection_question}</p></div>}</div></article>)}</div>}{<BackendResponse response={response}/>}</>}
  </section>
}
