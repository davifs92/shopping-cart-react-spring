import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';


interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = product.amount
    return sumAmount
  }, {} as CartItemsAmount)


  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products', {params: { page: 0, size: 12}});
      const productsFormatted = response.data.content.map(function(product: Product){
        return {...product, priceFormatted: formatPrice(product.price)}
      })
      setProducts(productsFormatted)
      
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
        <img src={product.imgUrl} alt={product.name} />
        <strong>{product.name}</strong>
        <span>{product.price}</span>
        <button
          type="button"
          data-testid="add-product-button"
          onClick={() => handleAddProduct(product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {cartItemsAmount[product.id] || 0}
          </div>

          <span>Add to Cart</span>
        </button>
      </li>
      ))}
    </ProductList>
  );
};

export default Home;
