export function Loading({children='Preparing your study…'}){return <div className="feedback loading"><span className="spinner"/><span>{children}</span></div>}
export function ErrorBox({message}){return <div className="feedback error"><strong>We couldn't complete that request.</strong><p>{message}</p></div>}
