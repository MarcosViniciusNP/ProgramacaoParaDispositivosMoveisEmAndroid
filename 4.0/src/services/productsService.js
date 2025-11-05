// Camada de dados isolada: depois é só trocar essas funções por Firestore/Supabase.
// Assinaturas pensadas para mapear 1:1 a um CRUD em nuvem.

let _memory = [
  { id: "p1", category: "home care", name: "Shampoo Suave", price: 29.9 },
  { id: "p2", category: "profissional", name: "Máscara Reconstrutora", price: 79.9 },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function listProducts() {
  // Exemplo com “latência” para simular chamada remota
  await delay(150);
  // Em banco real, você retornaria docs do Firestore já mapeados para {id, name, ...}
  return [..._memory];
}

export async function createProduct({ category, name, price }) {
  await delay(150);
  const id = `p_${Date.now()}`;
  const p = { id, category, name, price: Number(price) };
  _memory.unshift(p);
  return p;
}

export async function updateProduct(id, { category, name, price }) {
  await delay(150);
  _memory = _memory.map((p) =>
    p.id === id ? { ...p, category, name, price: Number(price) } : p
  );
  return _memory.find((p) => p.id === id);
}

export async function deleteProduct(id) {
  await delay(150);
  _memory = _memory.filter((p) => p.id !== id);
  return true;
}