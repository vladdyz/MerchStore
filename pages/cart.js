import { useAtom } from 'jotai';
import { cartListAtom } from '@/store';
import withAuth from '@/components/auth';

function Cart() {
  const [cartList, setCartList] = useAtom(cartListAtom);

  const removeItem = (index) => {
    // Create a new cart list excluding the item at the specified index
    const newCartList = cartList.filter((_, i) => i !== index);
    setCartList(newCartList);
  };

  return (
    <>
      <br />
      <ul>
        {cartList.map((product, index) => (
          <li key={index} className="d-flex align-items-center mb-3" style={{ display: 'flex', alignItems: 'center' }}>
            <img className="img-fluid img-thumbnail w-20 h-20 rounded" style={{ marginRight: '20px' }} src={product.image} alt={product.title} />
            <div style={{ flexGrow: 1 }}>
              <strong>{product.title}</strong>: {product.description}<br />
              <strong>${product.price.toFixed(2)}</strong>
            </div>
            <button className="btn btn-danger border rounded px-3 py-0" onClick={() => removeItem(index)}>
              Remove Item
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <ul>
        <li>
          <strong>Total: ${cartList.reduce((total, prod) => total + prod.price, 0).toFixed(2)}</strong>
        </li>
      </ul>
    </>
  );
}

export default withAuth(Cart)