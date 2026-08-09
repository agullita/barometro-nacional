import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link href="/" style={{ color: "#00529F", textDecoration: "underline" }}>
        Volver al inicio
      </Link>
    </div>
  );
}
