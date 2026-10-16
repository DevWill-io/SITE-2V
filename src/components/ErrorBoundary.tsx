import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  erro: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { erro: null, info: null };

  static getDerivedStateFromError(erro: Error): State {
    return { erro, info: null };
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Erro capturado:', erro, info);
    this.setState({ erro, info });
  }

  render() {
    if (this.state.erro) {
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: 40,
            background: '#19004B',
            color: '#fff',
            fontFamily: 'monospace',
            overflow: 'auto',
          }}
        >
          <h1 style={{ color: '#ff4757', marginBottom: 20 }}>
            💥 O site quebrou
          </h1>
          <p style={{ marginBottom: 20, color: '#CEBDEC' }}>
            Copie a mensagem abaixo e me manda:
          </p>
          <pre
            style={{
              background: '#240a5e',
              padding: 20,
              borderRadius: 8,
              overflow: 'auto',
              fontSize: 13,
              lineHeight: 1.6,
              border: '1px solid #8b5edd',
            }}
          >
            <strong>{this.state.erro.name}:</strong> {this.state.erro.message}
            {'\n\n'}
            {this.state.erro.stack}
            {this.state.info && (
              <>
                {'\n\n--- Component Stack ---\n'}
                {this.state.info.componentStack}
              </>
            )}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: '12px 24px',
              background: '#8b5edd',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            🔄 Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}