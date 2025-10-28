import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>🛍️ ShopTastrophe 😏</h1>
      <h2>Produits disponibles :</h2>
      {products.map((p) => (
        <div key={p.id}>
          <strong>{p.name}</strong> — {(p.price_cents / 100).toFixed(2)} €
        </div>
      ))}
    </div>
  );
}

export default App;
