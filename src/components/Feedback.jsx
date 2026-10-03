export function Loading({children='Preparing your study…'}){return <div className="feedback loading"><span className="spinner"/><span>{children}</span></div>}

export function ErrorBox({message}){return <div className="feedback error"><strong>Request did not complete normally.</strong><p>{message}</p></div>}

export function BackendResponse({response,error=null}){
  if(!response&&!error)return null;
  const source=response||error;
  const status=source?.status;
  const statusText=source?.statusText||'';
  const rawBody=source?.rawBody??'';
  const headers=source?.headers||{};
  const body=rawBody===''?'(empty response body)':rawBody;
  return <section className={`backend-response ${error?'backend-response-error':''}`}>
    <div className="backend-response-head">
      <div><span className="eyebrow">Raw n8n response</span><strong>{status!==undefined?`HTTP ${status}${statusText?` · ${statusText}`:''}`:'No HTTP response'}</strong></div>
      {error&&<span className="backend-response-badge">Backend HTTP error</span>}
    </div>
    <div className="backend-response-body-wrap"><div className="backend-response-label">Response body — unchanged</div><pre className="backend-response-body">{body}</pre></div>
    <details className="backend-response-meta"><summary>Response headers</summary><pre>{JSON.stringify(headers,null,2)}</pre></details>
  </section>
}
