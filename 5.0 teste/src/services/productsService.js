// src/services/productsService.js
// Firestore CRUD de Produtos

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const colRef = collection(db, "products");

export async function listProducts() {
  // Ordena por criação (opcional)
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      category: data.category,
      name: data.name,
      price: Number(data.price || 0),
    };
  });
}

export async function createProduct({ category, name, price }) {
  const p = {
    category,
    name: String(name || "").trim(),
    price: Number(price || 0),
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(colRef, p);
  return { id: ref.id, ...p };
}

export async function updateProduct(id, { category, name, price }) {
  const ref = doc(db, "products", id);
  const patch = {
    category,
    name: String(name || "").trim(),
    price: Number(price || 0),
  };
  await updateDoc(ref, patch);
  return { id, ...patch };
}

export async function deleteProduct(id) {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
  return true;
}
