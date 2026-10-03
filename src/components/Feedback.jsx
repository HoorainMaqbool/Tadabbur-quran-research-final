export function Loading({ children = 'Preparing your study…' }) {
  return <div className="feedback loading"><span className="spinner" /><span>{children}</span></div>;
}

export function ErrorBox({ message }) {
  return <div className="feedback error"><strong>Request could not be completed.</strong><p>{message}</p></div>;
}

export function BackendResponse({ response, error = null, title = 'Exact backend response' }) {
  if (!response && !error) return null;

  const status = response?.status ?? error?.status;
  const statusText = response?.statusText ?? error?.statusText ?? '';
  const rawBody = response?.rawBody ?? error?.rawBody ?? '';
  const headers = response?.headers ?? error?.headers ?? {};
  const bodyForDisplay = rawBody || '(empty response body)';
  const headerEntries = Object.entries(headers);

  return (
    <section className={`backend-response ${error ? 'backend-response-error' : ''}`}>
      <div className="backend-response-head">
        <div>
          <span className="eyebrow">{title}</span>
          <strong>{status !== undefined ? `HTTP ${status}${statusText ? ` · ${statusText}` : ''}` : 'No HTTP response'}</strong>
        </div>
        {error && <span className="backend-response-badge">Backend error</span>}
      </div>
      {headerEntries.length > 0 && (
        <details className="backend-response-meta">
          <summary>Response headers</summary>
          <pre>{JSON.stringify(Object.fromEntries(headerEntries), null, 2)}</pre>
        </details>
      )}
      <pre className="backend-response-body">{bodyForDisplay}</pre>
    </section>
  );
}
