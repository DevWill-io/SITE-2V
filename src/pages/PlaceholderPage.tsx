// ==========================================
// 🚧 PLACEHOLDER
// ==========================================
// Temporário — mostra que a rota existe.
// Cada um desses vai ser substituído por um componente real no Bloco E.
// ==========================================

interface Props {
  titulo: string;
}

export default function PlaceholderPage({ titulo }: Props) {
  return (
    <section className="container" style={{ paddingTop: 140, paddingBottom: 80 }}>
      <h1>{titulo}</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>
        🚧 Página em construção — será implementada no Bloco E.
      </p>
    </section>
  );
}